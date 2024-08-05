const express = require('express');
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;
const path = require('path');
const logger = require('./logger.js');
const bodyParser = require('body-parser');
const { getFullData } = require('./variables.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5501');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, pragma, cache-control');
    next();
});*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5501');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, pragma, cache-control, x-goog-authuser');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  
    // Обработка предварительных запросов
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

app.get('/getFullObject', async (req, res) => {
    let siteObjects;
    await handleData();

    getFullData();
    siteObjects = state.fullData;
    console.log(siteObjects);
    res.json(siteObjects);
});

app.get('/getSites', async (req, res) => {
    let sites;
    await handleData();

    sites = state.sites;
    console.log(sites);
    res.json(sites);
})

app.get('/getSiteMessages', async (req, res) => {
    let siteMessages;
    await handleData();

    siteMessages = state.sitesMessages;
    res.json(siteMessages);
})

app.get('/sendStatic', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/getCategoriesData', async (req, res) => {
    await handleData();
    const bankrotCategories = state.dataBankrot.map(category => category);
    const realtyCategories = state.data.map(category => category);
    const rosimCategories = state.dataRosim.map(category => category);
    const artCategories = state.dataArt.map(category => category);
    const categoriesData = [
        bankrotCategories,
        realtyCategories,
        rosimCategories,
        artCategories
    ];

    res.json(categoriesData);
})

app.post('/', async (req, res) => {
    await handleData();
    const chatData = req.body
    const answer = getAnswerForTest(chatData);
    res.send(answer);
})

app.post('/actOnQuestion', async (req, res) => {
    await handleData();
    const chatData = req.body.chatData;
    console.log(`Ответ на сервере ${chatData}`)
    const answer = getAnswer(chatData);
    console.log(`Ответ на сервере ${answer}`)
    if (answer)
        res.json(answer);
    else
        res.json('Нет ответа');
})

const PORT = 3000;

const getAnswer = (chatData) => {
    let answer;
    let site;

    const siteIndex = state.sites.findIndex(site => site === chatData); //Сайты
    if (siteIndex !== -1) {
        answer = state.sitesMessages[siteIndex];
    }

    const categoryIndexArt = state.dataArt.findIndex(category => category.category === chatData); //Категория арт
    if (categoryIndexArt !== -1) {
        answer = state.categoriesArtMessages[categoryIndexArt];
    }

    const categoryIndexRealty = state.data.findIndex(category => category.category === chatData); //Категория realty
    if (categoryIndexRealty !== -1) {
        if (categoryIndexRealty == 7) {
            answer = "Перейдите по ссылке - https://realty.viomitra.ru/rate";
            return answer;
        }
        answer = state.categoriesRealtyMessages[categoryIndexRealty];
    }

    const categoryIndexRosim = state.dataRosim.findIndex(category => category.category === chatData); //Категория росимущество
    if (categoryIndexRosim !== -1) {
        answer = state.categoriesRosimMessages[categoryIndexRosim];
    }

    const categoryIndexBankrot = state.dataBankrot.findIndex(category => category.category === chatData); //Категория банкротство
    if (categoryIndexBankrot !== -1) {
        answer = state.categoriesBankrotMessages[categoryIndexBankrot];
    }

    state.dataArt.forEach(category => { //Вопросы Арт
        if (category.questions) {
            category.questions.forEach(qa => {
                if (qa.answer && qa.answer.text) {
                    if (qa.question === chatData) {
                        answer = qa.answer.text;
                    }
                } else if (qa.answer && qa.answer.richText) {
                    if (qa.question == chatData) {
                        let text = '';
                        for (const element of qa.answer.richText) {
                            text += element.text;
                        }
                        answer = text;
                    }
                }
                else if (qa.question === chatData) {
                    answer = qa.answer;
                }
            });
        }
    });

    state.data.forEach(category => { //Подкатегории и вопросы Realty
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                if (sub.name == chatData) {
                    console.log(JSON.stringify(sub));
                    console.log(`Код 1 ` + answer);
                    if (sub.questions) {
                        console.log(`Код 2 ` + answer);
                        sub.questions.forEach(q => {
                            if (q.question) {
                                console.log(`Код 3 ` + answer);
                                answer = `Вы выбрали подкатегорию ${sub.name}. Какой вопрос вас интересует?`;
                            } else {
                                console.log(`Код 4 ` + answer);
                                answer = q.answer;
                            }
                        })
                    }
                } else {
                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                if (q.answer && q.answer.richText) {
                                    if (q.question == chatData) {
                                        let text = '';
                                        for (const element of q.answer.richText) {
                                            text += element.text;
                                        }
                                        answer = text;
                                        console.log(`Код 5 ` + answer);
                                    }
                                }
                                else if (q.question == chatData) {
                                    answer = q.answer;
                                    console.log(`Код 6 ` + answer);
                                } 
                            }
                        })
                    }
                }
            });
        }
    });

    state.dataRosim.forEach(category => { //Подкатегории и вопросы росимущество
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                if (sub.name == chatData) {
                    console.log(JSON.stringify(sub));

                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                answer = `Вы выбрали подкатегорию ${sub.name}. Какой вопрос вас интересует?`;
                            } else {
                                answer = q.answer;
                            }
                        })
                    }
                } else {
                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                if (q.answer && q.answer.richText) {
                                    if (q.question == chatData) {
                                        let text = '';
                                        for (const element of q.answer.richText) {
                                            text += element.text;
                                        }
                                        answer = text;
                                    }
                                }
                                else if (q.question == chatData) {
                                    answer = q.answer;
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    state.dataBankrot.forEach(category => { //Подкатегории и вопросы банкротство
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                if (sub.name == chatData) {
                    //console.log(JSON.stringify(sub));

                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                answer = `Вы выбрали подкатегорию ${sub.name}. Какой вопрос вас интересует?`;
                            } else {
                                answer = q.answer;
                                //console.log(answer);
                            }
                        })
                    }
                } else {
                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                if (q.answer && q.answer.richText) {
                                    if (q.question == chatData) {
                                        let text = '';
                                        for (const element of q.answer.richText) {
                                            text += element.text;
                                        }
                                        answer = text;
                                        console.log(answer);
                                    }
                                }
                                else if (q.question == chatData) {
                                    answer = q.answer;
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    const phrase = String(chatData);
    const keywords = ["Viomitra", "Росимущество"];

    let extractedText = '';

    keywords.forEach(keyword => {
        const startIndex = phrase.indexOf(keyword);

        if (startIndex !== -1) {
            extractedText += phrase.slice(startIndex);
        }
    });

    if (extractedText.trim() !== '') {
        console.log(extractedText.trim());
    } else {
        console.log("Ключевые слова не найдены в фразе.");
    }

    site = extractedText;

    logger.chatLogger("Пользователь написал в чат", chatData, "Chat-bot", site, answer);
    return answer;
}

const getAnswerForTest = (chatData) => {
    let answer;
    let site;

    const siteIndex = state.sites.findIndex(site => site === chatData.question); //Сайты
    if (siteIndex !== -1) {
        answer = state.sitesMessages[siteIndex];
    }

    const categoryIndexArt = state.dataArt.findIndex(category => category.category === chatData.question); //Категория арт
    if (categoryIndexArt !== -1) {
        answer = state.categoriesArtMessages[categoryIndexArt];
    }

    const categoryIndexRealty = state.data.findIndex(category => category.category === chatData.question); //Категория realty
    if (categoryIndexRealty !== -1) {
        answer = state.categoriesRealtyMessages[categoryIndexRealty];
    }

    const categoryIndexRosim = state.dataRosim.findIndex(category => category.category === chatData.question); //Категория росимущество
    if (categoryIndexRosim !== -1) {
        answer = state.categoriesRosimMessages[categoryIndexRosim];
    }

    const categoryIndexBankrot = state.dataBankrot.findIndex(category => category.category === chatData.question); //Категория банкротство
    if (categoryIndexBankrot !== -1) {
        answer = state.categoriesBankrotMessages[categoryIndexBankrot];
    }

    state.dataArt.forEach(category => { //Вопросы Арт
        if (category.questions) {
            category.questions.forEach(qa => {
                if (qa.answer && qa.answer.text) {
                    if (qa.question === chatData.question) {
                        answer = qa.answer.text;
                    }
                } else if (qa.answer && qa.answer.richText) {
                    if (qa.question == chatData.question) {
                        let text = '';
                        for (const element of qa.answer.richText) {
                            text += element.text;
                        }
                        answer = text;
                    }
                }
                else if (qa.question === chatData.question) {
                    answer = qa.answer;
                }
            });
        }
    });

    state.data.forEach(category => { //Подкатегории и вопросы Realty
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                if (sub.name == chatData.question) {
                    console.log(JSON.stringify(sub));

                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                answer = `Вы выбрали подкатегорию ${sub.name}. Какой вопрос вас интересует?`;
                            } else {
                                answer = q.answer;
                            }
                        })
                    }
                } else {
                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                if (q.answer && q.answer.richText) {
                                    if (q.question == chatData.question) {
                                        let text = '';
                                        for (const element of q.answer.richText) {
                                            text += element.text;
                                        }
                                        answer = text;
                                    }
                                }
                                else if (q.question == chatData.question) {
                                    answer = q.answer;
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    state.dataRosim.forEach(category => { //Подкатегории и вопросы росимущество
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                if (sub.name == chatData.question) {
                    console.log(JSON.stringify(sub));

                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                answer = `Вы выбрали подкатегорию ${sub.name}. Какой вопрос вас интересует?`;
                            } else {
                                answer = q.answer;
                            }
                        })
                    }
                } else {
                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                if (q.answer && q.answer.richText) {
                                    if (q.question == chatData.question) {
                                        let text = '';
                                        for (const element of q.answer.richText) {
                                            text += element.text;
                                        }
                                        answer = text;
                                    }
                                }
                                else if (q.question == chatData.question) {
                                    answer = q.answer;
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    state.dataBankrot.forEach(category => { //Подкатегории и вопросы банкротство
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                if (sub.name == chatData.question) {
                    console.log(JSON.stringify(sub));

                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                answer = `Вы выбрали подкатегорию ${sub.name}. Какой вопрос вас интересует?`;
                            } else {
                                answer = q.answer;
                            }
                        })
                    }
                } else {
                    if (sub.questions) {
                        sub.questions.forEach(q => {
                            if (q.question) {
                                if (q.answer && q.answer.richText) {
                                    if (q.question == chatData.question) {
                                        let text = '';
                                        for (const element of q.answer.richText) {
                                            text += element.text;
                                        }
                                        answer = text;
                                    }
                                }
                                else if (q.question == chatData.question) {
                                    answer = q.answer;
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    const phrase = chatData.question;
    const keywords = ["Viomitra", "Росимущество"];

    let extractedText = '';

    keywords.forEach(keyword => {
        const startIndex = phrase.indexOf(keyword);

        if (startIndex !== -1) {
            extractedText += phrase.slice(startIndex);
        }
    });

    if (extractedText.trim() !== '') {
        console.log(extractedText.trim());
    } else {
        console.log("Ключевые слова не найдены в фразе.");
    }

    site = extractedText;

    logger.chatLogger("Пользователь написал в чат", chatData.question, "Chat-bot", site, answer);
    return answer;
};

app.listen(PORT, () => {
    logger.startLogger(`Сервер запущен на порту ${PORT}`, PORT, "Web-bot");
});



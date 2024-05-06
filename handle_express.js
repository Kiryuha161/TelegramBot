const express = require('express');
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;
const path = require('path');
const logger = require('./logger.js');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/', async (req, res) => {
    const chatData = req.body;
    let answer;
    await handleData();

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

    logger.chatLogger("Пользователь написал в чат", chatData.question, "Chat-bot", site, answer)

    res.send(answer);
})

const PORT = 3000;

app.listen(PORT, () => {
    logger.startLogger(`Сервер запущен на порту ${PORT}`, PORT, "Web-bot");
});



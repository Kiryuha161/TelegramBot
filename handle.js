const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;
const http = require('http');

//const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');
const bot = new Telegraf('7003796600:AAGb5yvtAOPefwtTArVgVPQMGxKl-G2JzNY');

/* bot.telegram.setWebhook('https://bot.viomitra.ru/');

const server = http.createServer(bot.webhookCallback('https://bot.viomitra.ru/'));

server.listen(443, () => {
  console.log('Server is running on port 443');
}); 
 */
let messageInfo = "";

const SPECIAL_CHARS = [
    //'\\',
    '_',
    '*',
    '[',
    ']',
    //'(',
    //')',
    '~',
    '`',
    //'>',
    //'<',
    '&',
    '#',
    '+',
    //'-',
    '=',
    '|',
    '{',
    '}',
    '.',
    '!',
    //'-',
    '\''
]

const escapeMarkdown = (text) => {
    SPECIAL_CHARS.forEach(char => (text = text.replaceAll(char, `\\${char}`)))
    return text
}

const getRealtySubcategoriesButtons = (chapter) => {
    let subcategories = [];

    const data = state.data.find(category => category.category === chapter);

    if (data && Array.isArray(data.subcategories)) {
        subcategories = data.subcategories;
    }

    let subcategoriesButton = Markup.keyboard(
        subcategories.map(subcategory => Markup.button.callback(subcategory.name))
    );

    return subcategoriesButton;
}

const getBankrotSubcategoriesButtons = (chapter) => {
    let subcategories = [];

    const data = state.dataBankrot.find(category => category.category === chapter);

    if (data && Array.isArray(data.subcategories)) {
        subcategories = data.subcategories;
    }

    let subcategoriesButton = Markup.keyboard(
        subcategories.map(subcategory => Markup.button.callback(subcategory.name))
    );

    return subcategoriesButton;
}

const getRosimSubcategoriesButtons = (chapter) => {
    let subcategories = [];

    const data = state.dataRosim.find(category => category.category === chapter);

    if (data && Array.isArray(data.subcategories)) {
        subcategories = data.subcategories;
    }

    let subcategoriesButton = Markup.keyboard(
        subcategories.map(subcategory => Markup.button.callback(subcategory.name))
    );

    return subcategoriesButton;
}

const getQuestionsAndAnswersRealty = (category, subcategoryIndex) => {
    let questionsAndAnswers = {};

    const categoryData = state.data.find(item => item.category === category);
    if (categoryData && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > subcategoryIndex) {
        const subcategory = categoryData.subcategories[subcategoryIndex];
        questionsAndAnswers.subcategory = subcategory.name;
        questionsAndAnswers.questions = subcategory.questions.map(question => question.question);
        questionsAndAnswers.answers = subcategory.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const getQuestionsAndAnswersBankrot = (category, subcategoryIndex) => {
    let questionsAndAnswers = {};

    const categoryData = state.dataBankrot.find(item => item.category === category);
    if (categoryData && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > subcategoryIndex) {
        const subcategory = categoryData.subcategories[subcategoryIndex];
        questionsAndAnswers.subcategory = subcategory.name;
        questionsAndAnswers.questions = subcategory.questions.map(question => question.question);
        questionsAndAnswers.answers = subcategory.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const getQuestionsAndAnswersRosim = (category, subcategoryIndex) => {
    let questionsAndAnswers = {};

    const categoryData = state.dataRosim.find(item => item.category === category);
    if (categoryData && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > subcategoryIndex) {
        const subcategory = categoryData.subcategories[subcategoryIndex];
        questionsAndAnswers.subcategory = subcategory.name;
        questionsAndAnswers.questions = subcategory.questions.map(question => question.question);
        questionsAndAnswers.answers = subcategory.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const getQuestionsAndAnswersArt = (category) => {
    let questionsAndAnswers = {};

    const categoryData = state.dataArt.find(item => item.category === category);
    if (categoryData) {
        questionsAndAnswers.category = categoryData.category;
        questionsAndAnswers.questions = categoryData.questions.map(question => question.question);
        questionsAndAnswers.answers = categoryData.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const feedbackButton = Markup.keyboard([
    Markup.button.callback("Бот помог"),
    Markup.button.callback("Связаться с оператором"),
    Markup.button.callback("Задать другой вопрос")
])

const runBot = async () => {
    await handleData();
    console.log(state.data);

    let sitesButton = Markup.keyboard(state.sites.map(site => Markup.button.callback(site)));
    const uniqueRealtyCategories = new Set(state.data.map(category => category.category));
    const uniqueBankrotCategories = new Set(state.dataBankrot.map(category => category.category));
    const uniqueRosimCategories = new Set(state.dataRosim.map(category => category.category));
    const uniqueArtCategories = new Set(state.dataArt.map(category => category.category))

    let realtyCategoriesButton = Markup.keyboard(
        [...uniqueRealtyCategories]
            .filter(category => category) // Фильтрация пустых или неопределенных значений
            .map(category => Markup.button.callback(category))
    );

    let bankrotCategoriesButton = Markup.keyboard(
        [...uniqueBankrotCategories]
            .filter(category => category)
            .map(category => Markup.button.callback(category))
    )

    let rosimCategoriesButton = Markup.keyboard(
        [...uniqueRosimCategories]
            .filter(category => category)
            .map(category => Markup.button.callback(category))
    )

    let artCategoriesButton = Markup.keyboard(
        [...uniqueArtCategories]
            .filter(category => category)
            .map(category => Markup.button.callback(category))
    )


    let realtySubcategoriesRegistrationButton = getRealtySubcategoriesButtons(String(state.data[0].category));
    let realtySubcategoriesBuyButton = getRealtySubcategoriesButtons(String(state.data[1].category));
    let realtySubcategoriesPossibleBuyerButton = getRealtySubcategoriesButtons(String(state.data[2].category));
    let realtySubcategoriesSellButton = getRealtySubcategoriesButtons(String(state.data[3].category));
    let realtySubcategoriesPossibleSellerButton = getRealtySubcategoriesButtons(String(state.data[4].category));
    let realtySubcategoriesTechnicalQuestionsButton = getRealtySubcategoriesButtons(String(state.data[5].category));
    let realtySubcagtegoriesReviewButton = getRealtySubcategoriesButtons(String(state.data[6].category));
    let realtySubcategoriesLegalForceButton = getRealtySubcategoriesButtons(String(state.data[8].category));

    let bankrotSubcategoriesDepositButtons = getBankrotSubcategoriesButtons(String(state.dataBankrot[0].category));
    let bankrotApplicationOnParticipationToTradeButtons = getBankrotSubcategoriesButtons(String(state.dataBankrot[2].category));
    let bankrotRegistrationButtons = getBankrotSubcategoriesButtons(String(state.dataBankrot[3].category));
    let bankrotTechnicalQuestionButtons = getBankrotSubcategoriesButtons(String(state.dataBankrot[4].category));
    let bankrotSignatureButtons = getBankrotSubcategoriesButtons(String(state.dataBankrot[5].category));
    let bankrotTradeButtons = getBankrotSubcategoriesButtons(String(state.dataBankrot[6].category));

    let rosimSubcategoriesDepositButtons = getRosimSubcategoriesButtons(String(state.dataRosim[0].category));
    let rosimApplicateionOnParticipationToTradeButtons = getRosimSubcategoriesButtons(String(state.dataRosim[2].category));
    let rosimSubcategoriesRegistrationButtons = getRosimSubcategoriesButtons(String(state.dataRosim[3].category));
    let rosimSubcategoriesTechnicalQuestionButtons = getRosimSubcategoriesButtons(String(state.dataRosim[4].category));
    let rosimSubcategoriesSignatureButtons = getRosimSubcategoriesButtons(String(state.dataRosim[5].category));
    let rosimSubcategoriesTradeButtons = getRosimSubcategoriesButtons(String(state.dataRosim[6].category));

    bot.start((ctx) => {
        if (ctx.message.from.username) {
            ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, sitesButton);
        } else if (ctx.message.from.first_name) {
            ctx.replyWithMarkdown(`Привет, ${ctx.message.from.first_name}! С какой площадкой вам нужна помощь?`, sitesButton);
        } else {
            ctx.replyWithMarkdown('Привет! С какой площадкой вам нужна помощь?', sitesButton)
        }
    })

    //ВЫБОР САЙТОВ
    bot.hears(String(state.sites[0]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Банкротство", bankrotCategoriesButton);
    })

    bot.hears(String(state.sites[1]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Коммерческие торги", realtyCategoriesButton);
    })

    bot.hears(String(state.sites[2]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Росимущество", rosimCategoriesButton);
    })

    bot.hears(String(state.sites[3]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Арт. Выберите категорию вопроса", artCategoriesButton);
    })

    //АРТ
    bot.hears(String(state.dataArt[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersArt(state.dataArt[0].category).questions))
    })

    bot.hears(String(state.dataArt[1].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали личный кабинет. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersArt(state.dataArt[1].category).questions))
    })

    bot.hears(String(state.dataArt[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали доставка. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersArt(state.dataArt[2].category).questions))
    })

    bot.hears(String(state.dataArt[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали размещение объявления. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersArt(state.dataArt[3].category).questions))
    })

    bot.hears(String(state.dataArt[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали стоимость. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersArt(state.dataArt[4].category).questions))
    })

    bot.hears(String(state.dataArt[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали оплата. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersArt(state.dataArt[5].category).questions))
    })

    //Как я могу зарегистрироваться как самозанятый, фл, юл, ип
    bot.hears(state.dataArt[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //регистрация на площадке
    bot.hears(state.dataArt[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //какая нужна эцп
    bot.hears(state.dataArt[1].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //какие данные заполнять
    bot.hears(state.dataArt[1].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[1].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //получение на почту активации
    bot.hears(state.dataArt[1].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[1].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Кто осуществляет доставку
    bot.hears(state.dataArt[2].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //На ком лежит ответственность по доставке
    bot.hears(state.dataArt[2].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //Будет ли страховка по доставке
    bot.hears(state.dataArt[2].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //Доставка самолётом возможна
    bot.hears(state.dataArt[2].questions[3].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[3].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Кто будет платить за торги
    bot.hears(state.dataArt[3].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[3].questions[0].answer.text, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Какой лучше вид аукциона выбрать
    bot.hears(state.dataArt[3].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[3].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Ювелирка
    bot.hears(state.dataArt[3].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[3].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Какую цену указывать
    bot.hears(state.dataArt[4].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Может ли цена понизиться
    bot.hears(state.dataArt[4].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[4].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //какой процент берет митра. Не работает почему-то
    bot.hears(state.dataArt[5].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //какой процент по результатам торгов
    bot.hears(state.dataArt[5].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //какая выгода для вас
    bot.hears(state.dataArt[5].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //как будет списываться комиссия
    bot.hears(state.dataArt[5].questions[3].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[3].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //какой счёт указывать
    bot.hears(state.dataArt[5].questions[4].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[4].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //на чей расчётный счёт будет поступать оплата
    bot.hears(state.dataArt[5].questions[5].question, (ctx) => {
        //ctx.replyWithMarkdown(state.dataArt[5].questions[5].answer, feedbackButton);
        const answer = state.dataArt[5].questions[5].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //РОСИМУЩЕСТВО
    bot.hears(String(state.dataRosim[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали задаток. Выберите подкатегорию вопроса.", rosimSubcategoriesDepositButtons);
    });

    bot.hears(String(state.dataRosim[1].category), (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[0].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    bot.hears(String(state.dataRosim[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали заявка на участие в торгах. Выберите подкатегорию вопроса.", rosimApplicateionOnParticipationToTradeButtons);
    });

    bot.hears(String(state.dataRosim[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация участника. Выберите подкатегорию вопроса.", rosimSubcategoriesRegistrationButtons);
    });

    bot.hears(String(state.dataRosim[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали технические вопросы. Выберите подкатегорию вопроса.", rosimSubcategoriesTechnicalQuestionButtons);
    });

    bot.hears(String(state.dataRosim[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали ЭЦП. Выберите подкатегорию вопроса.", rosimSubcategoriesSignatureButtons);
    });

    bot.hears(String(state.dataRosim[6].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали торги. Выберите подкатегорию вопроса.", rosimSubcategoriesTradeButtons);
    });

    //возврат задатка
    bot.hears(state.dataRosim[0].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[0].answer.text, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //внесение задатка
    bot.hears(state.dataRosim[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Срок рассмотрения заявки
    bot.hears(state.dataRosim[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как посмотреть заявку
    bot.hears(state.dataRosim[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRosim(state.dataRosim[2].category, 1).answers, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как подать заявку
    bot.hears(state.dataRosim[2].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Кто может подать заявку
    bot.hears(state.dataRosim[2].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как отозвать заявку
    bot.hears(state.dataRosim[2].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как отредактировать заявку
    bot.hears(state.dataRosim[2].subcategories[5].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[5].questions[0].answer, feedbackButton);
        const answer = state.dataRosim[2].subcategories[5].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //При попытке подать заявку регламент
    bot.hears(state.dataRosim[2].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //При попытке подать заявку юр действия
    bot.hears(state.dataRosim[2].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //ускорение
    bot.hears(state.dataRosim[2].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как подать заявку регламент
    bot.hears(state.dataRosim[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Время рассмотрения заявки
    bot.hears(state.dataRosim[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Время рассмотрения заявки на присоедниение
    bot.hears(state.dataRosim[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Время рассмотрения на юр действия
    bot.hears(state.dataRosim[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Регистрация на площадке
    bot.hears(state.dataRosim[3].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация на площадке. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRosim(state.dataRosim[3].category, 4).questions))
    });

    //Какие данные заполнять
    bot.hears(state.dataRosim[3].subcategories[4].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Получлили на почту код
    bot.hears(state.dataRosim[3].subcategories[4].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Начал регистрацию по этп
    bot.hears(state.dataRosim[3].subcategories[4].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Какие документы по регистрации необходимы
    bot.hears(state.dataRosim[3].subcategories[4].questions[3].question, (ctx) => {
        //ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[3].answer, feedbackButton);
        const answer = state.dataBankrot[3].subcategories[4].questions[3].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Как начать регистрацию
    bot.hears(state.dataRosim[3].subcategories[4].questions[4].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[4].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Можно ли подать одновременно заявку
    bot.hears(state.dataRosim[3].subcategories[4].questions[5].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[5].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Проверка заполненных данных
    bot.hears(state.dataRosim[3].subcategories[4].questions[6].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[6].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Что делать если не пришло удивление
    bot.hears(state.dataRosim[3].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Руководство по регистрации
    bot.hears(state.dataRosim[3].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Поступил отказ
    bot.hears(state.dataRosim[3].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown('Вы выбрали поступил отказ в регистрации. Выберите вопрос.', Markup.keyboard(getQuestionsAndAnswersRosim(state.dataRosim[3].category, 7).questions))
    });

    //Как повторно подать заявку
    bot.hears(state.dataRosim[3].subcategories[7].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Необходимо ли после отказа
    bot.hears(state.dataRosim[3].subcategories[7].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Если в отказе указано что вы не правильно указали данные
    bot.hears(state.dataRosim[3].subcategories[7].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Не видите причину отказа 
    bot.hears(state.dataRosim[3].subcategories[7].questions[3].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[3].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Отозвать заявку
    bot.hears(state.dataRosim[3].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Ускорение регистрации
    bot.hears(state.dataRosim[3].subcategories[9].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[9].questions[0].answer, feedbackButton);
        const answer = state.dataBankrot[3].subcategories[9].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Срок действия регистрации
    bot.hears(state.dataRosim[3].subcategories[10].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[10].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //какой браузер
    bot.hears(state.dataRosim[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //забыл пароль
    bot.hears(state.dataRosim[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //срок действия регистрации эцп
    bot.hears(state.dataRosim[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Какая эцп нужна
    bot.hears(state.dataRosim[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown('Вы выбрали какая эцп нужна. Выберите вопрос.', Markup.keyboard(getQuestionsAndAnswersRosim(state.dataRosim[5].category, 0).questions))
    });

    //эцп для фл
    bot.hears(state.dataRosim[5].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //эцп для юл
    bot.hears(state.dataRosim[5].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Не получается подписать
    bot.hears(state.dataRosim[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как поменять сертификат
    bot.hears(state.dataRosim[5].subcategories[2].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[2].questions[0].answer, feedbackButton);
        const answer = state.dataBankrot[5].subcategories[2].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Предоставление информации
    bot.hears(state.dataRosim[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Контакты организатора
    bot.hears(state.dataRosim[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как найти торг
    bot.hears(state.dataRosim[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как и когда подать заявку на участие
    bot.hears(state.dataRosim[6].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //БАНКРОТСТВО
    bot.hears(String(state.dataBankrot[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали задаток. Выберите подкатегорию вопроса.", bankrotSubcategoriesDepositButtons);
    });

    //Контакты
    bot.hears(String(state.dataBankrot[1].category), (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[1].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    bot.hears(String(state.dataBankrot[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали заявка на участие в торгах. Выберите подкатегорию вопроса.", bankrotApplicationOnParticipationToTradeButtons);
    });

    bot.hears(String(state.dataBankrot[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация участника. Выберите подкатегорию вопроса.", bankrotRegistrationButtons);
    });

    bot.hears(String(state.dataBankrot[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали технические вопросы. Выберите подкатегорию вопроса.", bankrotTechnicalQuestionButtons);
    });

    bot.hears(String(state.dataBankrot[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали ЭЦП. Выберите подкатегорию вопроса.", bankrotSignatureButtons);
    });

    bot.hears(String(state.dataBankrot[6].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали торги. Выберите подкатегорию вопроса.", bankrotTradeButtons);
    });

    bot.hears(state.dataBankrot[0].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали возврат задатка. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[0].category, 0).questions));
    });

    //Задаток на лс
    bot.hears(state.dataBankrot[0].subcategories[0].questions[0].question, (ctx) => {
        const answer = state.dataBankrot[0].subcategories[0].questions[0].answer;

        /* let text = '';
        for (const element of answer.text.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton); */
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[0].answer.text, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Задаток на иной лс
    bot.hears(state.dataBankrot[0].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Срок рассмотрения задаток
    bot.hears(state.dataBankrot[0].subcategories[0].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Внесение задатка
    bot.hears(state.dataBankrot[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Срок рассмотрения заявки
    bot.hears(state.dataBankrot[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Посмотреть заявку
    bot.hears(state.dataBankrot[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //подать заявкку
    bot.hears(state.dataBankrot[2].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //кто может подать заявку
    bot.hears(state.dataBankrot[2].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //отзовать заявку
    bot.hears(state.dataBankrot[2].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //отредактировать заявку
    bot.hears(state.dataBankrot[2].subcategories[5].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[5].questions[0].answer, feedbackButton);
        const answer = state.dataBankrot[2].subcategories[5].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //при попытке подать заявку... 1
    bot.hears(state.dataBankrot[2].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //при попытке подать заявку... 2
    bot.hears(state.dataBankrot[2].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //ускорение заявки
    bot.hears(state.dataBankrot[2].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //как подать заявку на присоединение
    bot.hears(state.dataBankrot[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //время рассмотрения
    bot.hears(state.dataBankrot[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //время рассмотрения регламента
    bot.hears(state.dataBankrot[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //время рассмотрения юр действия
    bot.hears(state.dataBankrot[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //регистрация
    bot.hears(state.dataBankrot[3].subcategories[4].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[0].answer, feedbackButton);
        ctx.replyWithMarkdown("Вы выбрали регистрация на площадке. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[3].category, 4).questions).resize());
        messageInfo = ctx.message.text;
    })

    //Какие данные заполнять физ лицу
    bot.hears(state.dataBankrot[3].subcategories[4].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //Получили на почту код активации
    bot.hears(state.dataBankrot[3].subcategories[4].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //Начал регистрацию на этп. Костыль. Жёстко забито, потому что текст не помещается в кнопку. 
    bot.hears("Начал регистрацию на ЭТП. На первом шаге заполнил данные, затем на почту пришло уведомление об активации временного кода, я по нему…", (ctx) => { 
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //какие документы для регистрации
    bot.hears(state.dataBankrot[3].subcategories[4].questions[3].question, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[3].answer, feedbackButton);
        const answer = state.dataBankrot[3].subcategories[4].questions[3].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //как начать регистрацию
    bot.hears(state.dataBankrot[3].subcategories[4].questions[4].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[4].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //можно ли подать одновременно заявку
    bot.hears(state.dataBankrot[3].subcategories[4].questions[5].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[5].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //проверка заполненных данных
    bot.hears(state.dataBankrot[3].subcategories[4].questions[6].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[6].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //не пришло уведомление
    bot.hears(state.dataBankrot[3].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //руководство по регистрации
    bot.hears(state.dataBankrot[3].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //поступил отказ
    bot.hears(state.dataBankrot[3].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //отозвать заявку
    bot.hears(state.dataBankrot[3].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //ускорение регистрации
    bot.hears(state.dataBankrot[3].subcategories[9].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[9].questions[0].answer, feedbackButton);
        const answer = state.dataBankrot[3].subcategories[9].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //срок действия регистрации
    bot.hears(state.dataBankrot[3].subcategories[10].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[10].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Какой браузер
    bot.hears(state.dataBankrot[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Забыл пароль
    bot.hears(state.dataBankrot[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Срок дейстивя регистрации эцп
    bot.hears(state.dataBankrot[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Какая эцп нужна
    bot.hears(state.dataBankrot[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали какая ЭЦП нужна. Выберите вопрос", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[5].category, 0).questions));
    })

    //эцп для фл
    bot.hears(state.dataBankrot[5].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //эцп для юр л
    bot.hears(state.dataBankrot[5].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //не получается подписать
    bot.hears(state.dataBankrot[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //как поменять сертификат
    bot.hears(state.dataBankrot[5].subcategories[2].name, (ctx) => {
        //ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[2].questions[0].answer, feedbackButton);
        const answer = state.dataBankrot[5].subcategories[2].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Предоставление инфы
    bot.hears(state.dataBankrot[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //Контакты организатора
    bot.hears(state.dataBankrot[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[1].questions[0].answer, feedbackButton);
        /* const answer = state.dataBankrot[6].subcategories[1].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton); */
        messageInfo = ctx.message.text;
    })

    //Поиск публичка
    bot.hears(state.dataBankrot[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //поиск аукцион
    bot.hears(state.dataBankrot[6].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //поиск торгов
    bot.hears(state.dataBankrot[6].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //как и когда подать заявку на участие
    bot.hears(state.dataBankrot[6].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //КОММЕРЧЕСКИЕ ТОРГИ
    bot.hears(String(state.data[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрацию. Выберите подкатегорию", realtySubcategoriesRegistrationButton);
    })

    bot.hears(String(state.data[1].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали покупку. Выберите подкатегорию", realtySubcategoriesBuyButton);
    });

    bot.hears(String(state.data[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали возможности покупателя. Выберите подкатегорию", realtySubcategoriesPossibleBuyerButton);
    });

    bot.hears(String(state.data[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали продажу. Выберите подкатегорию", realtySubcategoriesSellButton);
    });

    bot.hears(String(state.data[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали возможности продавца. Выберите подкатегорию", realtySubcategoriesPossibleSellerButton);
    });

    bot.hears(String(state.data[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали технические вопросы. Выберите подкатегорию", realtySubcategoriesTechnicalQuestionsButton);
    });

    bot.hears(String(state.data[6].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали отзывы. Выберите подкатегорию", realtySubcagtegoriesReviewButton);
    });

    bot.hears(String(state.data[8].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сделки с юр.действиями. Выберите подкатегорию", realtySubcategoriesLegalForceButton);
    });

    //Как зарегистрироваться
    bot.hears(state.data[0].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[0].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Что такое псевдоним
    bot.hears(state.data[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[0].category, 1).answers[0]), feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как купить
    bot.hears(state.data[1].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Обсуждение лота до покупки
    bot.hears(state.data[1].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали обсуждение лота до покупки. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[1].category, 1).questions));
    });

    //обсуждение лота
    bot.hears(state.data[1].subcategories[1].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.data[1].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })

    //ответ на сообщение
    bot.hears(state.data[1].subcategories[1].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.data[1].subcategories[1].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
    })


    //Поиски и фильтры 
    bot.hears(state.data[1].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Прохождение торгов
    bot.hears(state.data[1].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 3).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Избранные лоты
    bot.hears(state.data[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[2].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Чёрный список продавцов
    bot.hears(state.data[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[2].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как продавать
    bot.hears(state.data[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали как продавать. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[3].category, 0).questions));
    });

    //Как продать. 
    bot.hears(state.data[3].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.data[3].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });


    //Как создать лот
    bot.hears(state.data[3].subcategories[0].questions[1].question, (ctx) => {
        let message = state.data[3].subcategories[0].questions[1].answer;
        const parts = message.split('3');
        ctx.reply(parts[0]);
        ctx.replyWithMarkdown(parts[1], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Услуги агента
    bot.hears(state.data[3].subcategories[0].questions[2].question, (ctx) => {
        let user = ctx.message.from;
        let message;
        if (messageInfo) {
            message = `Пользователю ${user.last_name} ${user.last_name} - @${user.username} (${user.id}) требуется помощь. Проблема, которую выбрал пользователь: ${messageInfo}`;
        } else {
            message = `Пользователю ${user.last_name} ${user.last_name} нужна помощь @${ctx.message.from.username} (${user.id})`;
        }
        let chatId = 797596124;

        bot.telegram.sendMessage(chatId, message).then(() => {
            ctx.replyWithMarkdown('С вами в ближайшее время свяжется оператор. Ожидайте ответа!', sitesButton);
        })
            .catch((error) => {
                console.error('Error sending message:', error);
                ctx.reply('Произошла ошибка при отправке сообщения');
            });;
    });

    //Теги-инструменты
    bot.hears(state.data[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Режим отпуск
    bot.hears(state.data[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Инструкция заполнения лота
    bot.hears(state.data[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 3).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Чёрный список покупателей
    bot.hears(state.data[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Ограничение по рейтингу покупателей
    bot.hears(state.data[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Антиснайпер
    bot.hears(state.data[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Замена пароля
    bot.hears(state.data[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Роль емайла
    bot.hears(state.data[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Восстановление доступа
    bot.hears(state.data[5].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Проблема с авторизацией
    bot.hears(state.data[5].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 3).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Аватарка пользователя
    bot.hears(state.data[5].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 4).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Активность
    bot.hears(state.data[5].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 5).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Уведомление
    bot.hears(state.data[5].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 6).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Какой браузер
    bot.hears(state.data[5].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 7).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Что такое отзыв
    bot.hears(state.data[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Что должен содержать отзыв
    bot.hears(state.data[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как оставить отзыв
    bot.hears(state.data[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //тарифы
    bot.hears(state.data[7].category, (ctx) => {
        ctx.replyWithMarkdown(state.data[7].subcategories[0].questions[0].answer["hyperlink"], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Какая эцп
    bot.hears(state.data[8].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали какая эцп. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[8].category, 0).questions))
    });

    //ЭЦП для фл
    bot.hears(state.data[8].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //ЭЦП для юл и ип
    bot.hears(state.data[8].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 0).answers[1], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Не получается подписать
    bot.hears(state.data[8].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
    });

    //Как поменять сертификат
    bot.hears(state.data[8].subcategories[2].name, (ctx) => {
        //ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 2).answers[0], feedbackButton);
        const answer = state.data[8].subcategories[2].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
    });

    bot.hears("Задать другой вопрос", (ctx) => {
        if (ctx.message.from.username) {
            ctx.replyWithMarkdown(`С какой площадкой вам нужна помощь, ${ctx.message.from.username}?`, sitesButton);
        } else if (ctx.message.from.first_name) {
            ctx.replyWithMarkdown(`С какой площадкой вам нужна помощь, ${ctx.message.from.first_name}?`, sitesButton);
        } else {
            ctx.replyWithMarkdown('С какой площадкой вам нужна помощь?', sitesButton)
        }
    })

    bot.hears('Бот помог', (ctx) => {
        ctx.reply('Рады помочь!', Markup.removeKeyboard());
    });

    bot.hears('Связаться с оператором', (ctx) => {
        let user = ctx.message.from;
        let message;
        if (messageInfo) {
            message = `Пользователю ${user.last_name} ${user.last_name} - @${user.username} (${user.id}) требуется помощь. Проблема, которую выбрал пользователь: ${messageInfo}`;
        } else {
            message = `Пользователю ${user.last_name} ${user.last_name} нужна помощь @${ctx.message.from.username} (${user.id})`;
        }
        let chatId = 797596124;

        bot.telegram.sendMessage(chatId, message).then(() => {
            ctx.replyWithMarkdown('С вами в ближайшее время свяжется оператор. Ожидайте ответа!', sitesButton);
        })
            .catch((error) => {
                console.error('Error sending message:', error);
                ctx.reply('Произошла ошибка при отправке сообщения');
            });;
    });
}

runBot()
    .then(() => console.log('Данные успешно обработаны!'))
    .catch((error) => console.error('Ошибка обработки данных:', error));;

 

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

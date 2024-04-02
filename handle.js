const { Telegraf } = require('telegraf');
const { toHTML, toMarkdownV2 } = require("@telegraf/entity");
const Markup = require('telegraf/markup');
const { buttons } = require('./buttons.js')
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;

const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');
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
    '-',
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

const feedbackButton = Markup.keyboard([
    Markup.button.callback("Бот помог"),
    Markup.button.callback("Связаться с оператором"),
    Markup.button.callback("Задать другой вопрос")
])

const runBot = async () => {
    await handleData();
    console.log(state.dataRosim);

    let sitesButton = Markup.keyboard(state.sites.map(site => Markup.button.callback(site)));
    const uniqueRealtyCategories = new Set(state.data.map(category => category.category));
    const uniqueBankrotCategories = new Set(state.dataBankrot.map(category => category.category));
    const uniqueRosimCategories = new Set(state.dataRosim.map(category => category.category));

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
        ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, sitesButton);
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

    //РОСИМУЩЕСТВО
    bot.hears(String(state.dataRosim[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали задаток. Выберите подкатегорию вопроса.", rosimSubcategoriesDepositButtons);
    });

    bot.hears(String(state.dataRosim[1].category), (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[0].subcategories[0].questions[0].answer, feedbackButton);
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
    });

    //внесение задатка
    bot.hears(state.dataRosim[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[1].questions[0].answer, feedbackButton);
    });

    //Срок рассмотрения заявки
    bot.hears(state.dataRosim[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[0].questions[0].answer, feedbackButton);
    });

    //Как посмотреть заявку
    bot.hears(state.dataRosim[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[1].questions[0].answer, feedbackButton);
    });

    //Как подать заявку
    bot.hears(state.dataRosim[2].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[2].questions[0].answer, feedbackButton);
    });

    //Кто может подать заявку
    bot.hears(state.dataRosim[2].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[3].questions[0].answer, feedbackButton);
    });

    let test = state.dataBankrot[2].subcategories[3].questions[0].answer;
    console.log(test);
    //Тут какая то проблема.

    //Как отозвать заявку
    bot.hears(state.dataRosim[2].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[4].questions[0].answer, feedbackButton);
    });

    //Как отредактировать заявку
    bot.hears(state.dataRosim[2].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[5].questions[0].answer, feedbackButton);
    });

    //При попытке подать заявку регламент
    bot.hears(state.dataRosim[2].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[6].questions[0].answer, feedbackButton);
    });

    //При попытке подать заявку юр действия
    bot.hears(state.dataRosim[2].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[20].subcategories[7].questions[0].answer, feedbackButton);
    });

    //ускорение
    bot.hears(state.dataRosim[2].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[20].subcategories[8].questions[0].answer, feedbackButton);
    });

    //БАНКРОТСТВО
    bot.hears(String(state.dataBankrot[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали задаток. Выберите подкатегорию вопроса.", bankrotSubcategoriesDepositButtons);
    });

    //Контакты
    bot.hears(String(state.dataBankrot[1].category), (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[1].subcategories[0].questions[0].answer, feedbackButton);
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

        let text = '';
        for (const element of answer.text.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
    });

    //Задаток на иной лс
    bot.hears(state.dataBankrot[0].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(state.dataBankrot[0].subcategories[0].questions[1].answer), feedbackButton);
    });

    //Срок рассмотрения задаток
    bot.hears(state.dataBankrot[0].subcategories[0].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[2].answer, feedbackButton);
    });

    //Внесение задатка
    bot.hears(state.dataBankrot[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[1].questions[0].answer, feedbackButton);
    })

    //Срок рассмотрения заявки
    bot.hears(state.dataBankrot[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[0].questions[0].answer, feedbackButton);
    })

    //Посмотреть заявку
    bot.hears(state.dataBankrot[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[1].questions[0].answer, feedbackButton);
    })

    //подать заявкку
    bot.hears(state.dataBankrot[2].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[2].questions[0].answer, feedbackButton);
    })

    //кто может подать зявку
    bot.hears(state.dataBankrot[2].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[3].questions[0].answer, feedbackButton);
    })

    //отзовать заявкиу
    bot.hears(state.dataBankrot[2].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[4].questions[0].answer, feedbackButton);
    })

    //отредаткировать зявкуи
    bot.hears(state.dataBankrot[2].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[5].questions[0].answer, feedbackButton);
    })

    //при попытке подать звяфу... 1
    bot.hears(state.dataBankrot[2].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[6].questions[0].answer, feedbackButton);
    })

    //при попыдутку подать заявкуу... 2
    bot.hears(state.dataBankrot[2].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[7].questions[0].answer, feedbackButton);
    })

    //ускорение завявку
    bot.hears(state.dataBankrot[2].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[8].questions[0].answer, feedbackButton);
    })

    //как подать заявку на присоедтнение
    bot.hears(state.dataBankrot[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[0].questions[0].answer, feedbackButton);
    })

    //время рассмотрения
    bot.hears(state.dataBankrot[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[1].questions[0].answer, feedbackButton);
    })

    //время рассмотрения регламент
    bot.hears(state.dataBankrot[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[2].questions[0].answer, feedbackButton);
    })

    //время рассмотрения юр действия
    bot.hears(state.dataBankrot[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[3].questions[0].answer, feedbackButton);
    })

    //регисьрация
    bot.hears(state.dataBankrot[3].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[0].answer, feedbackButton);
    })

    //не пришло уведомление
    bot.hears(state.dataBankrot[3].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[5].questions[0].answer, feedbackButton);
    })

    //руководство по регистрации
    bot.hears(state.dataBankrot[3].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[6].questions[0].answer, feedbackButton);
    })

    //поступил октаз
    bot.hears(state.dataBankrot[3].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[0].answer, feedbackButton);
    })

    //отозвать заявку
    bot.hears(state.dataBankrot[3].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[8].questions[0].answer, feedbackButton);
    })

    //ускорение регистрации
    bot.hears(state.dataBankrot[3].subcategories[9].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[9].questions[0].answer, feedbackButton);
    })

    //срок действия регистрации
    bot.hears(state.dataBankrot[3].subcategories[10].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[10].questions[0].answer, feedbackButton);
    })

    //Какой браузер
    bot.hears(state.dataBankrot[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[0].questions[0].answer, feedbackButton);
    })

    //Забыл пароль
    bot.hears(state.dataBankrot[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[1].questions[0].answer, feedbackButton);
    })

    //Срок дейстивя регистрации эцп
    bot.hears(state.dataBankrot[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[2].questions[0].answer, feedbackButton);
    })

    //Какая эцп нужна
    bot.hears(state.dataBankrot[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали какая ЭЦП нужна. Выберите вопрос", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[5].category, 0).questions));
    })

    //эцп ждя фл
    bot.hears(state.dataBankrot[5].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[0].answer, feedbackButton);
    })

    //эцп для юр л
    bot.hears(state.dataBankrot[5].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[1].answer, feedbackButton);
    })

    //не получается подписать
    bot.hears(state.dataBankrot[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[1].questions[0].answer, feedbackButton);
    })

    //как поменять сертификат
    bot.hears(state.dataBankrot[5].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[2].questions[0].answer, feedbackButton);
    })

    //Предоставление инфы
    bot.hears(state.dataBankrot[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[0].questions[0].answer, feedbackButton);
    })

    //Контакты организатора
    bot.hears(state.dataBankrot[6].subcategories[1].name, (ctx) => {
        const answer = state.dataBankrot[6].subcategories[1].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
    })

    //Поиск публичка
    bot.hears(state.dataBankrot[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[2].questions[0].answer, feedbackButton);
    })

    //поиск аукцион
    bot.hears(state.dataBankrot[6].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[3].questions[0].answer, feedbackButton);
    })

    //поиск торгов
    bot.hears(state.dataBankrot[6].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[4].questions[0].answer, feedbackButton);
    })

    //как и когда подать заявку на участие
    bot.hears(state.dataBankrot[6].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[5].questions[0].answer, feedbackButton);
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
    });

    //Что такое псевдоним
    bot.hears(state.data[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[0].category, 1).answers[0]), feedbackButton);
    });

    //Как купить
    bot.hears(state.data[1].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 0).answers[0]), feedbackButton);
    });

    //Обсуждение лота до покупки
    bot.hears(state.data[1].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали обсуждение лота до покупки. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswers(state.data[1].category, 1).questions));
    });

    //Поиски и фильтры 
    bot.hears(state.data[1].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 2).answers[0]), feedbackButton);
    });

    //Прохождение торгов
    bot.hears(state.data[1].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 3).answers[0]), feedbackButton);
    });

    //Избранные лоты
    bot.hears(state.data[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[2].category, 0).answers[0]), feedbackButton);
    });

    //Чёрный список продавцов
    bot.hears(state.data[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[2].category, 1).answers[0]), feedbackButton);
    });

    //Как продавать
    bot.hears(state.data[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали как продавать. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[3].category, 0).questions));
    });

    //Как продать
    bot.hears(state.data[3].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 0).answers[0], feedbackButton)
    });

    //Как создать лот
    bot.hears(state.data[3].subcategories[0].questions[1].question, (ctx) => {
        let message = getQuestionsAndAnswersRealty(state.data[3].category, 0).answers[1];
        const parts = message.split('3');
        ctx.reply(parts[0]);
        ctx.replyWithMarkdown(parts[1], feedbackButton);
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
            ctx.reply('С вами в ближайшее время свяжется оператор. Ожидайте ответа!', Markup.removeKeyboard());
        })
            .catch((error) => {
                console.error('Error sending message:', error);
                ctx.reply('Произошла ошибка при отправке сообщения');
            });;
    });

    //Теги-инструменты
    bot.hears(state.data[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdownV2(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 1).answers[0]), feedbackButton);
    });

    //Режим отпуск
    bot.hears(state.data[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 2).answers[0]), feedbackButton);
    });

    //Инструкция заполнения лота
    bot.hears(state.data[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 3).answers[0]), feedbackButton);
    });

    //Чёрный список покупателей
    bot.hears(state.data[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 0).answers[0]), feedbackButton);
    });

    //Ограничение по рейтингу покупателей
    bot.hears(state.data[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 1).answers[0]), feedbackButton);
    });

    //Антиснайпер
    bot.hears(state.data[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 2).answers[0]), feedbackButton);
    });

    //Замена пароля
    bot.hears(state.data[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 0).answers[0]), feedbackButton);
    });

    //Роль емайла
    bot.hears(state.data[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 1).answers[0]), feedbackButton);
    });

    //Восстановление доступа
    bot.hears(state.data[5].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 2).answers[0]), feedbackButton);
    });

    //Проблема с авторизацией
    bot.hears(state.data[5].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 3).answers[0]), feedbackButton);
    });

    //Аватарка пользователя
    bot.hears(state.data[5].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 4).answers[0]), feedbackButton);
    });

    //Активность
    bot.hears(state.data[5].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 5).answers[0]), feedbackButton);
    });

    //Уведомление
    bot.hears(state.data[5].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 6).answers[0]), feedbackButton);
    });

    //Какой браузер
    bot.hears(state.data[5].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 7).answers[0]), feedbackButton);
    });

    //Что такое отзыв
    bot.hears(state.data[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 0).answers[0]), feedbackButton);
    });

    //Что должен содержать отзыв
    bot.hears(state.data[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 1).answers[0]), feedbackButton);
    });

    //Как оставить отзыв
    bot.hears(state.data[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 2).answers[0]), feedbackButton);
    });

    //тарифы
    bot.hears(state.data[7].category, (ctx) => {
        ctx.replyWithMarkdown(state.data[7].subcategories[0].questions[0].answer["hyperlink"], feedbackButton);
    });

    //Какая эцп
    bot.hears(state.data[8].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали какая эцп. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[8].category, 0).questions))
    });

    //ЭЦП для фл
    bot.hears(state.data[8].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 0).answers[0], feedbackButton);
    });

    //ЭЦП для юл и ип
    bot.hears(state.data[8].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 0).answers[1], feedbackButton);
    });

    //Не получается подписать
    bot.hears(state.data[8].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 1).answers[0]), feedbackButton);
    });

    //Как поменять сертификат
    bot.hears(state.data[8].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 2).answers[0]), feedbackButton);
    });

    bot.hears("Задать другой вопрос", (ctx) => {
        ctx.replyWithMarkdown(`С какой площадкой Вам нужна помошь, ${ctx.message.from.username}`, sitesButton);
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
            ctx.reply('С вами в ближайшее время свяжется оператор. Ожидайте ответа!', Markup.removeKeyboard());
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

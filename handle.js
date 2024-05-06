const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;
let { escapeMarkdown, getBankrotSubcategoriesButtons, getRealtySubcategoriesButtons, getRosimSubcategoriesButtons,
    getQuestionsAndAnswersRealty, getQuestionsAndAnswersBankrot, getQuestionsAndAnswersRosim, getQuestionsAndAnswersArt,
    createCategoryButtons} = require('./variables.js');
let { feedbackButton } = require('./variables.js');
let logger = require('./logger.js');

//const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');
const bot = new Telegraf('7003796600:AAGb5yvtAOPefwtTArVgVPQMGxKl-G2JzNY');

let messageInfo = "";
let totalLotid = "";
let totalSite = "";

const runBot = async () => {
    await handleData();
    console.log(state.data);

    bot.start((ctx) => {
        let message = ctx.message.text;
        let lotId = ctx.message.text.split('_');
        let underscoreIndex = message.indexOf('_');
        let site = message.substring(message.indexOf(' ') + 1, underscoreIndex);
        try {
            if (message === "/start") {
                if (ctx.message.from.username) {
                    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, createCategoryButtons().sitesButton);
                } else if (ctx.message.from.first_name) {
                    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.first_name}!  С какой площадкой вам нужна помощь?`, createCategoryButtons().sitesButton);
                } else {
                    ctx.replyWithMarkdown('Привет! С какой площадкой вам нужна помощь?', createCategoryButtons().sitesButton);
                }
            } else if (message.includes("bankrot")) {
                ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Банкротство. Выберите категорию вопроса.", createCategoryButtons().bankrotCategoriesButton);
            } else if (message.includes("realty")) {
                ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Коммерческие торги. Выберите категорию вопроса.", createCategoryButtons().realtyCategoriesButton);
            } else if (message.includes("rosim")) {
                ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Росимущество. Выберите категорию вопроса.", createCategoryButtons().rosimCategoriesButton);
            } else if (message.includes("art")) {
                ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Арт. Выберите категорию вопроса", createCategoryButtons().artCategoriesButton);
            }
            logger.infoLogger(
                `Пользователь перешёл в телеграм-бот`,
                `${message}`,
                `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
                `${lotId ? lotId[lotId.length - 1] : ''}`,
                `${site ? site : ''}`,
                '',
                "Telegram-bot"
            )

            if (lotId) {
                totalLotid = lotId[lotId.length - 1];
            }

            if (site) {
                totalSite = site;
            }

        } catch {
            logger.errorLogger("Ошибка", `/start ${message}`, "Telegram-bot")
        }
    });

    //ВЫБОР САЙТОВ
    bot.hears(String(state.sites[0]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Банкротство. Выберите категорию вопроса.", createCategoryButtons().bankrotCategoriesButton);
    })

    bot.hears(String(state.sites[1]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Коммерческие торги. Выберите категорию вопроса.", createCategoryButtons().realtyCategoriesButton);
    })

    bot.hears(String(state.sites[2]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Росимущество. Выберите категорию вопроса.", createCategoryButtons().rosimCategoriesButton);
    })

    bot.hears(String(state.sites[3]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Арт. Выберите категорию вопроса", createCategoryButtons().artCategoriesButton);
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
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })

    //регистрация на площадке
    bot.hears(state.dataArt[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })

    //какая нужна эцп
    bot.hears(state.dataArt[1].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })


    //какие данные заполнять
    bot.hears(state.dataArt[1].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[1].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })


    //получение на почту активации
    bot.hears(state.dataArt[1].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[1].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })

    //Кто осуществляет доставку
    bot.hears(state.dataArt[2].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })


    //На ком лежит ответственность по доставке
    bot.hears(state.dataArt[2].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })


    //Будет ли страховка по доставке
    bot.hears(state.dataArt[2].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })


    //Доставка самолётом возможна
    bot.hears(state.dataArt[2].questions[3].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[2].questions[3].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot"
        )
    })

    //Кто будет платить за торги
    bot.hears(state.dataArt[3].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[3].questions[0].answer.text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Какой лучше вид аукциона выбрать
    bot.hears(state.dataArt[3].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[3].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Ювелирка
    bot.hears(state.dataArt[3].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[3].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Какую цену указывать
    bot.hears(state.dataArt[4].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Может ли цена понизиться
    bot.hears(state.dataArt[4].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[4].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //какой процент берет митра. Не работает почему-то
    bot.hears(state.dataArt[5].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //какой процент по результатам торгов
    bot.hears(state.dataArt[5].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //какая выгода для вас
    bot.hears(state.dataArt[5].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //как будет списываться комиссия
    bot.hears(state.dataArt[5].questions[3].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[3].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //какой счёт указывать
    bot.hears(state.dataArt[5].questions[4].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataArt[5].questions[4].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //на чей расчётный счёт будет поступать оплата
    bot.hears(state.dataArt[5].questions[5].question, (ctx) => {
        const answer = state.dataArt[5].questions[5].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //РОСИМУЩЕСТВО
    bot.hears(String(state.dataRosim[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали задаток. Выберите подкатегорию вопроса.", createCategoryButtons().rosimSubcategoriesDepositButtons);
    });

    bot.hears(String(state.dataRosim[1].category), (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[0].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
    });

    bot.hears(String(state.dataRosim[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали заявка на участие в торгах. Выберите подкатегорию вопроса.", createCategoryButtons().rosimApplicateionOnParticipationToTradeButtons);
    });

    bot.hears(String(state.dataRosim[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация участника. Выберите подкатегорию вопроса.", createCategoryButtons().rosimSubcategoriesRegistrationButtons);
    });

    bot.hears(String(state.dataRosim[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали технические вопросы. Выберите подкатегорию вопроса.", createCategoryButtons().rosimSubcategoriesTechnicalQuestionButtons);
    });

    bot.hears(String(state.dataRosim[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали ЭЦП. Выберите подкатегорию вопроса.", createCategoryButtons().rosimSubcategoriesSignatureButtons);
    });

    bot.hears(String(state.dataRosim[6].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали торги. Выберите подкатегорию вопроса.", createCategoryButtons().rosimSubcategoriesTradeButtons);
    });

    //возврат задатка
    bot.hears(state.dataRosim[0].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[0].answer.text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //внесение задатка
    bot.hears(state.dataRosim[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Срок рассмотрения заявки
    bot.hears(state.dataRosim[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как посмотреть заявку
    bot.hears(state.dataRosim[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRosim(state.dataRosim[2].category, 1).answers, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как подать заявку
    bot.hears(state.dataRosim[2].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Кто может подать заявку
    bot.hears(state.dataRosim[2].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как отозвать заявку
    bot.hears(state.dataRosim[2].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как отредактировать заявку
    bot.hears(state.dataRosim[2].subcategories[5].name, (ctx) => {
        const answer = state.dataRosim[2].subcategories[5].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //При попытке подать заявку регламент
    bot.hears(state.dataRosim[2].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //При попытке подать заявку юр действия
    bot.hears(state.dataRosim[2].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //ускорение
    bot.hears(state.dataRosim[2].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как подать заявку регламент
    bot.hears(state.dataRosim[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Время рассмотрения заявки
    bot.hears(state.dataRosim[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Время рассмотрения заявки на присоедниение
    bot.hears(state.dataRosim[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Время рассмотрения на юр действия
    bot.hears(state.dataRosim[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Регистрация на площадке
    bot.hears(state.dataRosim[3].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация на площадке. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRosim(state.dataRosim[3].category, 4).questions))
    });

    //Какие данные заполнять
    bot.hears(state.dataRosim[3].subcategories[4].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Получлили на почту код
    bot.hears(state.dataRosim[3].subcategories[4].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Начал регистрацию по этп
    bot.hears(state.dataRosim[3].subcategories[4].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Какие документы по регистрации необходимы
    bot.hears(state.dataRosim[3].subcategories[4].questions[3].question, (ctx) => {
        const answer = state.dataBankrot[3].subcategories[4].questions[3].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Как начать регистрацию
    bot.hears(state.dataRosim[3].subcategories[4].questions[4].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[4].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Можно ли подать одновременно заявку
    bot.hears(state.dataRosim[3].subcategories[4].questions[5].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[5].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Проверка заполненных данных
    bot.hears(state.dataRosim[3].subcategories[4].questions[6].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataRosim[3].subcategories[4].questions[6].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Что делать если не пришло удивление
    bot.hears(state.dataRosim[3].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Руководство по регистрации
    bot.hears(state.dataRosim[3].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Поступил отказ
    bot.hears(state.dataRosim[3].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown('Вы выбрали поступил отказ в регистрации. Выберите вопрос.', Markup.keyboard(getQuestionsAndAnswersRosim(state.dataRosim[3].category, 7).questions))
    });

    //Как повторно подать заявку
    bot.hears(state.dataRosim[3].subcategories[7].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[0].answer, feedbackButton);
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
        messageInfo = ctx.message.text;
    });

    //Необходимо ли после отказа
    bot.hears(state.dataRosim[3].subcategories[7].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Если в отказе указано что вы не правильно указали данные
    bot.hears(state.dataRosim[3].subcategories[7].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Не видите причину отказа 
    bot.hears(state.dataRosim[3].subcategories[7].questions[3].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[3].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Отозвать заявку
    bot.hears(state.dataRosim[3].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Ускорение регистрации
    bot.hears(state.dataRosim[3].subcategories[9].name, (ctx) => {
        const answer = state.dataBankrot[3].subcategories[9].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Срок действия регистрации
    bot.hears(state.dataRosim[3].subcategories[10].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[10].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //какой браузер
    bot.hears(state.dataRosim[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //забыл пароль
    bot.hears(state.dataRosim[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //срок действия регистрации эцп
    bot.hears(state.dataRosim[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Какая эцп нужна
    bot.hears(state.dataRosim[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown('Вы выбрали какая эцп нужна. Выберите вопрос.', Markup.keyboard(getQuestionsAndAnswersRosim(state.dataRosim[5].category, 0).questions))
    });

    //эцп для фл
    bot.hears(state.dataRosim[5].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //эцп для юл
    bot.hears(state.dataRosim[5].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Не получается подписать
    bot.hears(state.dataRosim[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как поменять сертификат
    bot.hears(state.dataRosim[5].subcategories[2].name, (ctx) => {
        const answer = state.dataBankrot[5].subcategories[2].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Предоставление информации
    bot.hears(state.dataRosim[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Контакты организатора
    bot.hears(state.dataRosim[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как найти торг
    bot.hears(state.dataRosim[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как и когда подать заявку на участие
    bot.hears(state.dataRosim[6].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //БАНКРОТСТВО
    bot.hears(String(state.dataBankrot[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали задаток. Выберите подкатегорию вопроса.", createCategoryButtons().bankrotSubcategoriesDepositButtons);
    });

    //Контакты
    bot.hears(String(state.dataBankrot[1].category), (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[1].subcategories[0].questions[0].answer, feedbackButton);
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
        messageInfo = ctx.message.text;
    });

    bot.hears(String(state.dataBankrot[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали заявка на участие в торгах. Выберите подкатегорию вопроса.", createCategoryButtons().bankrotApplicationOnParticipationToTradeButtons);
    });

    bot.hears(String(state.dataBankrot[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация участника. Выберите подкатегорию вопроса.", createCategoryButtons().bankrotRegistrationButtons);
    });

    bot.hears(String(state.dataBankrot[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали технические вопросы. Выберите подкатегорию вопроса.", createCategoryButtons().bankrotTechnicalQuestionButtons);
    });

    bot.hears(String(state.dataBankrot[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали ЭЦП. Выберите подкатегорию вопроса.", createCategoryButtons().bankrotSignatureButtons);
    });

    bot.hears(String(state.dataBankrot[6].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали торги. Выберите подкатегорию вопроса.", createCategoryButtons().bankrotTradeButtons);
    });

    bot.hears(state.dataBankrot[0].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали возврат задатка. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[0].category, 0).questions));
    });

    //Задаток на лс
    bot.hears(state.dataBankrot[0].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[0].answer.text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Задаток на иной лс
    bot.hears(state.dataBankrot[0].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Срок рассмотрения задаток
    bot.hears(state.dataBankrot[0].subcategories[0].questions[2].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[0].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Внесение задатка
    bot.hears(state.dataBankrot[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[0].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Срок рассмотрения заявки
    bot.hears(state.dataBankrot[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Посмотреть заявку
    bot.hears(state.dataBankrot[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //подать заявкку
    bot.hears(state.dataBankrot[2].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //кто может подать заявку
    bot.hears(state.dataBankrot[2].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //отзовать заявку
    bot.hears(state.dataBankrot[2].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //отредактировать заявку
    bot.hears(state.dataBankrot[2].subcategories[5].name, (ctx) => {
        const answer = state.dataBankrot[2].subcategories[5].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //при попытке подать заявку... 1
    bot.hears(state.dataBankrot[2].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //при попытке подать заявку... 2
    bot.hears(state.dataBankrot[2].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //ускорение заявки
    bot.hears(state.dataBankrot[2].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[2].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //как подать заявку на присоединение
    bot.hears(state.dataBankrot[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //время рассмотрения
    bot.hears(state.dataBankrot[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //время рассмотрения регламента
    bot.hears(state.dataBankrot[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //время рассмотрения юр действия
    bot.hears(state.dataBankrot[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //регистрация
    bot.hears(state.dataBankrot[3].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрация на площадке. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[3].category, 4).questions).resize());
        messageInfo = ctx.message.text;
    })

    //Какие данные заполнять физ лицу
    bot.hears(state.dataBankrot[3].subcategories[4].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //Получили на почту код активации
    bot.hears(state.dataBankrot[3].subcategories[4].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //Начал регистрацию на этп. Костыль. Жёстко забито, потому что текст не помещается в кнопку. 
    bot.hears("Начал регистрацию на ЭТП. На первом шаге заполнил данные, затем на почту пришло уведомление об активации временного кода, я по нему…", (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[2].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //какие документы для регистрации
    bot.hears(state.dataBankrot[3].subcategories[4].questions[3].question, (ctx) => {
        const answer = state.dataBankrot[3].subcategories[4].questions[3].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //как начать регистрацию
    bot.hears(state.dataBankrot[3].subcategories[4].questions[4].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[4].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //можно ли подать одновременно заявку
    bot.hears(state.dataBankrot[3].subcategories[4].questions[5].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[5].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //проверка заполненных данных
    bot.hears(state.dataBankrot[3].subcategories[4].questions[6].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[4].questions[6].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //не пришло уведомление
    bot.hears(state.dataBankrot[3].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //руководство по регистрации
    bot.hears(state.dataBankrot[3].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[6].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //поступил отказ
    bot.hears(state.dataBankrot[3].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[7].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //отозвать заявку
    bot.hears(state.dataBankrot[3].subcategories[8].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[8].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //ускорение регистрации
    bot.hears(state.dataBankrot[3].subcategories[9].name, (ctx) => {
        const answer = state.dataBankrot[3].subcategories[9].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //срок действия регистрации
    bot.hears(state.dataBankrot[3].subcategories[10].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[3].subcategories[10].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Какой браузер
    bot.hears(state.dataBankrot[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Забыл пароль
    bot.hears(state.dataBankrot[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Срок дейстивя регистрации эцп
    bot.hears(state.dataBankrot[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[4].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Какая эцп нужна
    bot.hears(state.dataBankrot[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали какая ЭЦП нужна. Выберите вопрос", Markup.keyboard(getQuestionsAndAnswersBankrot(state.dataBankrot[5].category, 0).questions));
    })

    //эцп для фл
    bot.hears(state.dataBankrot[5].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //эцп для юр л
    bot.hears(state.dataBankrot[5].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[0].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //не получается подписать
    bot.hears(state.dataBankrot[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[5].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //как поменять сертификат
    bot.hears(state.dataBankrot[5].subcategories[2].name, (ctx) => {
        const answer = state.dataBankrot[5].subcategories[2].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Предоставление инфы
    bot.hears(state.dataBankrot[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Контакты организатора
    bot.hears(state.dataBankrot[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //Поиск публичка
    bot.hears(state.dataBankrot[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[2].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //поиск аукцион
    bot.hears(state.dataBankrot[6].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[3].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //поиск торгов
    bot.hears(state.dataBankrot[6].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[4].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //как и когда подать заявку на участие
    bot.hears(state.dataBankrot[6].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(state.dataBankrot[6].subcategories[5].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //КОММЕРЧЕСКИЕ ТОРГИ
    bot.hears(String(state.data[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрацию. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesRegistrationButton);
    })

    bot.hears(String(state.data[1].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали покупку. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesBuyButton);
    });

    bot.hears(String(state.data[2].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали возможности покупателя. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesPossibleBuyerButton);
    });

    bot.hears(String(state.data[3].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали продажу. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesSellButton);
    });

    bot.hears(String(state.data[4].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали возможности продавца. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesPossibleSellerButton);
    });

    bot.hears(String(state.data[5].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали технические вопросы. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesTechnicalQuestionsButton);
    });

    bot.hears(String(state.data[6].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали отзывы. Выберите подкатегорию", createCategoryButtons().realtySubcagtegoriesReviewButton);
    });

    bot.hears(String(state.data[8].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сделки с юр.действиями. Выберите подкатегорию", createCategoryButtons().realtySubcategoriesLegalForceButton);
    });

    //Как зарегистрироваться
    bot.hears(state.data[0].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[0].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Что такое псевдоним
    bot.hears(state.data[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswersRealty(state.data[0].category, 1).answers[0]), feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как купить
    bot.hears(state.data[1].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Обсуждение лота до покупки
    bot.hears(state.data[1].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали обсуждение лота до покупки. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[1].category, 1).questions));
    });

    //обсуждение лота
    bot.hears(state.data[1].subcategories[1].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.data[1].subcategories[1].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })

    //ответ на сообщение
    bot.hears(state.data[1].subcategories[1].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(state.data[1].subcategories[1].questions[1].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    })


    //Поиски и фильтры 
    bot.hears(state.data[1].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Прохождение торгов
    bot.hears(state.data[1].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[1].category, 3).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Избранные лоты
    bot.hears(state.data[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[2].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Чёрный список продавцов
    bot.hears(state.data[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[2].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как продавать
    bot.hears(state.data[3].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали как продавать. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[3].category, 0).questions));
    });

    //Как продать. 
    bot.hears(state.data[3].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(state.data[3].subcategories[0].questions[0].answer, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
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
        let chatId = -4166037569;

        bot.telegram.sendMessage(chatId, message).then(() => {
            ctx.replyWithMarkdown('С вами в ближайшее время свяжется оператор. Ожидайте ответа!', createCategoryButtons().sitesButton);
            logger.infoLogger(
                `Пользователю понадобились услуги агента`,
                `bot.hears`,
                `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
                `${totalLotid}`,
                `${totalSite}`,
                `${messageInfo}`
            )
        })
            .catch((error) => {
                //console.error('Error sending message:', error);
                logger.errorLogger(`Error sending message ${error}`, 'bot.hears', "Telegram-bot")
                ctx.reply('Произошла ошибка при отправке сообщения');
            });;
    });

    //Теги-инструменты
    bot.hears(state.data[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Режим отпуск
    bot.hears(state.data[3].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Инструкция заполнения лота
    bot.hears(state.data[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[3].category, 3).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Чёрный список покупателей
    bot.hears(state.data[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Ограничение по рейтингу покупателей
    bot.hears(state.data[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Антиснайпер
    bot.hears(state.data[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[4].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Замена пароля
    bot.hears(state.data[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Роль емайла
    bot.hears(state.data[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Восстановление доступа
    bot.hears(state.data[5].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Проблема с авторизацией
    bot.hears(state.data[5].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 3).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Аватарка пользователя
    bot.hears(state.data[5].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 4).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Активность
    bot.hears(state.data[5].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 5).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Уведомление
    bot.hears(state.data[5].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 6).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Какой браузер
    bot.hears(state.data[5].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[5].category, 7).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Что такое отзыв
    bot.hears(state.data[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Что должен содержать отзыв
    bot.hears(state.data[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как оставить отзыв
    bot.hears(state.data[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[6].category, 2).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //тарифы
    bot.hears(state.data[7].category, (ctx) => {
        ctx.replyWithMarkdown(state.data[7].subcategories[0].questions[0].answer["hyperlink"], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Какая эцп
    bot.hears(state.data[8].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали какая эцп. Выберите вопрос.", Markup.keyboard(getQuestionsAndAnswersRealty(state.data[8].category, 0).questions))
    });

    //ЭЦП для фл
    bot.hears(state.data[8].subcategories[0].questions[0].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 0).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //ЭЦП для юл и ип
    bot.hears(state.data[8].subcategories[0].questions[1].question, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 0).answers[1], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Не получается подписать
    bot.hears(state.data[8].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(getQuestionsAndAnswersRealty(state.data[8].category, 1).answers[0], feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    //Как поменять сертификат
    bot.hears(state.data[8].subcategories[2].name, (ctx) => {
        const answer = state.data[8].subcategories[2].questions[0].answer;

        let text = '';
        for (const element of answer.richText) {
            text += element.text;
        }

        ctx.replyWithMarkdown(text, feedbackButton);
        messageInfo = ctx.message.text;
        logger.infoLogger(
            `Пользователь завершает скрипт`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `${messageInfo}`,
            "Telegram-bot",
        )
    });

    bot.hears("Задать другой вопрос", (ctx) => {
        if (ctx.message.from.username) {
            ctx.replyWithMarkdown(`С какой площадкой вам нужна помощь, ${ctx.message.from.username}?`, createCategoryButtons().sitesButton);
        } else if (ctx.message.from.first_name) {
            ctx.replyWithMarkdown(`С какой площадкой вам нужна помощь, ${ctx.message.from.first_name}?`, createCategoryButtons().sitesButton);
        } else {
            ctx.replyWithMarkdown('С какой площадкой вам нужна помощь?', createCategoryButtons().sitesButton)
        }
        logger.infoLogger(
            `Пользователь хочет задать другой вопрос`,
            `bot.hears`,
            `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
            `${totalLotid}`,
            `${totalSite}`,
            `Задать другой вопрос`
        )
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
        let chatId = -4166037569;

        bot.telegram.sendMessage(chatId, message).then(() => {
            ctx.replyWithMarkdown('С вами в ближайшее время свяжется оператор. Ожидайте ответа!', createCategoryButtons().sitesButton);
            logger.infoLogger(
                `Пользователь хочет связаться с оператором`,
                `bot.hears`,
                `${ctx.message.from.username ? ctx.message.from.username : ctx.message.from.first_name}`,
                `${totalLotid}`,
                `${totalSite}`,
                `Связаться с оператором`
            )
        })
            .catch((error) => {
                //console.error('Error sending message:', error);
                logger.errorLogger(`${error}`, 'Bot.hears', "Telegram-bot");
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

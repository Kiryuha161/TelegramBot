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
    '!'
]

const escapeMarkdown = (text) => {
    SPECIAL_CHARS.forEach(char => (text = text.replaceAll(char, `\\${char}`)))
    return text
}

const getSubcategoriesButton = (chapter) => {
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

const getQuestionsAndAnswers = (category, subcategoryIndex) => {
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

const feedbackButton = Markup.keyboard([
    Markup.button.callback("Бот помог"),
    Markup.button.callback("Связаться с оператором"),
    Markup.button.callback("Задать другой вопрос")
])

const runBot = async () => {
    await handleData();
    console.log(state.data);

    let sitesButton = Markup.keyboard(state.sites.map(site => Markup.button.callback(site)));
    const uniqueCategories = new Set(state.data.map(category => category.category));

    let realtyCategoriesButton = Markup.keyboard(
        [...uniqueCategories]
            .filter(category => category) // Фильтрация пустых или неопределенных значений
            .map(category => Markup.button.callback(category))
    );


    let realtySubcategoriesRegistrationButton = getSubcategoriesButton(String(state.data[0].category));
    let realtySubcategoriesBuyButton = getSubcategoriesButton(String(state.data[1].category));
    let realtySubcategoriesPossibleBuyerButton = getSubcategoriesButton(String(state.data[2].category));
    let realtySubcategoriesSellButton = getSubcategoriesButton(String(state.data[3].category));
    let realtySubcategoriesPossibleSellerButton = getSubcategoriesButton(String(state.data[4].category));
    let realtySubcategoriesTechnicalQuestionsButton = getSubcategoriesButton(String(state.data[5].category));
    let realtySubcagtegoriesReviewButton = getSubcategoriesButton(String(state.data[6].category));
    let realtySubcategoriesLegalForceButton = getSubcategoriesButton(String(state.data[8].category));

    let realtyQuestionDiscussionLotBeforBuyButton = getQuestionsAndAnswers(state.data[1].category, 1).questions;

    bot.start((ctx) => {
        ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, sitesButton);
    })

    bot.hears(String(state.sites[1]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Коммерческие торги", realtyCategoriesButton);
    })

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
        ctx.replyWithMarkdown(getQuestionsAndAnswers(state.data[0].category, 0).answers[0], feedbackButton);
    });

    //Что такое псевдоним
    bot.hears(state.data[0].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[0].category, 1).answers[0], feedbackButton));
    });

    //Как купить
    bot.hears(state.data[1].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[1].category, 0).answers[0], feedbackButton));
    });

    //Обсуждение лота до покупки
    bot.hears(state.data[1].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали обсуждение лота до покупки. Выберите вопрос.", Markup.keyboard(realtyQuestionDiscussionLotBeforBuyButton));
    });


    const test = getQuestionsAndAnswers(state.data[1].category, 3).questions[0];
    console.log();

    //Поиски и фильтры 
    bot.hears(state.data[1].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[1].category, 2).answers[0], feedbackButton));
    });

    //Прохождение торгов
    bot.hears(state.data[1].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[1].category, 3).answers[0], feedbackButton));
    });

    //Избранные лоты
    bot.hears(state.data[2].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[2].category, 0).answers[0], feedbackButton));
    });

    //Чёрный список продавцов
    bot.hears(state.data[2].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[2].category, 1).answers[0], feedbackButton));
    });

    //Как продавать
    bot.hears(state.data[3].subcategories[0].name, (ctx) => {
        //
    });

    //Теги-инструменты
    bot.hears(state.data[3].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[3].category, 1).answers[0], feedbackButton));
    });

    //Режим отпуск
    bot.hears(state.data[3].subcategories[2].name, (ctx) => {
        //
    });

    //Инструкция заполнения лота
    bot.hears(state.data[3].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[3].category, 3).answers[0], feedbackButton));
    });

    //Чёрный список покупателей
    bot.hears(state.data[4].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[4].category, 0).answers[0], feedbackButton));
    });

    //Ограничение по рейтингу покупателей
    bot.hears(state.data[4].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[4].category, 1).answers[0], feedbackButton));
    });

    //Антиснайпер
    bot.hears(state.data[4].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[4].category, 2).answers[0], feedbackButton));
    });

    //Замена пароля
    bot.hears(state.data[5].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 0).answers[0], feedbackButton));
    });

    //Роль емайла
    bot.hears(state.data[5].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 1).answers[0], feedbackButton));
    });

    //Восстановление доступа
    bot.hears(state.data[5].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 2).answers[0], feedbackButton));
    });

    //Проблема с авторизацией
    bot.hears(state.data[5].subcategories[3].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 3).answers[0], feedbackButton));
    });

    //Аватарка пользователя
    bot.hears(state.data[5].subcategories[4].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 4).answers[0], feedbackButton));
    });

    //Активность
    bot.hears(state.data[5].subcategories[5].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 5).answers[0], feedbackButton));
    });

    //Уведомление
    bot.hears(state.data[5].subcategories[6].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 6).answers[0], feedbackButton));
    });

    //Какой браузер
    bot.hears(state.data[5].subcategories[7].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[5].category, 7).answers[0], feedbackButton));
    });

    //Что такое отзыв
    bot.hears(state.data[6].subcategories[0].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[6].category, 0).answers[0], feedbackButton));
    });

    //Что должен содержать отзыв
    bot.hears(state.data[6].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[6].category, 1).answers[0], feedbackButton));
    });

    //Как оставить отзыв
    bot.hears(state.data[6].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[6].category, 2).answers[0], feedbackButton));
    });

    //тарифы
    bot.hears(state.data[7].category, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[7].category, 0).answers[0], feedbackButton));
    });

    //Какая эцп
    bot.hears(state.data[8].subcategories[0].name, (ctx) => {
        //
    });

    //Не получается подписать
    bot.hears(state.data[8].subcategories[1].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[8].category, 1).answers[0], feedbackButton));
    });

    //Как поменять сертификат
    bot.hears(state.data[8].subcategories[2].name, (ctx) => {
        ctx.replyWithMarkdown(escapeMarkdown(getQuestionsAndAnswers(state.data[8].category, 2).answers[0], feedbackButton));
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







/* let categoryData = []; 
let startButtons = []; 
let categoryRealtyButtons = [];
let subcategoryBuyRealtyButtons = [];
let getButtons;

 */

/* async function handleData() {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile('./excelQuestions.xlsx');
    const worksheet = workbook.getWorksheet('Пример вопросов');

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        const subcategory = worksheet.getCell(`B${i}`).value;
        const question = worksheet.getCell(`C${i}`).value;
        const answer = worksheet.getCell(`D${i}`).value;

        const existingCategory = categoryData.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            categoryData.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    console.log(categoryData[0].category);
    console.log(categoryData[0].subcategories.find((sub) => sub.name === 'Как зарегистрироваться'));

    const uniqueCategories = new Set();

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        uniqueCategories.add(category);
    }

    const categoriesRealtyArray = Array.from(uniqueCategories);

    categoryRealtyButtons = Markup.keyboard(
        categoriesRealtyArray.map((category) => [{
            text: category,
            callback_data: category,
        }])
    );

    getButtons = categoryData.map((categoryItem) => {
        const subcategoryButtons = [];
        categoryData.forEach((categoryItem) => {
            const subcategories = categoryItem.subcategories.map((subcategory) => ({
                text: subcategory.name,
                callback_data: `subcategory:${subcategory.name}`
            }));
            subcategoryButtons.push(...subcategories);
        });

        const questionButtons = [].concat(
            ...categoryData.map((categoryItem) =>
                categoryItem.subcategories.map((sub) =>
                    sub.questions.map((questionObj) => ({
                        text: questionObj.question,
                        callback_data: `question:${questionObj.question}`
                    }))
                )
            )
        );

        // Создание объекта кнопки для категории
        const categoryButton = { text: categoryItem, key: 'category' };

        // Создание объектов кнопок для подкатегорий с ключами
        const subcategoryButtonsWithKeys = subcategoryButtons.map((button, index) => ({ text: button || "", key: `subcategory_${index}` }));
        console.log(subcategoryButtonsWithKeys);

        // Создание объектов кнопок для вопросов с ключами
        const questionButtonsWithKeys = questionButtons.map((button, index) => ({ text: button || "", key: `question_${index}` }));
        console.log(questionButtonsWithKeys);
        // Создание массива кнопок для передачи в Markup.keyboard
        const allButtons = [
            [categoryButton],
            ...subcategoryButtonsWithKeys,
            ...questionButtonsWithKeys
        ];

        // Создание клавиатуры с заданным массивом кнопок
        const categoryMarkup = Markup.keyboard(allButtons, "").resize();

        return categoryMarkup;
    });
}
handleData(); */
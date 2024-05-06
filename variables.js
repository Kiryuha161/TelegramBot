const Exceljs = require('exceljs');
const Markup = require('telegraf/markup');

let data = [];
let dataBankrot = [];
let dataRosim = [];
let dataArt = [];
let sites = [
    "Viomitra.Банкротство",
    "Viomitra.Коммерческие торги",
    "Viomitra.Росимущество",
    "Viomitra.Арт"
]
let fullData = [];
const sitesMessages = [
    "Вы выбрали сайт Viomitra.Банкротство. Выберите категорию вопроса.",
    "Вы выбрали сайт Viomitra.Коммерческие торги. Выберите категорию вопроса.",
    "Вы выбрали сайт Viomitra.Росимущество. Выберите категорию вопроса.",
    "Вы выбрали сайт Viomitra.Арт. Выберите категорию вопроса"
]
const categoriesRealtyMessages = [
    "Вы выбрали категорию регистрация Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию покупка Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию возможности покупателя Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию продажа Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию возможности продавца Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию технические вопросы Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию отзывы Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию тарифы Viomitra.Коммерческие торги. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию сделки с юр.действиями Viomitra.Коммерческие торги. Выберите подкатегорию вопроса."
]
const categoriesBankrotMessages = [
    "Вы выбрали категорию задаток Viomitra.Банкротство. Выберите подкатегорию вопроса.",
    "На главной странице сайта нажать Перейти ( в секции Торги по банкротству). Вверху страницы сайты нажать кнопку Контакты. Если Вы авторизованы в системе — нажмите «Выйти из системы». Далее На главной странице сайта нажать Перейти (в секции Торги по банкротству). Вверху страницы сайты нажать кнопку Контакты.",
    "Вы выбрали категорию заявка на участие в торгах Viomitra.Банкротство. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию регистрация участника Viomitra.Банкротство. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию технические вопросы Viomitra.Банкротство. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию ЭЦП Viomitra.Банкротство. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию торги Viomitra.Банкротство. Выберите подкатегорию вопроса."
]
const categoriesRosimMessages = [ //На контакты оператора обработать сразу ответ
    "Вы выбрали категорию задаток Росимущество. Выберите подкатегорию вопроса.",
    "На главной странице сайта нажать Перейти ( в секции Торги по банкротству). Вверху страницы сайты нажать кнопку Контакты. Если Вы авторизованы в системе — нажмите «Выйти из системы». Далее На главной странице сайта нажать Перейти (в секции Торги по банкротству). Вверху страницы сайты нажать кнопку Контакты.",
    "Вы выбрали категорию заявка на участие в торгах Росимущество. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию регистрация участника Росимущество. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию технические вопросы Росимущество. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию ЭЦП Росимущество. Выберите подкатегорию вопроса.",
    "Вы выбрали категорию торги Росимущество. Выберите подкатегорию вопроса."
]
const categoriesArtMessages = [
    "Вы выбрали категорию регистрация Viomitra.Арт. Какой вопрос вас интересует?",
    "Вы выбрали категорию личный кабинет Viomitra.Арт. Какой вопрос вас интересует?",
    "Вы выбрали категорию доставка Viomitra.Арт. Какой вопрос вас интересует?",
    "Вы выбрали категорию размещение объявления Viomitra.Арт. Какой вопрос вас интересует?",
    "Вы выбрали категорию стоимость Viomitra.Арт. Какой вопрос вас интересует?",
    "Вы выбрали категорию оплата Viomitra.Арт. Какой вопрос вас интересует?"
]

let handleData = async () => {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile('./excelQuestions.xlsx');
    const worksheet = workbook.getWorksheet('Пример вопросов');

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        const subcategory = worksheet.getCell(`B${i}`).value;
        const question = worksheet.getCell(`C${i}`).value;
        const answer = worksheet.getCell(`D${i}`).value;

        const existingCategory = data.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            data.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    await workbook.xlsx.readFile('./bankrotQuestions.xlsx');
    const worksheetBankrot = workbook.getWorksheet('Лист1');

    for (let i = 1; i <= worksheetBankrot.lastRow.number; i++) {
        const category = worksheetBankrot.getCell(`A${i}`).value;
        const subcategory = worksheetBankrot.getCell(`B${i}`).value;
        const question = worksheetBankrot.getCell(`C${i}`).value;
        const answer = worksheetBankrot.getCell(`D${i}`).value;

        const existingCategory = dataBankrot.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            dataBankrot.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    await workbook.xlsx.readFile('./rosimQuestions.xlsx');
    const worksheetRosim = workbook.getWorksheet('Лист1');

    for (let i = 1; i <= worksheetRosim.lastRow.number; i++) {
        const category = worksheetRosim.getCell(`A${i}`).value;
        const subcategory = worksheetRosim.getCell(`B${i}`).value;
        const question = worksheetRosim.getCell(`C${i}`).value;
        const answer = worksheetRosim.getCell(`D${i}`).value;

        const existingCategory = dataRosim.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            dataRosim.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    await workbook.xlsx.readFile('./artQuestions.xlsx');
    const worksheetArt = workbook.getWorksheet('Пример вопросов - арт');

    for (let i = 1; i <= worksheetArt.lastRow.number; i++) {
        const category = worksheetArt.getCell(`A${i}`).value;
        const question = worksheetArt.getCell(`B${i}`).value;
        const answer = worksheetArt.getCell(`C${i}`).value;

        const existingCategory = dataArt.find((item) => item.category === category);

        if (existingCategory) {
            existingCategory.questions.push({ question, answer });
        } else {
            dataArt.push({ category, questions: [{ question, answer }] });
        }
    }
}

const SPECIAL_CHARS = [
    '_',
    '*',
    '[',
    ']',
    '~',
    '`',
    '&',
    '#',
    '+',
    '=',
    '|',
    '{',
    '}',
    '.',
    '!',
    '\''
]

const escapeMarkdown = (text) => {
    SPECIAL_CHARS.forEach(char => (text = text.replaceAll(char, `\\${char}`)))
    return text
}

const getRealtySubcategoriesButtons = (chapter) => {
    let subcategories = [];

    const dataCategory = data.find(category => category.category === chapter);

    if (dataCategory && Array.isArray(dataCategory.subcategories)) {
        subcategories = dataCategory.subcategories;
    }

    let subcategoriesButton = Markup.keyboard(
        subcategories.map(subcategory => Markup.button.callback(subcategory.name))
    );

    return subcategoriesButton;
}

const getBankrotSubcategoriesButtons = (chapter) => {
    let subcategories = [];

    const dataCategory = dataBankrot.find(category => category.category === chapter);

    if (dataCategory && Array.isArray(dataCategory.subcategories)) {
        subcategories = dataCategory.subcategories;
    }

    let subcategoriesButton = Markup.keyboard(
        subcategories.map(subcategory => Markup.button.callback(subcategory.name))
    );

    return subcategoriesButton;
}

const getRosimSubcategoriesButtons = (chapter) => {
    let subcategories = [];

    const dataCategory = dataRosim.find(category => category.category === chapter);

    if (dataCategory && Array.isArray(dataCategory.subcategories)) {
        subcategories = dataCategory.subcategories;
    }

    let subcategoriesButton = Markup.keyboard(
        subcategories.map(subcategory => Markup.button.callback(subcategory.name))
    );

    return subcategoriesButton;
}

const getQuestionsAndAnswersRealty = (category, subcategoryIndex) => { //Получение вопросов и ответов для бота
    let questionsAndAnswers = {};

    const categoryData = data.find(item => item.category === category);
    if (categoryData && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > subcategoryIndex) {
        const subcategory = categoryData.subcategories[subcategoryIndex];
        questionsAndAnswers.subcategory = subcategory.name;
        questionsAndAnswers.questions = subcategory.questions.map(question => question.question);
        questionsAndAnswers.answers = subcategory.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const getQuestionsAndAnswersBankrot = (category, subcategoryIndex) => { //Получение вопросов и ответов для бота
    let questionsAndAnswers = {};

    const categoryData = dataBankrot.find(item => item.category === category);
    if (categoryData && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > subcategoryIndex) {
        const subcategory = categoryData.subcategories[subcategoryIndex];
        questionsAndAnswers.subcategory = subcategory.name;
        questionsAndAnswers.questions = subcategory.questions.map(question => question.question);
        questionsAndAnswers.answers = subcategory.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const getQuestionsAndAnswersRosim = (category, subcategoryIndex) => { //Получение вопросов и ответов для бота
    let questionsAndAnswers = {};

    const categoryData = dataRosim.find(item => item.category === category);
    if (categoryData && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > subcategoryIndex) {
        const subcategory = categoryData.subcategories[subcategoryIndex];
        questionsAndAnswers.subcategory = subcategory.name;
        questionsAndAnswers.questions = subcategory.questions.map(question => question.question);
        questionsAndAnswers.answers = subcategory.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const getQuestionsAndAnswersArt = (category) => { //Получение вопросов и ответов для бота
    let questionsAndAnswers = {};

    const categoryData = dataArt.find(item => item.category === category);
    if (categoryData) {
        questionsAndAnswers.category = categoryData.category;
        questionsAndAnswers.questions = categoryData.questions.map(question => question.question);
        questionsAndAnswers.answers = categoryData.questions.map(question => question.answer);
    }

    return questionsAndAnswers;
}

const feedbackButton = Markup.keyboard([
    Markup.button.callback("Связаться с оператором"),
    Markup.button.callback("Задать другой вопрос")
])

const createCategoryButtons =() => {
    let sitesButton = Markup.keyboard(sites.map(site => Markup.button.callback(site)));
    const uniqueRealtyCategories = new Set(data.map(category => category.category));
    const uniqueBankrotCategories = new Set(dataBankrot.map(category => category.category));
    const uniqueRosimCategories = new Set(dataRosim.map(category => category.category));
    const uniqueArtCategories = new Set(dataArt.map(category => category.category))

    let realtyCategoriesButton = Markup.keyboard(
        [...uniqueRealtyCategories]
            .filter(category => category) 
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


    let realtySubcategoriesRegistrationButton = getRealtySubcategoriesButtons(String(data[0].category));
    let realtySubcategoriesBuyButton = getRealtySubcategoriesButtons(String(data[1].category));
    let realtySubcategoriesPossibleBuyerButton = getRealtySubcategoriesButtons(String(data[2].category));
    let realtySubcategoriesSellButton = getRealtySubcategoriesButtons(String(data[3].category));
    let realtySubcategoriesPossibleSellerButton = getRealtySubcategoriesButtons(String(data[4].category));
    let realtySubcategoriesTechnicalQuestionsButton = getRealtySubcategoriesButtons(String(data[5].category));
    let realtySubcagtegoriesReviewButton = getRealtySubcategoriesButtons(String(data[6].category));
    let realtySubcategoriesLegalForceButton = getRealtySubcategoriesButtons(String(data[8].category));

    let bankrotSubcategoriesDepositButtons = getBankrotSubcategoriesButtons(String(dataBankrot[0].category));
    let bankrotApplicationOnParticipationToTradeButtons = getBankrotSubcategoriesButtons(String(dataBankrot[2].category));
    let bankrotRegistrationButtons = getBankrotSubcategoriesButtons(String(dataBankrot[3].category));
    let bankrotTechnicalQuestionButtons = getBankrotSubcategoriesButtons(String(dataBankrot[4].category));
    let bankrotSignatureButtons = getBankrotSubcategoriesButtons(String(dataBankrot[5].category));
    let bankrotTradeButtons = getBankrotSubcategoriesButtons(String(dataBankrot[6].category));

    let rosimSubcategoriesDepositButtons = getRosimSubcategoriesButtons(String(dataRosim[0].category));
    let rosimApplicateionOnParticipationToTradeButtons = getRosimSubcategoriesButtons(String(dataRosim[2].category));
    let rosimSubcategoriesRegistrationButtons = getRosimSubcategoriesButtons(String(dataRosim[3].category));
    let rosimSubcategoriesTechnicalQuestionButtons = getRosimSubcategoriesButtons(String(dataRosim[4].category));
    let rosimSubcategoriesSignatureButtons = getRosimSubcategoriesButtons(String(dataRosim[5].category));
    let rosimSubcategoriesTradeButtons = getRosimSubcategoriesButtons(String(dataRosim[6].category));

    return { sitesButton, realtyCategoriesButton, bankrotCategoriesButton, rosimCategoriesButton, artCategoriesButton, realtySubcategoriesRegistrationButton,
        realtySubcategoriesBuyButton, realtySubcategoriesPossibleBuyerButton, realtySubcategoriesSellButton, realtySubcategoriesPossibleSellerButton,
        realtySubcategoriesTechnicalQuestionsButton, realtySubcagtegoriesReviewButton, realtySubcategoriesLegalForceButton, bankrotSubcategoriesDepositButtons,
        bankrotApplicationOnParticipationToTradeButtons, bankrotRegistrationButtons, bankrotTechnicalQuestionButtons, bankrotSignatureButtons,
        bankrotTradeButtons, rosimSubcategoriesDepositButtons, rosimApplicateionOnParticipationToTradeButtons, rosimSubcategoriesRegistrationButtons, 
        rosimSubcategoriesTechnicalQuestionButtons, rosimSubcategoriesSignatureButtons, rosimSubcategoriesTradeButtons }
}

const getAnswers =(data, chatData) => { //Получение ответов для веб-интерфейса
    console.log("data: " + JSON.stringify(data));
    console.log("chatData: " + JSON.stringify(chatData));
    
    data.forEach(category => {
        if (category.questions) {
            category.questions.forEach(qa => {
                if (qa.question === chatData.question) {
                    answer = qa.answer;
                }
            });
        }
    });
}

const getFullData =() => {
    fullData.push(sites);
    fullData.push(data);
    fullData.push(dataBankrot);
    fullData.push(dataRosim);
    fullData.push(dataArt);
}

module.exports = {
    handleData: handleData,
    escapeMarkdown: escapeMarkdown,
    getRealtySubcategoriesButtons: getRealtySubcategoriesButtons,
    getBankrotSubcategoriesButtons: getBankrotSubcategoriesButtons,
    getRosimSubcategoriesButtons: getRosimSubcategoriesButtons,
    getQuestionsAndAnswersRealty: getQuestionsAndAnswersRealty,
    getQuestionsAndAnswersBankrot: getQuestionsAndAnswersBankrot,
    getQuestionsAndAnswersRosim: getQuestionsAndAnswersRosim,
    getQuestionsAndAnswersArt: getQuestionsAndAnswersArt,
    createCategoryButtons: createCategoryButtons,
    getFullData: getFullData,
    getAnswers: getAnswers,
    feedbackButton: feedbackButton,
    state: {
        data: data,
        sites: sites,
        sitesMessages: sitesMessages,
        dataBankrot: dataBankrot,
        dataRosim: dataRosim,
        dataArt: dataArt,
        fullData: fullData,
        categoriesArtMessages: categoriesArtMessages,
        categoriesRealtyMessages: categoriesRealtyMessages,
        categoriesRosimMessages: categoriesRosimMessages,
        categoriesBankrotMessages: categoriesBankrotMessages
    }
}
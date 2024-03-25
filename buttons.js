const { faq } = require('./faq.js');
const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
const { state } = require('./variables.js');

const createCategoryButtons =(categories) => {
    const categoryNames = Object.keys(categories);
    const buttons = categoryNames.map(category => Markup.button.callback(categories[category].name, categories[category].id));
    return Markup.keyboard(buttons);
}

const createSubcategoryButtons =(subcategories) => {
    const subcategoryNames = Object.keys(subcategories);
    const buttons = subcategoryNames.map(subcategory => Markup.button.callback(subcategories[subcategory].name, subcategories[subcategory].id));
    return Markup.keyboard(buttons);
}

const createParticipationButtons =(participation) => {
    const participationName = Object.keys(participation);
    const buttons = participationName.map(part => Markup.button.callback(participation[part].name, participation[part].id));
    return Markup.keyboard(buttons);
}

const createAnswerButtons = (answers) => {
    const answerName = Object.keys(answers);
    const buttons = answerName.map(answer => Markup.button.callback(answers[answer].name, answers[answer].id));
    return Markup.keyboard(buttons);
}

const getFeedbackMarkup = Markup.keyboard ([
    Markup.button.callback('Бот помог'),
    Markup.button.callback('Связаться с оператором'),
    Markup.button.callback('Задать другой вопрос')
]);

module.exports.buttons = {
    replyCategoriesBankrotMarkup: createCategoryButtons(state.categoriesBankrot),
    replyParticipationBankrotMarkup: createParticipationButtons(faq.sites.bankrot.participation),
    replySubcategoriesDepositBankrotMarkup: createSubcategoryButtons(state.subcategoriesDepositBankrot),
    replySubcategoriesSignatureBankrotMarkup: createSubcategoryButtons(state.subcategoriesSignatureBankrot),
    replySubcategoriesApplicationForParticipationBankrotMarkup: createSubcategoryButtons(state.subcategoriesApplicationForParticipationBankrot),
    replySubcategoriesRegistrationBankrotMarkup: createSubcategoryButtons(state.subcategoriesRegistrationBankrot),
    replySubcategoriesTechnicalQuestionBankrotMarkup: createSubcategoryButtons(state.subcategoriesTechnicalQuestionBankrot),
    replyAnswersRefundDepositBankrotMarkup: createAnswerButtons(state.subcategoriesDepositBankrot.refundDeposit.answers),
    replyAnswersRequiredDigitalSignatureTypeBankrotMarkup: createAnswerButtons(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.answers),
    replyPlatformRegistrationBankrotMarkup: createAnswerButtons(state.subcategoriesRegistrationBankrot.platformRegistration.answers),
    replyRegistrationRejectionReceidedBankrotMarkup: createAnswerButtons(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers),
    replyFeedbackMarkup: getFeedbackMarkup
}


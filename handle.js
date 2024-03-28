const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
const fs = require('fs');
const Exceljs = require('exceljs');
const { buttons } = require('./buttons.js')

const categoryData = {};
let startButtons = [];
let categoryRealtyButtons = [];
let subcategoryRealtyButtons = [];

async function handleData() {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile('./excelQuestions.xlsx');
    const worksheet = workbook.getWorksheet('Пример вопросов');

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        const subcategory = worksheet.getCell(`B${i}`).value;
        const question = worksheet.getCell(`C${i}`).value;
        const answer = worksheet.getCell(`D${i}`).value;

        if (categoryData[category]) {
            if (categoryData[category][subcategory]) {
                categoryData[category][subcategory].push({ question, answer });
            } else {
                categoryData[category][subcategory] = [{ question, answer }];
            }
        } else {
            categoryData[category] = { [subcategory]: [{ question, answer }] };
        }
    }

    console.log(categoryData);

    const uniqueRealtyCategories = new Set();

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        uniqueRealtyCategories.add(category);
    }

    const categoriesRealtyArray = Array.from(uniqueRealtyCategories);

    categoryRealtyButtons = Markup.keyboard([
        categoriesRealtyArray.map((category) => ({
            text: category,
            callback_data: category,
        })),
    ]); 
}

handleData(); // Вызов функции для обработки данных

const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');

let messageInfo = "";

bot.start((ctx) => {
    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, startButtons);
})

bot.hears("Покупка Viomitra.Коммерческие торги", (ctx) => {
    ctx.replyWithMarkdown('Какая подкатегория вас интересует?', categoryButtons);
}) 

bot.hears(/Покупка Viomitra.Банкротство/, (ctx) => {
    ctx.reply(ctx, 'Вы выбрали категорию - Покупка. Выберите подкатегорию.');
})

bot.hears(/Регистрация Viomitra.Банкротство/, (ctx) => {
    ctx.reply(ctx, 'Вы выбрали категорию - Регистрация. Выберите подкатегорию.');
});

bot.hears("Задать другой вопрос", (ctx) => {
    ctx.replyWithMarkdown(`С какой площадкой Вам нужна помошь, ${ctx.message.from.username}`);
})

bot.hears('Бот помог', (ctx) => {
    ctx.reply('Рады помочь!');
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

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

/*module.exports.handler = async function (event, context) {
    const message = JSON.parse(event.body);
    await bot.handleUpdate(message);
    return {
        statusCode: 200,
        body: '',
    };
};*/

/* bot.hears(faq.sites.bankrot.name, (ctx) => {
    ctx.replyWithMarkdown(faq.sites.bankrot.value, buttons.replyParticipationBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(faq.sites.bankrot.participation.parirticipant.name, (ctx) => {
    ctx.replyWithMarkdown(faq.sites.bankrot.participation.parirticipant.value, buttons.replyCategoriesBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(faq.sites.bankrot.participation.organizer.name, (ctx) => {
    let user = ctx.message.from;
    let message = `У пользователя-организатора ${user.last_name} ${user.first_name} - @${user.username} вопрос по Viomitra.Банкротство`
    let chatId = 797596124;

    bot.telegram.sendMessage(chatId, message).then(() => {
        // После отправки сообщения можно обновить сообщение пользователя
        ctx.reply('С вами свяжется оператор', Markup.removeKeyboard());
    })
    .catch((error) => {
        console.error('Error sending message:', error);
        ctx.reply('Произошла ошибка при отправке сообщения');
    });;
})

bot.hears(state.categoriesBankrot.deposit.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.deposit.value, buttons.replySubcategoriesDepositBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.signature.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.signature.value, buttons.replySubcategoriesSignatureBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.applicationForParticipation.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.applicationForParticipation.value, buttons.replySubcategoriesApplicationForParticipationBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.registration.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.registration.value, buttons.replySubcategoriesRegistrationBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.technicalQuestion.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.technicalQuestion.value, buttons.replySubcategoriesTechnicalQuestionBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.trade.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.trade.value, buttons.replySubcategoriesTradeMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.technicalQuestion.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.technicalQuestion.value, buttons.replySubcategoriesTechnicalQuestionBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesDepositBankrot.refundDeposit.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesDepositBankrot.refundDeposit.value, buttons.replyAnswersRefundDepositBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.categoriesBankrot.contacts.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.contacts.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesDepositBankrot.refundDeposit.answers.destinationAccout.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesDepositBankrot.refundDeposit.answers.destinationAccout.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesDepositBankrot.refundDeposit.answers.otherDestinationAccount.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesDepositBankrot.refundDeposit.answers.otherDestinationAccount.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesDepositBankrot.refundDeposit.answers.refundApplicationProcessingPeriod.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesDepositBankrot.refundDeposit.answers.refundApplicationProcessingPeriod.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesDepositBankrot.paymentDeposit.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesDepositBankrot.paymentDeposit.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.value, buttons.replyAnswersRequiredDigitalSignatureTypeBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.value, buttons.replyPlatformRegistrationBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.value, buttons.replyRegistrationRejectionReceidedBankrotMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.answers.signatureForIndividuals.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.answers.signatureForIndividuals.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.answers.signatureForLegalEntitiesOrSoleProprietors.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesSignatureBankrot.requiredDigitalSignatureType.answers.signatureForLegalEntitiesOrSoleProprietors.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesSignatureBankrot.unableToSignDocumentsWithDigitalSignature.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesSignatureBankrot.unableToSignDocumentsWithDigitalSignature.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesSignatureBankrot.howToChangeCertificateInPersonalAccount.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesSignatureBankrot.howToChangeCertificateInPersonalAccount.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesSignatureBankrot.howToChangeCertificateInPersonalAccount.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesSignatureBankrot.howToChangeCertificateInPersonalAccount.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.applicationProcessingPeriod.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.applicationProcessingPeriod.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.viewingApplicationInPersonalAccount.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.viewingApplicationInPersonalAccount.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.submitApplicationForParticipation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.submitApplicationForParticipation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.whoCanSubmitApplicationForParticipation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.whoCanSubmitApplicationForParticipation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.withdrawApplicationForParticipation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.withdrawApplicationForParticipation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.editApplicationForParticipation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.editApplicationForParticipation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.noApplicationSubmittedForJoiningRegulation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.noApplicationSubmittedForJoiningRegulation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.noSignificationLegalActionsToSubmitApplication.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.noSignificationLegalActionsToSubmitApplication.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesApplicationForParticipationBankrot.expeditedApplicationReview.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesApplicationForParticipationBankrot.expeditedApplicationReview.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.submitApplicationForAdherenceToRegulation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.submitApplicationForAdherenceToRegulation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.applicationReviewTime.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.applicationReviewTime.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.applicationReviewTimeForAdherenceToRegulation.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.applicationReviewTimeForAdherenceToRegulation.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.applicationReviewTimeForLegalAction.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.applicationReviewTimeForLegalAction.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.notReceivedRegistrationNonificationOnEmail.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.notReceivedRegistrationNonificationOnEmail.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.regitrationGuide.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.regitrationGuide.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.withdrawRegistrationApplication.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.withdrawRegistrationApplication.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.expeditedRegistration.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.expeditedRegistration.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.registrationValidityPeriodOnETP.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.registrationValidityPeriodOnETP.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.positionInformationForIndividual.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.positionInformationForIndividual.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.receivedActivationCodeByEmail.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.receivedActivationCodeByEmail.value, buttons.replyFeedbackMarkup);
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.continuingRegistrationAfterActivationCode.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.continuingRegistrationAfterActivationCode.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.requiredDocumentsForRegistration.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.requiredDocumentsForRegistration.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.startingRegistrationProcess.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.startingRegistrationProcess.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.submittingRegistrationAndAdherenceApplicationSimultaneously.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.submittingRegistrationAndAdherenceApplicationSimultaneously.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.platformRegistration.answers.dataValidationInRegistrationApplication.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.platformRegistration.answers.dataValidationInRegistrationApplication.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.resubmittingRegostrationApplication.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.resubmittingRegostrationApplication.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.reattachingDocumentsAfterRejection.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.reattachingDocumentsAfterRejection.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.correctingDataAfterRejectionNotice.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.correctingDataAfterRejectionNotice.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.unableToIdentifyReasonForRejection.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesRegistrationBankrot.registrationRejectionReceided.answers.unableToIdentifyReasonForRejection.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTechnicalQuestionBankrot.recommendedBrowserForUse.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTechnicalQuestionBankrot.recommendedBrowserForUse.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTechnicalQuestionBankrot.forgotPasswordForAccount.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTechnicalQuestionBankrot.forgotPasswordForAccount.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTechnicalQuestionBankrot.registrationValidityPeriodForETP.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTechnicalQuestionBankrot.registrationValidityPeriodForETP.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTradeBankrot.informationAndDocumentProvisionForTradingAndLot.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTradeBankrot.informationAndDocumentProvisionForTradingAndLot.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTradeBankrot.contactInformationOfTradingOrganizer.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTradeBankrot.contactInformationOfTradingOrganizer.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTradeBankrot.publicOfferFormTradingSearch.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTradeBankrot.publicOfferFormTradingSearch.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTradeBankrot.auctionFormTradingSearch.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTradeBankrot.auctionFormTradingSearch.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTradeBankrot.findingTradesOnElectronicPlatform.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTradeBankrot.findingTradesOnElectronicPlatform.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
})

bot.hears(state.subcategoriesTradeBankrot.howAndWhenToSubmitParticipationApplication.name, (ctx) => {
    ctx.replyWithMarkdown(state.subcategoriesTradeBankrothowAndWhenToSubmitParticipationApplication.value, buttons.replyFeedbackMarkup);
    messageInfo = ctx.message.text;
}) */
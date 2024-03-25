const { faq } = require('./faq');

module.exports.state = {
    categoriesBankrot: faq.sites.bankrot.participation.parirticipant.categories,
    subcategoriesDepositBankrot:  faq.sites.bankrot.participation.parirticipant.categories.deposit.subcategories,
    subcategoriesContactsBankrot: faq.sites.bankrot.participation.parirticipant.categories.contacts.subcategories,
    subcategoriesSignatureBankrot:  faq.sites.bankrot.participation.parirticipant.categories.signature.subcategories,
    subcategoriesApplicationForParticipationBankrot: faq.sites.bankrot.participation.parirticipant.categories.applicationForParticipation.subcategories,
    subcategoriesRegistrationBankrot:  faq.sites.bankrot.participation.parirticipant.categories.registration.subcategories,
    subcategoriesTechnicalQuestionBankrot: faq.sites.bankrot.participation.parirticipant.categories.technicalQuestion.subcategories,
    subcategoriesTradeBankrot:  faq.sites.bankrot.participation.parirticipant.categories.trade.subcategories,
}
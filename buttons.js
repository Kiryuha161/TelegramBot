const { faq } = require('./faq.js');
const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');

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

module.exports.buttons = {
    replyCategoriesChinaMarkup: createCategoryButtons(faq.sites.china.categories),
    replyCategoriesBankrotMarkup: createCategoryButtons(faq.sites.bankrot.categories),
    replyCategoriesRealtyMarkup: createCategoryButtons(faq.sites.realty.categories),
    replySubcategoriesUserIdentificationChina: createSubcategoryButtons(faq.sites.china.categories.userIdentification.subcategories),
    /* replySubcategoriesPaymentChina: createSubcategoryButtons(faq.sites.china.categories.payment.subcategories), */
    replySubcategoriesUserIdentificationBankrot: createSubcategoryButtons(faq.sites.bankrot.categories.userIdentification.subcategories),
    replySubcategoriesUserIdentificationRealty: createSubcategoryButtons(faq.sites.realty.categories.userIdentification.subcategories)
}


/* const categoriesChina = faq.sites.china.categories;
const categoryNamesChina = Object.keys(categoriesChina);
const buttonsChina = categoryNamesChina.map(category => Markup.button.callback(categoriesChina[category].name, categoriesChina[category].id));
const replyCategoriesChinaMarkup = Markup.keyboard(buttonsChina);

const categoriesBankrot = faq.sites.bankrot.categories;
const categoryNamesBankrot = Object.keys(categoriesBankrot);
const buttonsBankrot = categoryNamesBankrot.map(category => Markup.button.callback(categoriesBankrot[category].name, categoriesBankrot[category].id));
const replyCategoriesBankrotMarkup = Markup.keyboard(buttonsBankrot);

const categoriesRealty = faq.sites.realty.categories;
const categoryNamesRealty = Object.keys(categoriesRealty);
const buttonsRealty = categoryNamesRealty.map(category => Markup.button.callback(categoriesRealty[category].name, categoriesRealty[category].id));
const replyCategoriesRealtyMarkup = Markup.keyboard(buttonsRealty); */

/* const subcategoriesUserIdentificationChina = faq.sites.china.categories.userIdentification.subcategories;
const subcategoriesUserIdentificationNamesRealty = Object.keys(subcategoriesUserIdentificationChina); */


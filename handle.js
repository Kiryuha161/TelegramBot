const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
const { faq } = require('./faq');
const { state } = require('./variables.js');
const { buttons } = require("./buttons.js");

const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');

const replyStartMarkup = Markup.keyboard(
    Object.keys(faq.sites).map(site => Markup.button.callback(faq.sites[site].name, site))
);

bot.start((ctx) => {
    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, replyStartMarkup);
});

bot.hears(state.sites.china.name, (ctx) => {
    ctx.replyWithMarkdown(state.sites.china.value, buttons.replyCategoriesChinaMarkup);
});

bot.hears(state.sites.bankrot.name, (ctx) => {
    ctx.replyWithMarkdown(state.sites.bankrot.value, buttons.replyCategoriesBankrotMarkup);
});

bot.hears(state.sites.realty.name, (ctx) => {
    ctx.replyWithMarkdown(state.sites.realty.value, buttons.replyCategoriesRealtyMarkup);
});

bot.hears(state.categoriesChina.userIdentification.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesChina.userIdentification.value, buttons.replySubcategoriesUserIdentificationChina);
});

bot.hears(state.categoriesBankrot.userIdentification.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesBankrot.userIdentification.value, buttons.replySubcategoriesUserIdentificationBankrot);
});

bot.hears(state.categoriesRealty.userIdentification.name, (ctx) => {
    ctx.replyWithMarkdown(state.categoriesRealty.userIdentification.value, buttons.replySubcategoriesUserIdentificationRealty);
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
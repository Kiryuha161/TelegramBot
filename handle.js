const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
const { faq } = require('./faq');

const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');

const replyStartMarkup = Markup.keyboard(
    Object.keys(faq.sites).map(site => Markup.button.callback(faq.sites[site].name, site))
);

const replyCategoriesChinaMarkup = Markup.keyboard(
    faq.sites.china.categories.map(category => 
        Markup.button.callback(category.userIdentification.name, category.userIdentification.id)
    )
);

const replyCategoriesBankrotMarkup = Markup.keyboard(
    Object.keys(faq.sites.bankrot.categories).map(category => Markup.button.callback(faq.sites.bankrot.categories[category].name, category))
);

const replyCategoriesRealtyMarkup = Markup.keyboard(
    Object.keys(faq.sites.realty.categories).map(category => Markup.button.callback(faq.sites.realty.categories[category].name, category))
);

bot.start((ctx) => {
    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, replyStartMarkup);
});

bot.hears(faq.sites.china.name, (ctx) => {
    ctx.replyWithMarkdown(`Вы, выбрали Viomitra.Китай. С чем связан Ваш вопрос?`, replyCategoriesChinaMarkup);
    messageInfo = ctx.message.text;
});

bot.hears(faq.sites.bankrot.name, (ctx) => {
    ctx.replyWithMarkdown(`Вы, выбрали Viomitra.Банкротство. С чем связан Ваш вопрос?`, replyCategoriesBankrotMarkup);
});

bot.hears(faq.sites.realty.name, (ctx) => {
    ctx.replyWithMarkdown(`Вы, выбрали Viomitra.Коммерческие торги. С чем связан Ваш вопрос?`, replyCategoriesRealtyMarkup);
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
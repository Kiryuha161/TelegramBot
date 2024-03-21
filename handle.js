const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');

const bot = new Telegraf(process.env.BOT_TOKEN);

let messageInfo;

const replyStartMarkup = Markup.keyboard ([
    Markup.button.callback('Viomitra.Китай', 'china'),
    Markup.button.callback('Viomitra.Банкротство', 'bankrot')
]);

const replyAskChinaMarkup = Markup.keyboard ([
    Markup.button.callback('Регистрация Viomitra.Китай', 'registrationChina'),
    Markup.button.callback('Восстановление доступа Viomotra.Китай', 'accessRecoveryChina')
]);

const replyAskBankrotMarkup = Markup.keyboard ([
    Markup.button.callback('Регистрация Viomitra.Банкротство', 'registrationBankrot'),
    Markup.button.callback('Восстановление доступа Viomitra.Банкротство', 'accessRecoveryBankrot')
]);

const replyAskHelpMarkup = Markup.keyboard ([
    Markup.button.callback('Помог', 'yes'),
    Markup.button.callback('Не помог', 'no'),
    Markup.button.callback('Задать другой вопрос', 'newAsk')
]);

bot.start((ctx) => {
    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, replyStartMarkup);
});

bot.hears('Viomitra.Китай', (ctx) => {
    ctx.replyWithMarkdown(`Вы, выбрали Viomitra.Китай. С чем связан Ваш вопрос?`, replyAskChinaMarkup);
    messageInfo = ctx.message.text;
});

bot.hears('Viomitra.Банкротство', (ctx) => {
    ctx.replyWithMarkdown(`Вы, выбрали Viomitra.Банкротство. С чем связан Ваш вопрос?`, replyAskBankrotMarkup);
});

bot.hears('Регистрация Viomitra.Китай', (ctx) => {
    ctx.replyWithMarkdown('Изучите этот раздел FAQ - https://china.viomitra.ru/registration \nВам помог наш бот?', replyAskHelpMarkup);
    messageInfo = ctx.message.text;
});

bot.hears('Регистрация Viomitra.Банкротство', (ctx) => {
    ctx.replyWithMarkdown('Скачайте этот документ с инструкцией - https://bankrot.viomitra.ru/Document/GuideDocument?guideName=RegistrationGuideDoc \nВам помог наш бот?', replyAskHelpMarkup);
    messageInfo = ctx.message.text;
});

bot.hears('Восстановление доступа Viomotra.Китай', (ctx) => {
    ctx.replyWithMarkdown('Изучите этот раздел FAQ - https://china.viomitra.ru/restore \nВам помог наш бот?', replyAskHelpMarkup);
    messageInfo = ctx.message.text;
});

bot.hears('Восстановление доступа Viomitra.Банкротство', (ctx) => {
    ctx.replyWithMarkdown('Если вы забыли пароль, вы можете воспользоваться формой "Забыли пароль?" http://bankrot.viomitra.ru/Account/ForgotPassword \nВам помог наш бот?', replyAskHelpMarkup);
    messageInfo = ctx.message.text;
});

bot.hears('Помог', (ctx) => {
    ctx.reply('Рады помочь!');
});

bot.hears('Не помог', (ctx) => {
    let user = ctx.message.from;
    let message = `Пользователю @${user.username} (${user.id}) требуется помощь. Проблема, которую выбрал пользователь: ${messageInfo}`;
    let chatId = 797596124;

    bot.telegram.sendMessage(chatId, message);

    ctx.reply('С вами свяжется оператор')
});

bot.hears('Задать другой вопрос', (ctx) => {
    ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, replyStartMarkup);
});

module.exports.handler = async function (event, context) {
    const message = JSON.parse(event.body);
    await bot.handleUpdate(message);
    return {
        statusCode: 200,
        body: '',
    };
};
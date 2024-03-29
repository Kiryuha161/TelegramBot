const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');
const { buttons } = require('./buttons.js')
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;

const bot = new Telegraf('6366545078:AAFZjWTJXL4RQ3rG6yvesEj-X0CciRb1JoU');
let messageInfo = "";

const runBot = async () => {
    await handleData();
    console.log(state.data);
    let sitesButton = Markup.keyboard(state.sites.map(site => Markup.button.callback(site)));
    const uniqueCategories = new Set(state.data.map(category => category.category));

    let realtyCategories = Markup.keyboard(
        [...uniqueCategories]
          .filter(category => category) // Фильтрация пустых или неопределенных значений
          .map(category => Markup.button.callback(category))
      );

      let subcategoriesRegistration = [];
      const registrationCategory = "Регистрация Viomitra.Коммерческие торги";
      
      // Находим категорию "Регистрация" в state.data
      const registrationData = state.data.find(category => category.category === registrationCategory);
      
      if (registrationData && Array.isArray(registrationData.subcategories)) {
          // Если найдена категория "Регистрация" и подкатегории - массив
          subcategoriesRegistration = registrationData.subcategories;
      }
      
      let realtySubcategoriesRegistrationButton = Markup.keyboard(
          subcategoriesRegistration.map(subcategory => Markup.button.callback(subcategory.name))
      );
      

    bot.start((ctx) => {
        ctx.replyWithMarkdown(`Привет, ${ctx.message.from.username}! С какой площадкой вам нужна помощь?`, sitesButton);
    })

    bot.hears(String(state.sites[1]), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали сайт Viomitra.Коммерческие торги", realtyCategories);
    })

    bot.hears(String(state.data[0].category), (ctx) => {
        ctx.replyWithMarkdown("Вы выбрали регистрацию. Выберите подкатегорию", realtySubcategoriesRegistrationButton);
    })

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
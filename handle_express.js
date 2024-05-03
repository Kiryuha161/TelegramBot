const express = require('express');
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;
let { escapeMarkdown, getBankrotSubcategoriesButtons, getRealtySubcategoriesButtons, getRosimSubcategoriesButtons,
    getQuestionsAndAnswersRealty, getQuestionsAndAnswersBankrot, getQuestionsAndAnswersRosim, getQuestionsAndAnswersArt,
    createCategoryButtons} = require('./variables.js');
let { feedbackButton } = require('./variables.js');
const path = require('path');
const logger = require('./logger.js');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/', async (req, res) => {
    const chatData = req.body;
    let answer;
    /* for(let i = 0; i <=) */
    if (chatData.question == state.data[0]) {
        answer  = "Ответ на вопрос";
    } else {
        answer = "Неожиданный вопрос"
    }

    console.log("Полученные данные из чата: ", chatData);

    res.send(answer);
})

const PORT = 3000; 

app.listen(PORT, () => {
    logger.startLogger(`Сервер запущен на порту ${PORT}`, PORT);
});



const express = require('express');
let state = require('./variables.js').state;
let handleData = require('./variables.js').handleData;
let { escapeMarkdown, getBankrotSubcategoriesButtons, getRealtySubcategoriesButtons, getRosimSubcategoriesButtons,
    getQuestionsAndAnswersRealty, getQuestionsAndAnswersBankrot, getQuestionsAndAnswersRosim, getQuestionsAndAnswersArt,
    createCategoryButtons, getAnswers} = require('./variables.js');
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
    await handleData();
    //console.log(JSON.stringify(state));
    
    const siteIndex = state.sites.findIndex(site => site === chatData.question);
    if (siteIndex !== -1) {
        answer = state.sitesMessages[siteIndex];
    }
    
    state.dataArt.forEach(category => {
        if (category.questions) {
            category.questions.forEach(qa => {
                if (qa.question === chatData.question) {
                    answer = qa.answer;
                }
            });
        }
    });
    
    console.log("Полученные данные из чата: ", chatData);
    console.log("Ответ: " + answer);

    res.send(answer);
})

const PORT = 3000; 

app.listen(PORT, () => {
    logger.startLogger(`Сервер запущен на порту ${PORT}`, PORT);
});



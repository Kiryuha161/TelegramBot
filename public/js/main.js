// Функция для загрузки вопроса второго уровня и выше
function loadChildQuestion(questionId, parentQuestionId) {
  const question = questions[parentQuestionId].children[questionId];
  if (question) {
    currentQuestionId = questionId;
    displayQuestionAndAnswer(question.question, question.answer);
    displayBackButton(parentQuestionId);
    if (question.children) {
      displayChildrenQuestions(question.children);
    } else {
      clearChildQuestions();
    }
  } else {
    displayQuestionAndAnswer("Ошибка", "Вопрос не найден");
    clearChildQuestions();
  }
}

// Функция для загрузки вопроса первого уровня
function loadQuestion(questionId, questions, parentQuestionId = null) {
  const question = questions[questionId];
  if (question) {
    currentQuestionId = questionId;
    displayQuestionAndAnswer(question.question, question.answer);
    if (parentQuestionId) {
      displayBackButton(parentQuestionId);
    } else {
      clearBackButton();
    }
    if (question.children) {
      displayChildrenQuestions(question.children);
    } else {
      clearChildQuestions();
    }
  } else {
    displayQuestionAndAnswer("Ошибка", "Вопрос не найден");
    clearBackButton();
    clearChildQuestions();
  }
}

// Функция для отображения вопроса и ответа
function displayQuestionAndAnswer(question, answer) {
  const messageContainer = document.getElementById('message-container');
  const questionContainer = document.createElement('div');
  questionContainer.classList.add('question');
  const questionText = document.createElement('span');
  questionText.textContent = question;
  questionText.classList.add('chat-messages__text');
  const answerContainer = document.createElement('div');
  answerContainer.classList.add('answer');
  const answerText = document.createElement('span');
  answerText.textContent = answer;
  answerText.classList.add('chat-messages__text');

  messageContainer.appendChild(questionContainer);
  messageContainer.appendChild(answerContainer);
  questionContainer.appendChild(questionText);
  answerContainer.appendChild(answerText);
}

// Функция для отображения вариантов ответов на вопросы
function displayChildrenQuestions(children) {
  const contentChild = document.createElement('div');
  contentChild.classList.add('chat-messages__content-child');
  clearChildQuestions(); // Очищаем содержимое контейнера перед добавлением новых кнопок
  for (const key in children) {
    const childQuestion = children[key];
    const childButton = document.createElement('button');
    childButton.classList.add('question-btn', 'chat-messages__btn', 'button__child');
    childButton.textContent = childQuestion.question;
    childButton.dataset.questionId = key;
    childButton.dataset.parentQuestionId = currentQuestionId;
    contentChild.appendChild(childButton);
  }

  const messageContainer = document.getElementById('chat-messages');
  messageContainer.appendChild(contentChild);

  // Добавляем обработчики клика к кнопкам второго уровня
  const childButtons = contentChild.querySelectorAll('.button__child');
  childButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentQuestionId = button.dataset.parentQuestionId;
      const questionId = button.dataset.questionId;
      loadChildQuestion(questionId, parentQuestionId);
    });
  });
}

// Функция для отображения кнопки "Вернуться назад"
function displayBackButton(parentQuestionId) {
  clearBackButton();
  const backButton = document.createElement('button');
  backButton.classList.add('question-btn', 'chat-messages__btn', 'back-btn');
  backButton.textContent = 'Вернуться назад';
  backButton.onclick = () => loadQuestion(parentQuestionId);
  const messageContainer = document.getElementById('chat-messages');
  messageContainer.appendChild(backButton);
}

// Функция для очистки кнопки "Вернуться назад"
function clearBackButton() {
  const backButton = document.querySelector('.back-btn');
  if (backButton) {
    backButton.remove();
  }
}

// Функция для очистки вопросов второго уровня
function clearChildQuestions() {
  const contentChild = document.querySelector('.chat-messages__content-child');
  if (contentChild) {
    contentChild.remove();
  }
}

// Инициализация чата
/* document.addEventListener('DOMContentLoaded', () => {
  loadQuestion(1);
});
 */
// Дополнительные функции для работы с интерфейсом чата
document.addEventListener('DOMContentLoaded', () => {
  const titleElement = document.querySelector('.chat__title');
  if (titleElement) {
    titleElement.addEventListener('click', () => {
      const chatMessagesContainer = document.querySelector('.chat-messages');
      if (chatMessagesContainer) {
        chatMessagesContainer.classList.toggle('chat-messages--active');
        titleElement.classList.toggle('chat__title--active');
      }
    });
  }
});


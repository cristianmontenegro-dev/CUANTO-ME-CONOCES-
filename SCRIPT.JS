document.addEventListener('DOMContentLoaded', () => {
  // Base de preguntas fiel a la lógica original en Python
  const quizData = [
    {
      question: '¿Cuál es mi nombre?',
      options: ['jeremias', 'david', 'thomas', 'cristian'],
      answer: 'cristian',
      successMsg: '¡CORRECTO! Siguiente pregunta...',
      errorMsg: 'Intenta de nuevo'
    },
    {
      question: '¿Cuál es mi comida favorita?',
      options: ['hamburguesa', 'salchipapa', 'pizza', 'alitas BBQ'],
      answer: 'salchipapa',
      successMsg: '¡EXCELENTE!',
      errorMsg: 'No es esa comida, ¡intenta otra vez!'
    },
    {
      question: '¿Cuál es mi deporte favorito?',
      options: ['futboll', 'boxeo', 'tenis', 'ping-pong'],
      answer: 'boxeo',
      successMsg: '¡MUY BIEN!',
      errorMsg: '¡Vuelve a intentarlo!'
    },
    {
      question: '¿Cuál es mi pasatiempo favorito?',
      options: ['entrenar', 'bailar', 'caminar', 'leer', 'dibujar'],
      answer: 'dibujar',
      successMsg: '¡LO LOGRASTE!',
      errorMsg: 'Un intento más'
    }
  ];

  // Variables de estado (equivalentes a tus contadores en Python)
  let currentQuestionIndex = 0;
  let respuestaCorrecta = 0;
  let respuestaIncorrecta = 0;
  let isTransitioning = false;

  // Referencias al DOM
  const correctCountEl = document.getElementById('correctCount');
  const incorrectCountEl = document.getElementById('incorrectCount');
  const stepIndicatorEl = document.getElementById('stepIndicator');
  const progressFillEl = document.getElementById('progressFill');
  const questionTextEl = document.getElementById('questionText');
  const optionsGridEl = document.getElementById('optionsGrid');
  const feedbackBannerEl = document.getElementById('feedbackBanner');

  const gameScreenEl = document.getElementById('gameScreen');
  const resultScreenEl = document.getElementById('resultScreen');
  const restartBtn = document.getElementById('restartBtn');

  // Formatear texto con primera letra mayúscula para UI limpia
  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Cargar pregunta actual
  function loadQuestion() {
    isTransitioning = false;
    const current = quizData[currentQuestionIndex];

    // Actualizar indicadores superiores
    stepIndicatorEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizData.length}`;
    const progressPercent = (currentQuestionIndex / quizData.length) * 100;
    progressFillEl.style.width = `${progressPercent}%`;

    // Renderizar pregunta y limpiar feedback
    questionTextEl.textContent = current.question;
    feedbackBannerEl.className = 'feedback-banner';
    feedbackBannerEl.textContent = '';
    optionsGridEl.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D', 'E'];

    current.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span>${capitalize(option)}</span>
        <span class="option-key">${letters[index]}</span>
      `;
      btn.addEventListener('click', () => handleAnswer(option, btn));
      optionsGridEl.appendChild(btn);
    });
  }

  // Validar selección del usuario (Lógica while True adaptada a eventos)
  function handleAnswer(selectedOption, buttonEl) {
    if (isTransitioning) return;

    const current = quizData[currentQuestionIndex];

    if (selectedOption === current.answer) {
      // Acierto: suma punto, bloquea botones y avanza automáticamente
      isTransitioning = true;
      respuestaCorrecta++;
      correctCountEl.textContent = respuestaCorrecta;

      buttonEl.classList.add('correct');
      showFeedback(current.successMsg, 'success');

      // Deshabilitar botones durante la transición
      document.querySelectorAll('.option-btn').forEach(b => (b.disabled = true));

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
          loadQuestion();
        } else {
          showResults();
        }
      }, 1100);
    } else {
      // Error: suma fallo, marca error visual y permite seguir intentando (while True)
      respuestaIncorrecta++;
      incorrectCountEl.textContent = respuestaIncorrecta;

      buttonEl.classList.remove('wrong');
      void buttonEl.offsetWidth; // Reinicia animación CSS shake
      buttonEl.classList.add('wrong');
      buttonEl.disabled = true; // Evita repetir la misma opción ya descartada

      showFeedback(current.errorMsg, 'error');
    }
  }

  function showFeedback(message, type) {
    feedbackBannerEl.textContent = message;
    feedbackBannerEl.className = `feedback-banner visible ${type}`;
  }

  // Pantalla de resumen final
  function showResults() {
    progressFillEl.style.width = '100%';
    stepIndicatorEl.textContent = '¡Completado!';
    gameScreenEl.classList.add('hidden');
    resultScreenEl.classList.remove('hidden');

    const totalAttempts = respuestaCorrecta + respuestaIncorrecta;
    const precision = Math.round((respuestaCorrecta / totalAttempts) * 100);

    document.getElementById('finalCorrect').textContent = respuestaCorrecta;
    document.getElementById('finalIncorrect').textContent = respuestaIncorrecta;
    document.getElementById('finalPrecision').textContent = `${precision}%`;

    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');

    if (respuestaIncorrecta === 0) {
      resultEmoji.textContent = '👑';
      resultTitle.textContent = '¡Me conoces al 100%!';
      resultMessage.textContent = 'No fallaste ni una sola vez. Eres un verdadero amigo.';
    } else if (respuestaIncorrecta <= 3) {
      resultEmoji.textContent = '🔥';
      resultTitle.textContent = '¡Buen trabajo!';
      resultMessage.textContent = 'Superaste el reto con muy pocos errores.';
    } else {
      resultEmoji.textContent = '😅';
      resultTitle.textContent = '¡Por fin lo lograste!';
      resultMessage.textContent = 'Te costó varios intentos, pero llegaste hasta el final.';
    }
  }

  // Reiniciar partida
  restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    respuestaCorrecta = 0;
    respuestaIncorrecta = 0;

    correctCountEl.textContent = '0';
    incorrectCountEl.textContent = '0';

    resultScreenEl.classList.add('hidden');
    gameScreenEl.classList.remove('hidden');
    loadQuestion();
  });

  // Iniciar juego
  loadQuestion();
});
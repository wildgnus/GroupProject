// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Инициализация API с ключом из файла .env
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Подключаем Express для обработки JSON-запросов
app.use(express.json());
// Сервируем статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint для генерации рецептов
app.post('/generate-recipe', async (req, res) => {
  const { ingredients, cookingTime, filters } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Формирование запроса к модели, учитывая фильтры
    const prompt = `Предложи мне рецепт блюда, используя следующие ингредиенты: ${ingredients}. Время приготовления не должно превышать ${cookingTime}. Дополнительные требования: ${filters.join(', ')}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ recipe: text });
  } catch (error) {
    console.error("Ошибка при генерации рецепта:", error);
    res.status(500).json({ error: "Не удалось сгенерировать рецепт." });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
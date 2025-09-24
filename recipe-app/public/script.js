const input = document.getElementById('input');
const output = document.getElementById('output');
const sendBtn = document.getElementById('send');

// ⚠️ вставьте сюда ваш API-ключ Gemini
const API_KEY = "ВАШ_API_KEY";

async function queryGemini(prompt) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;

  const body = {
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Ошибка: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Нет ответа.";
}

sendBtn.addEventListener('click', async () => {
  output.textContent = "⏳ Получаем ответ...";
  try {
    const reply = await queryGemini(input.value);
    output.textContent = reply;
  } catch (err) {
    output.textContent = "Ошибка запроса: " + err.message;
  }
});

async function analyzeWithAI() {
  const btn = document.getElementById("btn-analyze");
  const results = document.getElementById("a11y-results");

  btn.disabled = true;
  btn.textContent = "⏳ Analizando...";
  results.classList.add("visible");
  results.innerHTML = "Gemini está revisando tu página...";

  const { text, imgsSinAlt, btnsSinLabel } = getPageContent();

  const prompt = `
    Eres un experto en accesibilidad web (WCAG 2.1).
    Analiza esta información y responde en español.
    Texto visible: "${text}"
    Imágenes sin alt text: ${imgsSinAlt.length}
    Botones sin etiqueta: ${btnsSinLabel}
    Dame exactamente 3 problemas encontrados con este formato:
    ⚠️ [problema corto]
    → Fix: [solución en 1 línea]
    Sin introducciones.
  `;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    results.innerHTML = data.answer.replace(/\n/g, "<br>");
    btn.textContent = "✅ Análisis listo";
  } catch (error) {
    results.innerHTML = "❌ Error al conectar con Gemini.";
    btn.textContent = "🔍 Analizar página con IA";
    btn.disabled = false;
  }
}

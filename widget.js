// ── 1. CREAR EL WIDGET ──
const widget = document.createElement("div");
widget.id = "a11y-widget";
widget.innerHTML = `
  <div id="a11y-panel">
    <div class="a11y-header">
      <h3>♿ Accesibilidad</h3>
      <span>Beta ✨</span>
    </div>
    <div class="a11y-section">
      <label>Texto</label>
      <div class="a11y-controls">
        <button class="a11y-btn" id="btn-font-down">A−</button>
        <button class="a11y-btn" id="btn-font-up">A+</button>
      </div>
    </div>
    <div class="a11y-section">
      <label>Visual</label>
      <div class="a11y-controls">
        <button class="a11y-btn" id="btn-contrast">Alto contraste</button>
        <button class="a11y-btn" id="btn-readable">Modo lectura</button>
      </div>
    </div>
    <div class="a11y-section">
      <label>✨ Inteligencia Artificial</label>
      <button class="a11y-ai-btn" id="btn-analyze">
        🔍 Analizar página con IA
      </button>
      <div id="a11y-results"></div>
    </div>
  </div>
  <button id="a11y-toggle">♿</button>
`;

// ── 2. INSERTAR EN EL DOM ──
document.body.appendChild(widget);

// ── 3. TOGGLE ──
const toggle = document.getElementById("a11y-toggle");
const panel = document.getElementById("a11y-panel");

toggle.addEventListener("click", () => {
  panel.classList.toggle("open");
});

// ── 4. TAMAÑO DE FUENTE ──
let fontSize = 100;

document.getElementById("btn-font-up").addEventListener("click", () => {
  fontSize = Math.min(fontSize + 10, 150);
  document.body.style.fontSize = fontSize + "%";
});

document.getElementById("btn-font-down").addEventListener("click", () => {
  fontSize = Math.max(fontSize - 10, 80);
  document.body.style.fontSize = fontSize + "%";
});

// ── 5. ALTO CONTRASTE ──
document.getElementById("btn-contrast").addEventListener("click", function () {
  document.body.classList.toggle("high-contrast");
  this.classList.toggle("active");
});

// ── 6. MODO LECTURA ──
document.getElementById("btn-readable").addEventListener("click", function () {
  document.body.classList.toggle("readable-mode");
  this.classList.toggle("active");
});

// ── 7. CAPTURAR CONTENIDO ──
function getPageContent() {
  const text = document.body.innerText.slice(0, 2000);

  const imgsSinAlt = [...document.querySelectorAll("img")]
    .filter((img) => !img.alt || img.alt.trim() === "")
    .map((img) => img.src)
    .slice(0, 5);

  const btnsSinLabel = [...document.querySelectorAll("button, a")].filter(
    (el) => !el.textContent.trim() || el.textContent.trim().length < 2,
  ).length;

  return { text, imgsSinAlt, btnsSinLabel };
}

// ── 8. ANALIZAR CON IA ──
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

// ── 9. CONECTAR BOTÓN IA ──
document.getElementById("btn-analyze").addEventListener("click", analyzeWithAI);

/**
 * app.js — Calculadora de Macros y Calorías
 *
 * Responsabilidades:
 *  - Validación estricta de entrada (gramos > 0, calorias > 0)
 *  - Cálculo acumulado de macronutrientes (Proteínas, Carbohidratos, Grasas)
 *  - Gráfico de dona dinámico con Chart.js
 *  - Persistencia en localStorage usando fecha ISO YYYY-MM-DD como clave
 */

'use strict';

// ── Utilidades de fecha ────────────────────────────────────────────────────────

/**
 * Retorna la fecha actual en formato ISO YYYY-MM-DD (zona local).
 * @returns {string}
 */
function getTodayISO() {
  const now = new Date();
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day   = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ── Clave de localStorage ──────────────────────────────────────────────────────

const STORAGE_PREFIX = 'macros_';

/**
 * Retorna la clave de localStorage para el día indicado.
 * @param {string} dateISO  Fecha en formato YYYY-MM-DD
 * @returns {string}
 */
function storageKey(dateISO) {
  return `${STORAGE_PREFIX}${dateISO}`;
}

// ── Persistencia ──────────────────────────────────────────────────────────────

/**
 * Carga el array de alimentos del día desde localStorage.
 * @param {string} dateISO
 * @returns {Array<FoodItem>}
 */
function loadItems(dateISO) {
  try {
    const raw = localStorage.getItem(storageKey(dateISO));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda el array de alimentos del día en localStorage.
 * @param {string} dateISO
 * @param {Array<FoodItem>} items
 */
function saveItems(dateISO, items) {
  localStorage.setItem(storageKey(dateISO), JSON.stringify(items));
}

// ── Validación ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} FoodItem
 * @property {string} id
 * @property {string} nombre
 * @property {number} gramos
 * @property {number} calorias
 * @property {number} proteinas
 * @property {number} carbohidratos
 * @property {number} grasas
 */

/**
 * Valida los datos de un alimento.
 * Reglas estrictas: gramos > 0 y calorias > 0.
 * Los macros (proteínas, carbohidratos, grasas) deben ser >= 0.
 *
 * @param {Object} data  Datos crudos del formulario
 * @returns {{ valid: boolean, error: string }}
 */
function validateFoodInput(data) {
  if (!data.nombre || data.nombre.trim() === '') {
    return { valid: false, error: 'El nombre del alimento es obligatorio.' };
  }

  if (isNaN(data.gramos) || data.gramos <= 0) {
    return { valid: false, error: 'Los gramos deben ser un número mayor que 0.' };
  }

  if (isNaN(data.calorias) || data.calorias <= 0) {
    return { valid: false, error: 'Las calorías deben ser un número mayor que 0.' };
  }

  if (isNaN(data.proteinas) || data.proteinas < 0) {
    return { valid: false, error: 'Las proteínas no pueden ser negativas.' };
  }

  if (isNaN(data.carbohidratos) || data.carbohidratos < 0) {
    return { valid: false, error: 'Los carbohidratos no pueden ser negativos.' };
  }

  if (isNaN(data.grasas) || data.grasas < 0) {
    return { valid: false, error: 'Las grasas no pueden ser negativas.' };
  }

  return { valid: true, error: '' };
}

// ── Cálculo acumulado de macronutrientes ──────────────────────────────────────

/**
 * Calcula los totales acumulados de todos los alimentos del día.
 *
 * @param {Array<FoodItem>} items
 * @returns {{ totalCalorias: number, totalProteinas: number, totalCarbohidratos: number, totalGrasas: number }}
 */
function calculateTotals(items) {
  return items.reduce(
    (acc, item) => ({
      totalCalorias:      acc.totalCalorias      + item.calorias,
      totalProteinas:     acc.totalProteinas     + item.proteinas,
      totalCarbohidratos: acc.totalCarbohidratos + item.carbohidratos,
      totalGrasas:        acc.totalGrasas        + item.grasas,
    }),
    { totalCalorias: 0, totalProteinas: 0, totalCarbohidratos: 0, totalGrasas: 0 }
  );
}

// ── Chart.js — Gráfico de dona ────────────────────────────────────────────────

/** @type {import('chart.js').Chart|null} */
let macroChart = null;

/**
 * Inicializa el gráfico de dona con datos vacíos.
 * Se llama una sola vez al arrancar la app.
 */
function initChart() {
  const ctx = document.getElementById('macroChart').getContext('2d');

  macroChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteínas (g)', 'Carbohidratos (g)', 'Grasas (g)'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#4f7ef8', '#22c55e', '#eab308'],
        borderColor:     ['#3563e9', '#16a34a', '#ca8a04'],
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            font: { size: 13 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.toFixed(1)} g`,
          },
        },
      },
    },
  });
}

/**
 * Actualiza dinámicamente los datos del gráfico de dona.
 * Si todos los macros son 0 oculta el canvas y muestra el mensaje vacío.
 *
 * @param {{ totalProteinas: number, totalCarbohidratos: number, totalGrasas: number }} totals
 */
function updateChart(totals) {
  const { totalProteinas, totalCarbohidratos, totalGrasas } = totals;
  const hasData = totalProteinas > 0 || totalCarbohidratos > 0 || totalGrasas > 0;

  const chartWrapper = document.querySelector('.chart-wrapper');
  const emptyMsg     = document.getElementById('chartEmpty');

  chartWrapper.style.display = hasData ? 'block' : 'none';
  emptyMsg.hidden             = hasData;

  if (macroChart) {
    macroChart.data.datasets[0].data = [totalProteinas, totalCarbohidratos, totalGrasas];
    macroChart.update();
  }
}

// ── Render de UI ──────────────────────────────────────────────────────────────

/**
 * Formatea un número a máximo 1 decimal, eliminando el .0 si es entero.
 * @param {number} n
 * @returns {string}
 */
function fmt(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/**
 * Actualiza los contadores de totales en el DOM.
 * @param {{ totalCalorias: number, totalProteinas: number, totalCarbohidratos: number, totalGrasas: number }} totals
 */
function renderTotals(totals) {
  document.getElementById('totalCalorias').textContent      = fmt(totals.totalCalorias);
  document.getElementById('totalProteinas').textContent     = fmt(totals.totalProteinas);
  document.getElementById('totalCarbohidratos').textContent = fmt(totals.totalCarbohidratos);
  document.getElementById('totalGrasas').textContent        = fmt(totals.totalGrasas);
}

/**
 * Renderiza la lista de alimentos registrados.
 * @param {Array<FoodItem>} items
 */
function renderFoodList(items) {
  const listEl   = document.getElementById('foodList');
  const emptyMsg = document.getElementById('emptyMsg');

  // Eliminar tarjetas previas (conservar el párrafo vacío)
  listEl.querySelectorAll('.food-item').forEach(el => el.remove());

  if (items.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;

  items.forEach(item => {
    const div = document.createElement('div');
    div.className  = 'food-item';
    div.dataset.id = item.id;

    div.innerHTML = `
      <span class="food-item-name">${escapeHTML(item.nombre)}</span>
      <span class="food-item-macros">
        <span>⚖️ ${fmt(item.gramos)} g</span>
        <span>🔥 ${fmt(item.calorias)} kcal</span>
        <span>💪 P: ${fmt(item.proteinas)} g</span>
        <span>🌾 C: ${fmt(item.carbohidratos)} g</span>
        <span>🥑 G: ${fmt(item.grasas)} g</span>
      </span>
      <button
        class="food-item-remove"
        aria-label="Eliminar ${escapeHTML(item.nombre)}"
        data-id="${item.id}"
        title="Eliminar"
      >✕</button>
    `;

    listEl.appendChild(div);
  });
}

/**
 * Escapa caracteres HTML para evitar XSS al insertar texto de usuario en el DOM.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Estado de la aplicación ───────────────────────────────────────────────────

const today = getTodayISO();
let items    = loadItems(today);

/**
 * Ciclo principal de actualización: recalcula totales, actualiza DOM y gráfico,
 * y persiste el estado en localStorage.
 */
function refresh() {
  const totals = calculateTotals(items);
  renderTotals(totals);
  renderFoodList(items);
  updateChart(totals);
  saveItems(today, items);
}

// ── Manejadores de eventos ────────────────────────────────────────────────────

/** Muestra u oculta el mensaje de error del formulario. */
function showError(msg) {
  const el = document.getElementById('formError');
  if (msg) {
    el.textContent = msg;
    el.hidden = false;
  } else {
    el.textContent = '';
    el.hidden = true;
  }
}

/** Maneja el envío del formulario. */
function handleFormSubmit(event) {
  event.preventDefault();
  showError('');

  const form = event.target;

  const data = {
    nombre:        form.nombre.value.trim(),
    gramos:        parseFloat(form.gramos.value),
    calorias:      parseFloat(form.calorias.value),
    proteinas:     parseFloat(form.proteinas.value) || 0,
    carbohidratos: parseFloat(form.carbohidratos.value) || 0,
    grasas:        parseFloat(form.grasas.value) || 0,
  };

  const { valid, error } = validateFoodInput(data);

  if (!valid) {
    showError(error);
    return;
  }

  /** @type {FoodItem} */
  const newItem = {
    id:            crypto.randomUUID(),
    nombre:        data.nombre,
    gramos:        data.gramos,
    calorias:      data.calorias,
    proteinas:     data.proteinas,
    carbohidratos: data.carbohidratos,
    grasas:        data.grasas,
  };

  items.push(newItem);
  refresh();

  // Resetear solo los campos numéricos, mantener el nombre para agilizar
  form.gramos.value        = '';
  form.calorias.value      = '';
  form.proteinas.value     = '0';
  form.carbohidratos.value = '0';
  form.grasas.value        = '0';
  form.nombre.focus();
}

/** Maneja la eliminación de un alimento desde la lista. */
function handleRemoveItem(event) {
  const btn = event.target.closest('.food-item-remove');
  if (!btn) return;

  const id = btn.dataset.id;
  items    = items.filter(item => item.id !== id);
  refresh();
}

/** Limpia todos los alimentos del día. */
function handleClearDay() {
  if (items.length === 0) return;
  if (!confirm('¿Seguro que quieres borrar todos los alimentos de hoy?')) return;
  items = [];
  refresh();
}

// ── Inicialización ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Mostrar fecha actual en el resumen
  document.getElementById('currentDate').textContent = today;

  // Inicializar gráfico de dona
  initChart();

  // Render inicial con datos de localStorage
  refresh();

  // Registrar eventos
  document.getElementById('foodForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('foodList').addEventListener('click', handleRemoveItem);
  document.getElementById('clearBtn').addEventListener('click', handleClearDay);
});

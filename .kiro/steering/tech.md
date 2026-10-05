---
inclusion: always
---
# Guía Técnica y Directrices

## Stack Tecnológico
- **Lenguaje / Entorno:** JavaScript Vanilla (ES6+) ejecutable en el navegador.
- **Marcado y Estilos:** HTML5 semántico y CSS3 nativo (sin preprocesadores ni frameworks CSS externos).
- **Visualización:** Chart.js cargado vía CDN (`https://cdn.jsdelivr.net/npm/chart.js`).
- **Persistencia:** API nativa de `localStorage` del navegador.

## Reglas Técnicas
- **Cero Dependencias de Construcción:** La aplicación debe ser una SPA liviana ejecutable abriendo directamente `index.html` en un navegador web.
- **Validación Estricta:**
  - Gramos y Calorías deben ser valores numéricos estrictamente mayores a cero (`> 0`).
  - Proteínas, Carbohidratos y Grasas deben ser valores numéricos mayores o iguales a cero (`>= 0`).
- **Gestión de Fechas:** La fecha asignada por defecto debe corresponder a la fecha actual local formateada en ISO (`YYYY-MM-DD`).
- **Seguridad:**
  - Sanitizar entradas mediante `textContent` o asignaciones seguras al insertar texto dinámico en el DOM para prevenir vulnerabilidades XSS.

## Convenciones de Código
- Usar sintaxis ES6+ (`const`, `let`, funciones flecha, desestructuración y plantillas de texto).
- Nombres de variables y funciones descriptivos y coherentes.
- Manejo de excepciones con bloques `try...catch` al interactuar con la API de `localStorage`.

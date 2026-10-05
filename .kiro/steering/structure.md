---
inclusion: always
---
# Estructura del Proyecto

## Organización de Archivos y Carpetas
calculadora-macros-comida/
├── index.html                 # Punto de entrada de la SPA
├── styles.css                 # Estilos CSS3 nativos
├── app.js                     # Lógica de aplicación (Form, Chart, Storage)
└── .kiro/                     # Configuración y contexto de Kiro IDE
├── specs/
│   └── calculadora-macros-comida/
│       ├── requirements.md # Requisitos funcionales en EARS
│       ├── design.md       # Arquitectura y trazabilidad
│       └── tasks.md        # Plan de tareas de implementación
└── steering/
├── product.md          # Visión y objetivos del producto
├── tech.md             # Directrices y convenciones técnicas
└── structure.md        # Estructura de archivos y responsabilidades
## Responsabilidades por Archivo
- `index.html`: Define la estructura semántica de la SPA (formulario de alimentos, canvas para Chart.js, resumen de totales y lista de registros).
- `styles.css`: Contiene el maquetado responsivo, paleta de colores y estilos para alertas/validaciones.
- `app.js`: Contiene la lógica de negocio, validaciones de gramos/calorías, inicialización y actualización de Chart.js y persistencia en `localStorage`.
- `.kiro/specs/`: Almacena la especificación detallada del proyecto (Spec-driven development).
- `.kiro/steering/`: Define el contexto y las reglas permanentes que regulan el comportamiento de Kiro IDE durante el ciclo de vida del desarrollo.

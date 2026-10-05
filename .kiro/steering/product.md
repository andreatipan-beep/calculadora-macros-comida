---
inclusion: always
---
# Visión del Producto

## Descripción
La **Calculadora de Macros y Calorías** (`calculadora-macros-comida`) es una aplicación web de página única (SPA) diseñada para permitir a los usuarios registrar sus alimentos diarios, visualizar instantáneamente la distribución de macronutrientes (proteínas, carbohidratos y grasas) mediante Chart.js y conservar su resumen de calorías con persistencia local en el navegador.

## Objetivos Principales
- Proporcionar una interfaz limpia, veloz y sin fricción para el registro de consumo nutricional.
- Presentar un gráfico de tipo dona actualizado dinámicamente según la ingesta de alimentos.
- Garantizar la validez de los datos de entrada (gramos y calorías estrictamente mayores a cero).
- Persistir el resumen acumulado del día utilizando `localStorage`.

## Principios de Usuario
- **Simplicidad:** Operable inmediatamente sin necesidad de registro ni autenticación.
- **Transparencia visual:** Desglose claro de totales de calorías y porcentajes de macronutrientes.
- **Fiabilidad de datos:** Rechazo claro de valores numéricos inválidos o menores/iguales a cero.

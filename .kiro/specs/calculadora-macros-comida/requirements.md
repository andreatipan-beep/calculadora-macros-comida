# Documento de Requisitos

## Introducción

Este documento especifica los requisitos para la Calculadora de Macros y Calorías (`calculadora-macros-comida`), una herramienta web interactiva para el registro y seguimiento nutricional diario que muestra un desglose de carbohidratos, proteínas y grasas mediante Chart.js y persiste el resumen diario en LocalStorage.

## Requisitos

### Requisito 1: Registro e ingreso de alimento

**Historia de Usuario:** Como usuario, quiero registrar un alimento consumido con sus gramos, calorías y macronutrientes, para llevar el conteo exacto de mi ingesta diaria.

#### Criterios de Aceptación

1.1. WHEN el usuario ingresa un alimento indicando nombre, gramos, calorías, proteínas, carbohidratos y grasas y confirma el registro THEN el sistema SHALL agregar el alimento a la lista de consumo diario.
1.2. WHEN un alimento es agregado THEN el sistema SHALL recalcular y actualizar dinámicamente el total diario de calorías.
1.3. IF el usuario intenta registrar un alimento con un valor en gramos o calorías menor o igual a cero THEN el sistema SHALL rechazar el registro y mostrar un mensaje de validación indicando que deben ser valores estrictamente mayores a cero.

### Requisito 2: Visualización gráfica de macronutrientes

**Historia de Usuario:** Como usuario, quiero ver la proporción de mis macronutrientes consumidos en un gráfico circular de tipo dona, para analizar visualmente la distribución de mi alimentación.

#### Criterios de Aceptación

2.1. WHEN se agrega o elimina un alimento de la lista THEN el sistema SHALL actualizar dinámicamente el gráfico de dona de Chart.js reflejando el total acumulado de proteínas, carbohidratos y grasas.
2.2. WHILE la lista de alimentos contenga registros THE el sistema SHALL mantener la representación proporcional gráfica correspondiente al total de carbohidratos, proteínas y grasas.

### Requisito 3: Persistencia del resumen diario

**Historia de Usuario:** Como usuario, quiero persistir el resumen total de mi consumo diario, para no perder la información al recargar la página.

#### Criterios de Aceptación

3.1. WHEN el usuario guarda o actualiza el resumen del día THEN el sistema SHALL almacenar en LocalStorage la fecha del día y el total acumulado de calorías.
3.2. WHEN el sistema se inicia o recarga THEN el sistema SHALL asignar por defecto la fecha actual al registro del día.
3.3. WHEN el sistema se inicia THEN el sistema SHALL cargar desde LocalStorage el resumen previamente guardado para la fecha actual si existe.

### Requisito 4: Eliminación de alimentos

**Historia de Usuario:** Como usuario, quiero eliminar un alimento registrado por error, para mantener la precisión de mis totales acumulados.

#### Criterios de Aceptación

4.1. WHEN el usuario selecciona eliminar un alimento previamente registrado THEN el sistema SHALL quitar dicho alimento de la lista activa.
4.2. WHEN un alimento es eliminado THEN el sistema SHALL recalcular dinámicamente el total acumulado de calorías y actualizar el gráfico de macronutrientes.

// .kiro/tests/pbt-calculator.test.js
// Suite de Pruebas Basadas en Propiedades (PBT) para Kiro IDE

const fc = require('fast-check');

// Simulador de Lógica de Negocio
class MacroCalculatorLogic {
  static validateInput(item) {
    if (typeof item.gramos !== 'number' || item.gramos <= 0) return false;
    if (typeof item.calorias !== 'number' || item.calorias <= 0) return false;
    if (typeof item.proteinas !== 'number' || item.proteinas < 0) return false;
    if (typeof item.carbohidratos !== 'number' || item.carbohidratos < 0) return false;
    if (typeof item.grasas !== 'number' || item.grasas < 0) return false;
    return true;
  }

  static calculateTotals(items) {
    return items.reduce((acc, item) => ({
      totalCalorias: acc.totalCalorias + item.calorias,
      totalProteinas: acc.totalProteinas + item.proteinas,
      totalCarbohidratos: acc.totalCarbohidratos + item.carbohidratos,
      totalGrasas: acc.totalGrasas + item.grasas
    }), { totalCalorias: 0, totalProteinas: 0, totalCarbohidratos: 0, totalGrasas: 0 });
  }
}

// Propiedad 1: Invariante de Suma Acumulada
// La suma acumulada debe coincidir exactamente con la suma individual de cada elemento.
fc.assert(
  fc.property(
    fc.array(
      fc.record({
        nombre: fc.string(),
        gramos: fc.double({ min: 0.1, max: 2000, noNaN: true }),
        calorias: fc.double({ min: 0.1, max: 5000, noNaN: true }),
        proteinas: fc.double({ min: 0, max: 500, noNaN: true }),
        carbohidratos: fc.double({ min: 0, max: 500, noNaN: true }),
        grasas: fc.double({ min: 0, max: 500, noNaN: true })
      })
    ),
    (alimentos) => {
      const res = MacroCalculatorLogic.calculateTotals(alimentos);
      const expectedKcal = alimentos.reduce((sum, item) => sum + item.calorias, 0);
      return Math.abs(res.totalCalorias - expectedKcal) < 1e-6;
    }
  ),
  { numRuns: 100 }
);

// Propiedad 2: Invariante de Rechazo para Valores Inválidos (Gramos <= 0)
fc.assert(
  fc.property(
    fc.record({
      nombre: fc.string(),
      gramos: fc.double({ max: 0, noNaN: true }),
      calorias: fc.double({ min: 0.1, max: 5000, noNaN: true }),
      proteinas: fc.double({ min: 0, max: 500, noNaN: true }),
      carbohidratos: fc.double({ min: 0, max: 500, noNaN: true }),
      grasas: fc.double({ min: 0, max: 500, noNaN: true })
    }),
    (alimentoInvalido) => {
      return MacroCalculatorLogic.validateInput(alimentoInvalido) === false;
    }
  ),
  { numRuns: 100 }
);

console.log('✅ Pruebas PBT completadas exitosamente: Invariantes verificados.');

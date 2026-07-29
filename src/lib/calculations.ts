import { PricingConfig, FenceSystemType, BOMItem } from '../types';

export interface CalculationResult {
  bom: BOMItem[];
  materialCost: number;
  materialSalePrice: number;
  laborCost: number;
  freightCost: number;
  subtotal: number;
  recommendedMarginPercent: number;
  totalPrice: number;
}

export function calculateFenceBOM(
  totalMeters: number,
  height: number,
  systems: FenceSystemType[],
  freightZone: 'Zone A' | 'Zone B' | 'Zone C',
  config: PricingConfig
): CalculationResult {
  const bom: BOMItem[] = [];
  const { inputParams, basePrices, laborRates, freightRates } = config;

  const meters = Math.max(1, totalMeters);
  const fenceHeight = Math.max(1, height);

  let totalLaborCost = 0;

  // 1. Calculate for Malla Ciclónica
  if (systems.includes('malla_ciclonica')) {
    const postSpans = Math.ceil(meters / inputParams.postDistanceMeters);
    const cornerPosts = Math.max(2, Math.ceil(meters / 40) * 2);
    const linePosts = Math.max(0, postSpans - 1);
    const totalPosts = linePosts + cornerPosts;

    const topTubeTramos = Math.ceil(meters / inputParams.topTubeLengthMeters);
    const meshRolls = Math.ceil(meters / 20); // 20m per roll
    const tieWireKg = Math.max(1, Math.ceil((meters / 100) * inputParams.tieWireKgPer100m));
    const barbedWireRolls = Math.ceil((meters * inputParams.barbedWireLinesDefault) / 300); // 300m roll
    const concreteBuckets = Math.ceil(totalPosts * inputParams.concreteBucketsPerPost);

    // Add to BOM
    bom.push({
      code: 'POST-LIN-2',
      description: `Poste de línea galvanizado 2" x ${fenceHeight + 0.80}m (Con chupón)`,
      quantity: linePosts,
      unit: 'piezas',
      unitCost: 280 * (fenceHeight / 2),
      unitPrice: 420 * (fenceHeight / 2),
      totalPrice: linePosts * 420 * (fenceHeight / 2),
      category: 'tubos',
    });

    bom.push({
      code: 'POST-ESQ-25',
      description: `Poste de esquina/arranque 2-1/2" x ${fenceHeight + 0.80}m reforzado`,
      quantity: cornerPosts,
      unit: 'piezas',
      unitCost: 390 * (fenceHeight / 2),
      unitPrice: 580 * (fenceHeight / 2),
      totalPrice: cornerPosts * 580 * (fenceHeight / 2),
      category: 'tubos',
    });

    bom.push({
      code: 'TUBO-SUP-15',
      description: 'Tubo superior galvanizado 1-5/8" (Tramo 6.00m)',
      quantity: topTubeTramos,
      unit: 'tramos',
      unitCost: 320,
      unitPrice: 480,
      totalPrice: topTubeTramos * 480,
      category: 'tubos',
    });

    bom.push({
      code: 'MALLA-CIC-10',
      description: `Malla Ciclónica Calibre 10.5 Abertura 55mm (Rollo 20m x ${fenceHeight}m)`,
      quantity: meshRolls,
      unit: 'rollos',
      unitCost: 1850 * fenceHeight,
      unitPrice: 2650 * fenceHeight,
      totalPrice: meshRolls * 2650 * fenceHeight,
      category: 'mallas',
    });

    bom.push({
      code: 'ALAMBRE-AMARRE',
      description: 'Alambre galvanizado de amarre y tensión (Kg)',
      quantity: tieWireKg,
      unit: 'kg',
      unitCost: 42,
      unitPrice: 65,
      totalPrice: tieWireKg * 65,
      category: 'alambres',
    });

    if (barbedWireRolls > 0) {
      bom.push({
        code: 'ALAMBRE-PUAS',
        description: 'Alambre de púas galvanizado alta tensión (Rollo 300m)',
        quantity: barbedWireRolls,
        unit: 'rollos',
        unitCost: 850,
        unitPrice: 1250,
        totalPrice: barbedWireRolls * 1250,
        category: 'alambres',
      });
    }

    bom.push({
      code: 'CEM-CEMENTO',
      description: 'Botes de mezcla/concreto preparado para anclaje de postes',
      quantity: concreteBuckets,
      unit: 'botes',
      unitCost: 35,
      unitPrice: 55,
      totalPrice: concreteBuckets * 55,
      category: 'cemento',
    });

    // Accessories
    const clampsCount = cornerPosts * 6 + linePosts * 2;
    bom.push({
      code: 'ACC-ABRAZ',
      description: 'Abrazaderas de tensión/arranque 2-1/2" y 2" con tornillo galvanizado',
      quantity: clampsCount,
      unit: 'piezas',
      unitCost: 18,
      unitPrice: 28,
      totalPrice: clampsCount * 28,
      category: 'accesorios',
    });

    totalLaborCost += meters * laborRates.malla_ciclonica;
  }

  // 2. Calculate for Cerca Electrificada
  if (systems.includes('cerca_electrificada')) {
    const electricPosts = Math.ceil(meters / 3.5) + 2; // Posts every 3.5m
    const insulators = electricPosts * 6; // 6 lines of electric wire
    const energizers = Math.ceil(meters / 250); // 1 energizer per 250m
    const highVoltageWireKg = Math.ceil((meters * 6) / 80); // 80m per kg

    bom.push({
      code: 'ELEC-POSTE',
      description: 'Postes templadores/intermedios para cerca electrificada de 6 hilos',
      quantity: electricPosts,
      unit: 'piezas',
      unitCost: 160,
      unitPrice: 240,
      totalPrice: electricPosts * 240,
      category: 'electrificacion',
    });

    bom.push({
      code: 'ELEC-AISL',
      description: 'Aisladores de paso y esquina reforzados con protección UV',
      quantity: insulators,
      unit: 'piezas',
      unitCost: 12,
      unitPrice: 22,
      totalPrice: insulators * 22,
      category: 'electrificacion',
    });

    bom.push({
      code: 'ELEC-ENER',
      description: 'Energizador Inteligente 12,000V con Batería de respaldo y Sirena 120dB',
      quantity: energizers,
      unit: 'sistemas',
      unitCost: 2800,
      unitPrice: 4200,
      totalPrice: energizers * 4200,
      category: 'electrificacion',
    });

    bom.push({
      code: 'ELEC-ALAMBRE',
      description: 'Alambre de acero inoxidable / galvanizado alto carbono (Kg)',
      quantity: highVoltageWireKg,
      unit: 'kg',
      unitCost: 75,
      unitPrice: 115,
      totalPrice: highVoltageWireKg * 115,
      category: 'alambres',
    });

    totalLaborCost += meters * laborRates.cerca_electrificada;
  }

  // 3. Calculate for Concertina
  if (systems.includes('concertina')) {
    const concertinaRolls = Math.ceil(meters / 8); // 8 meters per roll of 45cm cruzada
    const supportWireKg = Math.ceil(meters / 30);

    bom.push({
      code: 'CONC-CRUZ-45',
      description: 'Concertina Cruzada Galvanizada Bisturí Ø 45cm (Rollo 8m rendidores)',
      quantity: concertinaRolls,
      unit: 'rollos',
      unitCost: 410,
      unitPrice: 620,
      totalPrice: concertinaRolls * 620,
      category: 'mallas',
    });

    bom.push({
      code: 'CONC-GUIA',
      description: 'Guía de alambre galvanizado de alta tensión para suspensión de concertina',
      quantity: supportWireKg,
      unit: 'kg',
      unitCost: 45,
      unitPrice: 70,
      totalPrice: supportWireKg * 70,
      category: 'alambres',
    });

    totalLaborCost += meters * laborRates.concertina;
  }

  // 4. Calculate for Reja de Acero (Euroreja)
  if (systems.includes('reja_acero')) {
    const panels = Math.ceil(meters / 2.5); // 2.5m per panel
    const rejaPosts = panels + 1;
    const rejaClamps = panels * 4;

    bom.push({
      code: 'REJA-PANEL-2',
      description: `Panel Reja de Acero Plastificada Verde/Blanca (2.50m x ${fenceHeight}m)`,
      quantity: panels,
      unit: 'paneles',
      unitCost: 1100 * fenceHeight,
      unitPrice: 1650 * fenceHeight,
      totalPrice: panels * 1650 * fenceHeight,
      category: 'mallas',
    });

    bom.push({
      code: 'REJA-POSTE',
      description: `Poste cuadrado 60x60mm para Reja de Acero con Tapa (Alto ${fenceHeight + 0.60}m)`,
      quantity: rejaPosts,
      unit: 'piezas',
      unitCost: 340 * fenceHeight,
      unitPrice: 510 * fenceHeight,
      totalPrice: rejaPosts * 510 * fenceHeight,
      category: 'tubos',
    });

    bom.push({
      code: 'REJA-ABRAZ',
      description: 'Abrazaderas metálicas térmicas con perno de seguridad para Reja',
      quantity: rejaClamps,
      unit: 'piezas',
      unitCost: 25,
      unitPrice: 40,
      totalPrice: rejaClamps * 40,
      category: 'accesorios',
    });

    bom.push({
      code: 'REJA-CEM',
      description: 'Concreto en saco / botes para cimentación de postes Reja',
      quantity: rejaPosts * 2,
      unit: 'botes',
      unitCost: 35,
      unitPrice: 55,
      totalPrice: rejaPosts * 2 * 55,
      category: 'cemento',
    });

    totalLaborCost += meters * laborRates.reja_acero;
  }

  // 5. Calculate for Cinta de Privacidad
  if (systems.includes('cinta_privacidad')) {
    const tapeRolls = Math.ceil((meters * fenceHeight) / 8); // Each roll covers ~8 m²
    const tapeFasteners = tapeRolls * 50;

    bom.push({
      code: 'CINTA-PRIV',
      description: 'Cinta de privacidad plástica con protección UV (Rollo para ~8m²)',
      quantity: tapeRolls,
      unit: 'rollos',
      unitCost: 320,
      unitPrice: 490,
      totalPrice: tapeRolls * 490,
      category: 'mallas',
    });

    bom.push({
      code: 'CINTA-BROCHE',
      description: 'Broches plásticos de sujeción rápida para cinta de privacidad',
      quantity: tapeFasteners,
      unit: 'piezas',
      unitCost: 1.5,
      unitPrice: 3,
      totalPrice: tapeFasteners * 3,
      category: 'accesorios',
    });

    totalLaborCost += meters * laborRates.cinta_privacidad;
  }

  // Compute Freight
  let freightCost = freightRates.zoneAFlat;
  if (freightZone === 'Zone B') freightCost = freightRates.zoneBFlat;
  if (freightZone === 'Zone C') freightCost = freightRates.zoneCFlat;

  // Summaries
  let materialCostSum = 0;
  let materialSalePriceSum = 0;

  bom.forEach((item) => {
    materialCostSum += item.quantity * item.unitCost;
    materialSalePriceSum += item.totalPrice;
  });

  const subtotal = materialSalePriceSum + totalLaborCost + freightCost;

  return {
    bom,
    materialCost: Math.round(materialCostSum),
    materialSalePrice: Math.round(materialSalePriceSum),
    laborCost: Math.round(totalLaborCost),
    freightCost: Math.round(freightCost),
    subtotal: Math.round(subtotal),
    recommendedMarginPercent: 35,
    totalPrice: Math.round(subtotal),
  };
}

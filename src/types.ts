export interface Cabinet {
  id: string;
  name: string;
  description: string;
  category: 'electricite' | 'eau' | 'gasoil';
  startIndex: number;
  endIndex: number;
  consumption: number; // calculated as (endIndex - startIndex) * multiplier
  multiplier: number;
  unit: string;
  status: 'Vert' | 'Orange' | 'Rouge';
  criticality: 'Faible' | 'Moyennne' | 'Critique';
  area: string;
}

export interface ProductMetrics {
  id: string;
  name: string;
  lotsPerMonth: number;
  directConsoKwh: number; // per lot standard
  directCostTnd: number; // direct energetic cost
  indirectProratedTnd: number;
  totalCostTnd: number;
  costPer1000Units: number;
}

export interface SimulationParams {
  outsideTemp: number; // 15 to 45 °C
  indirectPct: number; // 10% to 40%
  productLots: { [productId: string]: number };
}

export interface SimulationResults {
  predictedTotalCost: number;
  predictedTotalCO2: number;
  costDiffPercent: number; // simulation vs baseline
  co2DiffPercent: number;
  savingEstimatedTnd: number;
}

export interface UtilityTariffs {
  stegElectricity: number; // TND/kWh (ex: 0.28)
  sonedeWater: number; // TND/m3 (ex: 2.1)
  gasoilLiter: number; // TND/liter (ex: 2.2)
  co2Electricity: number; // kg CO2/kWh from ANME (ex: 0.52)
  co2Gasoil: number; // kg CO2/Liter (ex: 2.68)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  pendingAction?: {
    name: string;
    args: any;
  } | null;
}

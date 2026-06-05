import { Cabinet, ProductMetrics, UtilityTariffs } from './types';

export const DEFAULT_TARIFFS: UtilityTariffs = {
  stegElectricity: 0.285, // TND par kWh
  sonedeWater: 2.250,      // TND par m3
  gasoilLiter: 2.120,      // TND par Litre
  co2Electricity: 0.52,   // kg CO2 par kWh
  co2Gasoil: 2.68,        // kg CO2 par Litre
};

export const INITIAL_CABINETS: Cabinet[] = [
  {
    id: 'CAB-01',
    name: 'Armoire 01 - TGBT Principal',
    description: 'Poste de livraison STEG et distribution d\'entrée générale',
    category: 'electricite',
    startIndex: 120500,
    endIndex: 124800,
    consumption: 0, // dynamic
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Poste HT'
  },
  {
    id: 'CAB-02',
    name: 'Armoire 02 - HVAC Zones Classées A/B',
    description: 'Centrales d\'air pour la production de formes stériles injectables',
    category: 'electricite',
    startIndex: 84320,
    endIndex: 86950,
    consumption: 0,
    multiplier: 15,
    unit: 'kWh',
    status: 'Rouge',
    criticality: 'Critique',
    area: 'HVAC Stérile'
  },
  {
    id: 'CAB-03',
    name: 'Armoire 03 - HVAC Zones C/D & Cond.',
    description: 'Ventilation et traitement thermique pesée et conditionnement primaire',
    category: 'electricite',
    startIndex: 45100,
    endIndex: 47200,
    consumption: 0,
    multiplier: 12,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'HVAC Classique'
  },
  {
    id: 'CAB-04',
    name: 'Armoire 04 - Groupes Eau Glacée Process',
    description: 'Refroidissement des cuves double enveloppe et CTA',
    category: 'electricite',
    startIndex: 91400,
    endIndex: 94150,
    consumption: 0,
    multiplier: 20,
    unit: 'kWh',
    status: 'Orange',
    criticality: 'Critique',
    area: 'Centrale Froid'
  },
  {
    id: 'CAB-05',
    name: 'Armoire 05 - Centrales Froid Stockage Labo',
    description: 'Chambres froides de conservation matières premières et vaccins',
    category: 'electricite',
    startIndex: 32200,
    endIndex: 32890,
    consumption: 0,
    multiplier: 8,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Magasin / Contrôle'
  },
  {
    id: 'CAB-06',
    name: 'Armoire 06 - Ligne Solutés Stériles',
    description: 'Surchauffeurs, autoclaves de stérilisation finale et mirage',
    category: 'electricite',
    startIndex: 18450,
    endIndex: 19800,
    consumption: 0,
    multiplier: 15,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Prod Stérile'
  },
  {
    id: 'CAB-07',
    name: 'Armoire 07 - Compresseurs Air & Vide',
    description: 'Génération d\'air comprimé de process exempt d\'huile et sécheurs',
    category: 'electricite',
    startIndex: 29800,
    endIndex: 31150,
    consumption: 0,
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Fluides'
  },
  {
    id: 'CAB-08',
    name: 'Armoire 08 - Ligne Crèmes & Pommades',
    description: 'Mélangeurs sous vide, agitateurs de turbines et doteuses',
    category: 'electricite',
    startIndex: 11450,
    endIndex: 12550,
    consumption: 0,
    multiplier: 5,
    unit: 'kWh',
    status: 'Orange',
    criticality: 'Moyennne',
    area: 'Prod Liquides'
  },
  {
    id: 'CAB-09',
    name: 'Armoire 09 - Ligne Sirops & Liquides',
    description: 'Préparateurs, pompes volumétriques et visseuses-étiqueteuses sirops',
    category: 'electricite',
    startIndex: 22100,
    endIndex: 23450,
    consumption: 0,
    multiplier: 6,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Prod Sirops'
  },
  {
    id: 'CAB-10',
    name: 'Armoire 10 - Ligne Granulation Formes Sèches',
    description: 'Séchoir lit d\'air fluidisé, mélangeur biconique et comprimatrices',
    category: 'electricite',
    startIndex: 54900,
    endIndex: 56650,
    consumption: 0,
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Prod Solides'
  },
  {
    id: 'CAB-11',
    name: 'Armoire 11 - Thermoformeuses & Blisters',
    description: 'Chauffage opercules PVC/Alu, scellage rotatif et découpe blisters',
    category: 'electricite',
    startIndex: 38200,
    endIndex: 39980,
    consumption: 0,
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Conditionnement'
  },
  {
    id: 'CAB-12',
    name: 'Armoire 12 - Conditionnement Secondaire',
    description: 'Encartonneuses automatiques, étuyeuses et convoyeurs finaux',
    category: 'electricite',
    startIndex: 15400,
    endIndex: 16500,
    consumption: 0,
    multiplier: 4,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Faible',
    area: 'Conditionnement'
  },
  {
    id: 'CAB-13',
    name: 'Armoire 13 - Boucle Eau Purifiée (EP)',
    description: 'Pompes de circulation boucle d\'eau, ozoneur et lampes UV',
    category: 'electricite',
    startIndex: 41200,
    endIndex: 43100,
    consumption: 0,
    multiplier: 8,
    unit: 'kWh',
    status: 'Orange',
    criticality: 'Critique',
    area: 'Eau Process'
  },
  {
    id: 'CAB-14',
    name: 'Armoire 14 - Station Épuration Rejets (EPUR)',
    description: 'Traitement des rejets aqueux chimiques et neutralisation du pH',
    category: 'eau', // represented as SONEDE water loop for safety
    startIndex: 5800,
    endIndex: 6920,
    consumption: 0,
    multiplier: 1, // m³ water
    unit: 'm³',
    status: 'Vert',
    criticality: 'Faible',
    area: 'Environnement'
  },
  {
    id: 'CAB-15',
    name: 'Armoire 15 - Chaudière d\'Alimentation Vapeur',
    description: 'Chaufferie principale pour alimentation des ballons et autoclaves',
    category: 'gasoil',
    startIndex: 18900,
    endIndex: 21850,
    consumption: 0,
    multiplier: 1.5, // units in liters of fuel
    unit: 'Litres',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Fluides / Thermique'
  }
];

export const INITIAL_PRODUCTS: ProductMetrics[] = [
  {
    id: 'p-para',
    name: 'Paracétamol (Comprimés)',
    lotsPerMonth: 120,
    directConsoKwh: 140, // direct electrical consumption in kWh/lot
    directCostTnd: 0, // dynamic
    indirectProratedTnd: 0, // dynamic
    totalCostTnd: 0,
    costPer1000Units: 2.15 // base direct process expense per 1k boxes
  },
  {
    id: 'p-sirop',
    name: 'Sirop Contre la Toux',
    lotsPerMonth: 80,
    directConsoKwh: 210,
    directCostTnd: 0,
    indirectProratedTnd: 0,
    totalCostTnd: 0,
    costPer1000Units: 4.80
  },
  {
    id: 'p-amox',
    name: 'Amoxicilline (Gélules)',
    lotsPerMonth: 95,
    directConsoKwh: 320,
    directCostTnd: 0,
    indirectProratedTnd: 0,
    totalCostTnd: 0,
    costPer1000Units: 6.90
  },
  {
    id: 'p-pommade',
    name: 'Pommade Cutanée',
    lotsPerMonth: 60,
    directConsoKwh: 180,
    directCostTnd: 0,
    indirectProratedTnd: 0,
    totalCostTnd: 0,
    costPer1000Units: 3.45
  },
  {
    id: 'p-blister',
    name: 'Conditionnement Blister (PVC/Alu)',
    lotsPerMonth: 150,
    directConsoKwh: 92,
    directCostTnd: 0,
    indirectProratedTnd: 0,
    totalCostTnd: 0,
    costPer1000Units: 1.12
  }
];

// Mock monthly tracking for temperature vs consumption over previous 30 days
export const TEMPERATURE_ENERGY_HISTORY = [
  { day: 'Jour 1', temp: 18, baseConso: 42000, currentConso: 41800, co2: 21.7 },
  { day: 'Jour 2', temp: 19, baseConso: 42500, currentConso: 42300, co2: 22.0 },
  { day: 'Jour 3', temp: 21, baseConso: 43600, currentConso: 43100, co2: 22.4 },
  { day: 'Jour 4', temp: 22, baseConso: 44000, currentConso: 43500, co2: 22.6 },
  { day: 'Jour 5', temp: 24, baseConso: 45800, currentConso: 44900, co2: 23.3 },
  { day: 'Jour 6', temp: 26, baseConso: 47200, currentConso: 46200, co2: 24.0 },
  { day: 'Jour 7', temp: 28, baseConso: 49500, currentConso: 48500, co2: 25.2 },
  { day: 'Jour 8', temp: 29, baseConso: 51000, currentConso: 49800, co2: 25.9 },
  { day: 'Jour 9', temp: 31, baseConso: 53200, currentConso: 51400, co2: 26.7 },
  { day: 'Jour 10', temp: 32, baseConso: 55000, currentConso: 53100, co2: 27.6 },
  { day: 'Jour 11', temp: 30, baseConso: 52400, currentConso: 51100, co2: 26.6 },
  { day: 'Jour 12', temp: 27, baseConso: 48900, currentConso: 47800, co2: 24.9 },
  { day: 'Jour 13', temp: 25, baseConso: 46500, currentConso: 45400, co2: 23.6 },
  { day: 'Jour 14', temp: 24, baseConso: 45100, currentConso: 44200, co2: 23.0 },
  { day: 'Jour 15', temp: 26, baseConso: 47000, currentConso: 46300, co2: 24.1 },
  { day: 'Jour 16', temp: 28, baseConso: 49800, currentConso: 48900, co2: 25.4 },
  { day: 'Jour 17', temp: 30, baseConso: 52100, currentConso: 50800, co2: 26.4 },
  { day: 'Jour 18', temp: 33, baseConso: 56900, currentConso: 55100, co2: 28.7 },
  { day: 'Jour 19', temp: 35, baseConso: 61000, currentConso: 58900, co2: 30.6 },
  { day: 'Jour 20', temp: 37, baseConso: 64800, currentConso: 61950, co2: 32.2 },
  { day: 'Jour 21', temp: 38, baseConso: 66500, currentConso: 63200, co2: 32.9 },
  { day: 'Jour 22', temp: 39, baseConso: 68900, currentConso: 64900, co2: 33.7 },
  { day: 'Jour 23', temp: 41, baseConso: 74200, currentConso: 68900, co2: 35.8 }, // peak heatwave!
  { day: 'Jour 24', temp: 42, baseConso: 76500, currentConso: 71100, co2: 37.0 }, // canicule Tunis
  { day: 'Jour 25', temp: 40, baseConso: 71000, currentConso: 66800, co2: 34.7 },
  { day: 'Jour 26', temp: 36, baseConso: 62200, currentConso: 59700, co2: 31.0 },
  { day: 'Jour 27', temp: 33, baseConso: 56000, currentConso: 54100, co2: 28.1 },
  { day: 'Jour 28', temp: 29, baseConso: 51200, currentConso: 49950, co2: 26.0 },
  { day: 'Jour 29', temp: 26, baseConso: 47400, currentConso: 46200, co2: 24.0 },
  { day: 'Jour 30', temp: 23, baseConso: 44200, currentConso: 43300, co2: 22.5 },
];

export const MOCK_RELEVEE_HISTORY = {
  electricite: [
    { name: "Relevé Mai 2026", cost: 124500, co2: 226.7, date: "2026-05-31" },
    { name: "Relevé Avril 2026", cost: 118400, co2: 215.3, date: "2026-04-30" },
    { name: "Relevé Mars 2026", cost: 104200, co2: 189.5, date: "2026-03-31" }
  ],
  eau: [
    { name: "Relevé Mai 2026", cost: 2520, co2: 0, date: "2026-05-31" },
    { name: "Relevé Avril 2026", cost: 2340, co2: 0, date: "2026-04-30" },
    { name: "Relevé Mars 2026", cost: 2100, co2: 0, date: "2026-03-31" }
  ],
  gasoil: [
    { name: "Relevé Mai 2026", cost: 9240, co2: 11.7, date: "2026-05-31" },
    { name: "Relevé Avril 2026", cost: 8900, co2: 11.2, date: "2026-04-30" },
    { name: "Relevé Mars 2026", cost: 8540, co2: 10.8, date: "2026-03-31" }
  ]
};

export const MONTHLY_ENERGY_COMPARISON_HISTORY = [
  { month: 'Jan', currentYear: 42000, previousYear: 45000, saving: 3000 },
  { month: 'Fév', currentYear: 41000, previousYear: 43500, saving: 2500 },
  { month: 'Mar', currentYear: 44500, previousYear: 46000, saving: 1500 },
  { month: 'Avr', currentYear: 46000, previousYear: 49000, saving: 3000 },
  { month: 'Mai', currentYear: 51200, previousYear: 55000, saving: 3800 },
  { month: 'Juin', currentYear: 62500, previousYear: 68000, saving: 5500 },
  { month: 'Juil', currentYear: 78000, previousYear: 84000, saving: 6000 },
  { month: 'Août', currentYear: 81400, previousYear: 89000, saving: 7600 },
  { month: 'Sept', currentYear: 69000, previousYear: 75000, saving: 6000 },
  { month: 'Oct', currentYear: 54000, previousYear: 58000, saving: 4000 },
  { month: 'Nov', currentYear: 46000, previousYear: 49500, saving: 3500 },
  { month: 'Déc', currentYear: 43000, previousYear: 47000, saving: 4000 },
];


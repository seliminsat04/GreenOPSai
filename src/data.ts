import { Cabinet, ProductMetrics, UtilityTariffs } from './types';

export const DEFAULT_TARIFFS: UtilityTariffs = {
  stegElectricity: 0.285, // TND par kWh
  bruteWater: 1.500,      // TND par m3
  purifiedWater: 8.500,   // TND par m3
  gasoilLiter: 2.120,      // TND par Litre
  co2Electricity: 0.52,   // kg CO2 par kWh
  co2Gasoil: 2.68,        // kg CO2 par Litre
  solarProductionKwh: 12500, // Prod solaire par mois
};

export const INITIAL_CABINETS: Cabinet[] = [
  {
    id: 'CAB-01',
    name: 'Armoire 01 - TGBT Principal',
    description: 'Poste de livraison STEG et distribution d\'entrée générale',
    category: 'electricite',
    startIndex: 120500,
    endIndex: 124800,
    consumption: 436125, // dynamic
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Poste HT',
    equipments: [
        {
            "id": "eq-tzj8n0jb4",
            "name": "Transformateur N°1",
            "maxAmpere": 1250,
            "consumption": 90977.3
        },
        {
            "id": "eq-hqhqrt4vb",
            "name": "Transformateur N°2",
            "maxAmpere": 1250,
            "consumption": 0
        },
        {
            "id": "eq-xn4468qlc",
            "name": "Transformateur N°3",
            "maxAmpere": 1250,
            "consumption": 89162.3
        },
        {
            "id": "eq-l39v20q25",
            "name": "Groupe Frigorifique OMOMIX",
            "maxAmpere": 80,
            "consumption": 1247.3
        },
        {
            "id": "eq-i3l1u2xmj",
            "name": "Armoire pompes evacuation eau de pluie",
            "maxAmpere": 50,
            "consumption": 0
        },
        {
            "id": "eq-ymhllt9s7",
            "name": "Climatiseur local buanderie",
            "maxAmpere": 25,
            "consumption": 0
        },
        {
            "id": "eq-jolw6v5ea",
            "name": "Climatiseur local PDR",
            "maxAmpere": 32,
            "consumption": 66.2
        },
        {
            "id": "eq-xig6ezxsc",
            "name": "Local Atelier informatique",
            "maxAmpere": 40,
            "consumption": 357.8
        },
        {
            "id": "eq-nhje3lk9q",
            "name": "Alimenation chaudière",
            "maxAmpere": 50,
            "consumption": 137.8
        },
        {
            "id": "eq-f5tr9zcw2",
            "name": "Local buanderie prod",
            "maxAmpere": 50,
            "consumption": 798.1
        },
        {
            "id": "eq-237r3gg4r",
            "name": "Parafoudre",
            "maxAmpere": 40,
            "consumption": 0
        },
        {
            "id": "eq-mvvo1lg6z",
            "name": "Monte charge",
            "maxAmpere": 125,
            "consumption": 273.4
        },
        {
            "id": "eq-341fbethd",
            "name": "Armoire Bloc D2 Normal",
            "maxAmpere": 250,
            "consumption": 2098.6
        },
        {
            "id": "eq-i6zmgivdk",
            "name": "Compresseur FIAC",
            "maxAmpere": 630,
            "consumption": 64.1
        },
        {
            "id": "eq-szzhw6ity",
            "name": "Groupe frigorifique N°8",
            "maxAmpere": 630,
            "consumption": 36990.6
        },
        {
            "id": "eq-qcvt78fru",
            "name": "Groupe frigorifique N°4",
            "maxAmpere": 630,
            "consumption": 71.9
        },
        {
            "id": "eq-zicxx707z",
            "name": "Groupe frigorifique N°6",
            "maxAmpere": 630,
            "consumption": 20744.6
        },
        {
            "id": "eq-xojic6roe",
            "name": "Groupe frigorifique N°7",
            "maxAmpere": 630,
            "consumption": 420
        },
        {
            "id": "eq-lu71ie5xq",
            "name": "Groupe frigorifique N°9",
            "maxAmpere": 1000,
            "consumption": 36316.9
        },
        {
            "id": "eq-6inuvtklb",
            "name": "Alimentation secours",
            "maxAmpere": 1600,
            "consumption": 156282.2
        },
        {
            "id": "eq-r8q7g60bp",
            "name": "Batterie Condensateur",
            "maxAmpere": 800,
            "consumption": 115.9
        }
    ]
  },
  {
    id: 'CAB-02',
    name: 'Armoire 02 - HVAC Zones Classées A/B',
    description: 'Centrales d\'air pour la production de formes stériles injectables',
    category: 'electricite',
    startIndex: 84320,
    endIndex: 86950,
    consumption: 149755,
    multiplier: 15,
    unit: 'kWh',
    status: 'Rouge',
    criticality: 'Critique',
    area: 'HVAC Stérile',
    equipments: [
        {
            "id": "eq-imlxqdp4b",
            "name": "Local buanderie",
            "maxAmpere": 50,
            "consumption": 32
        },
        {
            "id": "eq-lnbaim0ir",
            "name": "Asservissement",
            "maxAmpere": 32,
            "consumption": 12.4
        },
        {
            "id": "eq-kot8tox7g",
            "name": "local CTEU 1",
            "maxAmpere": 50,
            "consumption": 1930.5
        },
        {
            "id": "eq-a19lc122r",
            "name": "Alimentation ascenseurs",
            "maxAmpere": 50,
            "consumption": 34.1
        },
        {
            "id": "eq-y7pmgibum",
            "name": "local CTEU 2",
            "maxAmpere": 32,
            "consumption": 310.1
        },
        {
            "id": "eq-xaste1k5v",
            "name": "Normal LCQ et ADMINISTRATION",
            "maxAmpere": 80,
            "consumption": 1463.8
        },
        {
            "id": "eq-xb8jjrze8",
            "name": "Magasin MP/AC et PF",
            "maxAmpere": 125,
            "consumption": 10264.3
        },
        {
            "id": "eq-2ii8b5dj1",
            "name": "Station d'épuration",
            "maxAmpere": 125,
            "consumption": 1603.7
        },
        {
            "id": "eq-0mtejoqpu",
            "name": "Onduleur LCQ",
            "maxAmpere": 160,
            "consumption": 1511.9
        },
        {
            "id": "eq-t8jmi7l6t",
            "name": "Ondueleur DEV",
            "maxAmpere": 160,
            "consumption": 1486.8
        },
        {
            "id": "eq-snpcgz86z",
            "name": "Local transformateur",
            "maxAmpere": 40,
            "consumption": 434.6
        },
        {
            "id": "eq-fmoqz9xjw",
            "name": "Local Serveur",
            "maxAmpere": 160,
            "consumption": 3453.7
        },
        {
            "id": "eq-23aklb1l0",
            "name": "Traitement d'air Bloc D2",
            "maxAmpere": 250,
            "consumption": 21776.4
        },
        {
            "id": "eq-1qfp5er5v",
            "name": "Bloc D2",
            "maxAmpere": 250,
            "consumption": 2885.1
        },
        {
            "id": "eq-acpogpqk9",
            "name": "local technique",
            "maxAmpere": 40,
            "consumption": 1553.1
        },
        {
            "id": "eq-xb2j8wk0c",
            "name": "Groupe éléctrogène",
            "maxAmpere": 16,
            "consumption": 727.8
        },
        {
            "id": "eq-yhyjvc36r",
            "name": "Local TGBT",
            "maxAmpere": 10,
            "consumption": 53.9
        },
        {
            "id": "eq-53i5hc3gn",
            "name": "Surpresseur incendie",
            "maxAmpere": 50,
            "consumption": 15.3
        },
        {
            "id": "eq-xm3iol5bo",
            "name": "local CTEU 3",
            "maxAmpere": 125,
            "consumption": 3825.3
        },
        {
            "id": "eq-yq6ho7b6r",
            "name": "Administration",
            "maxAmpere": 80,
            "consumption": 5436.3
        },
        {
            "id": "eq-k1q6aca0a",
            "name": "Poste gardien N°2",
            "maxAmpere": 40,
            "consumption": 0
        },
        {
            "id": "eq-my1y1d7bk",
            "name": "Ligne air comprimé",
            "maxAmpere": 200,
            "consumption": 18984.8
        },
        {
            "id": "eq-4sangmtb8",
            "name": "Local devloppement",
            "maxAmpere": 80,
            "consumption": 4087.7
        },
        {
            "id": "eq-0nlxex4db",
            "name": "Traitement d'air Opalia",
            "maxAmpere": 630,
            "consumption": 52766.3
        },
        {
            "id": "eq-awsj8mwjp",
            "name": "Production",
            "maxAmpere": 800,
            "consumption": 15104.8
        }
    ]
  },
  {
    id: 'CAB-03',
    name: 'Armoire 03 - HVAC Zones C/D & Cond.',
    description: 'Ventilation et traitement thermique pesée et conditionnement primaire',
    category: 'electricite',
    startIndex: 45100,
    endIndex: 47200,
    consumption: 12131,
    multiplier: 12,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'HVAC Classique',
    equipments: [
        {
            "id": "eq-oqsbva1ov",
            "name": "Bloc C",
            "maxAmpere": 160,
            "consumption": 2326.7
        },
        {
            "id": "eq-9z6gy9jal",
            "name": "Bloc B",
            "maxAmpere": 100,
            "consumption": 550.7
        },
        {
            "id": "eq-nej07ixub",
            "name": "Bloc A",
            "maxAmpere": 250,
            "consumption": 1163
        },
        {
            "id": "eq-3muxobhgg",
            "name": "Bloc D1",
            "maxAmpere": 160,
            "consumption": 1833.2
        },
        {
            "id": "eq-w5ghk698d",
            "name": "Production",
            "maxAmpere": 160,
            "consumption": 2022.7
        },
        {
            "id": "eq-pk3gscvrg",
            "name": "Local comercial",
            "maxAmpere": 160,
            "consumption": 1182.2
        },
        {
            "id": "eq-d2od7nifz",
            "name": "Production+ Bloc H",
            "maxAmpere": 160,
            "consumption": 1268.5
        },
        {
            "id": "eq-mf7c06dx2",
            "name": "omomix",
            "maxAmpere": 160,
            "consumption": 1538.2
        },
        {
            "id": "eq-boxllpsue",
            "name": "Karcher bloc H",
            "maxAmpere": 80,
            "consumption": 245.4
        }
    ]
  },
  {
    id: 'CAB-04',
    name: 'Armoire 04 - Groupes Eau Glacée Process',
    description: 'Refroidissement des cuves double enveloppe et CTA',
    category: 'electricite',
    startIndex: 91400,
    endIndex: 94150,
    consumption: 172,
    multiplier: 20,
    unit: 'kWh',
    status: 'Orange',
    criticality: 'Critique',
    area: 'Centrale Froid',
    equipments: [
        {
            "id": "eq-hv6swoe1a",
            "name": "F57 NEW",
            "maxAmpere": 63,
            "consumption": 95.7
        },
        {
            "id": "eq-pxjvprjkm",
            "name": "Tirelli",
            "maxAmpere": 63,
            "consumption": 76.3
        }
    ]
  },
  {
    id: 'CAB-05',
    name: 'Armoire 05 - Centrales Froid Stockage Labo',
    description: 'Chambres froides de conservation matières premières et vaccins',
    category: 'electricite',
    startIndex: 32200,
    endIndex: 32890,
    consumption: 87,
    multiplier: 8,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Magasin / Contrôle',
    equipments: [
        {
            "id": "eq-29mqowgda",
            "name": "Comadis",
            "maxAmpere": 63,
            "consumption": 86.9
        }
    ]
  },
  {
    id: 'CAB-06',
    name: 'Armoire 06 - Ligne Solutés Stériles',
    description: 'Surchauffeurs, autoclaves de stérilisation finale et mirage',
    category: 'electricite',
    startIndex: 18450,
    endIndex: 19800,
    consumption: 3443,
    multiplier: 15,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Prod Stérile',
    equipments: [
        {
            "id": "eq-nye7se96q",
            "name": "BLOC B",
            "maxAmpere": 63,
            "consumption": 752.3
        },
        {
            "id": "eq-xj995bgum",
            "name": "BLOC C",
            "maxAmpere": 63,
            "consumption": 1588.5
        },
        {
            "id": "eq-zkg37k5lz",
            "name": "BLOC H",
            "maxAmpere": 40,
            "consumption": 563.4
        },
        {
            "id": "eq-1bdoh80sv",
            "name": "LCM",
            "maxAmpere": 40,
            "consumption": 538.8
        }
    ]
  },
  {
    id: 'CAB-07',
    name: 'Armoire 07 - Compresseurs Air & Vide',
    description: 'Génération d\'air comprimé de process exempt d\'huile et sécheurs',
    category: 'electricite',
    startIndex: 29800,
    endIndex: 31150,
    consumption: 45432,
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Fluides',
    equipments: [
        {
            "id": "eq-w4un0k4t6",
            "name": "UTA 2, UTA 3, UTA 8, UTA 11 et éclairage étage technique",
            "maxAmpere": 160,
            "consumption": 5996.8
        },
        {
            "id": "eq-j0tap0tqc",
            "name": "surpresseur et pompes collecteur d'eau",
            "maxAmpere": 160,
            "consumption": 18681.2
        },
        {
            "id": "eq-9uhymnwft",
            "name": "UTA 4, UTA 6, REC 2 et CVM",
            "maxAmpere": 250,
            "consumption": 7812
        },
        {
            "id": "eq-r88bjr0g1",
            "name": "REC 1, UTA 1, UTA 7, UTA 10, éclairage prod et CVM",
            "maxAmpere": 250,
            "consumption": 12942.3
        }
    ]
  },
  {
    id: 'CAB-08',
    name: 'Armoire 08 - Ligne Crèmes & Pommades',
    description: 'Mélangeurs sous vide, agitateurs de turbines et doteuses',
    category: 'electricite',
    startIndex: 11450,
    endIndex: 12550,
    consumption: 1003,
    multiplier: 5,
    unit: 'kWh',
    status: 'Orange',
    criticality: 'Moyennne',
    area: 'Prod Liquides',
    equipments: [
        {
            "id": "eq-3dfu83o8j",
            "name": "Blistereuse Marchesini",
            "maxAmpere": 63,
            "consumption": 70.5
        },
        {
            "id": "eq-knydba4sc",
            "name": "Cyclops",
            "maxAmpere": 63,
            "consumption": 102.6
        },
        {
            "id": "eq-ldgaquggh",
            "name": "Granulateur",
            "maxAmpere": 63,
            "consumption": 93.7
        },
        {
            "id": "eq-6zajk9qsr",
            "name": "Guibli 50",
            "maxAmpere": 63,
            "consumption": 394.3
        },
        {
            "id": "eq-vlcoyezxc",
            "name": "Hulmann",
            "maxAmpere": 63,
            "consumption": 341.7
        }
    ]
  },
  {
    id: 'CAB-09',
    name: 'Armoire 09 - Ligne Sirops & Liquides',
    description: 'Préparateurs, pompes volumétriques et visseuses-étiqueteuses sirops',
    category: 'electricite',
    startIndex: 22100,
    endIndex: 23450,
    consumption: 1021,
    multiplier: 6,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Prod Sirops',
    equipments: [
        {
            "id": "eq-k8wm4x766",
            "name": "GS",
            "maxAmpere": 63,
            "consumption": 546.7
        },
        {
            "id": "eq-jrw8rxsfo",
            "name": "Vianni",
            "maxAmpere": 63,
            "consumption": 5.4
        },
        {
            "id": "eq-b4r18ya2t",
            "name": "Comprimeuse",
            "maxAmpere": 63,
            "consumption": 291.9
        },
        {
            "id": "eq-csgs72chf",
            "name": "SEJONG",
            "maxAmpere": 63,
            "consumption": 12.1
        },
        {
            "id": "eq-xkdbi6oci",
            "name": "Encarteneuse Marchesini",
            "maxAmpere": 63,
            "consumption": 165.3
        }
    ]
  },
  {
    id: 'CAB-10',
    name: 'Armoire 10 - Ligne Granulation Formes Sèches',
    description: 'Séchoir lit d\'air fluidisé, mélangeur biconique et comprimatrices',
    category: 'electricite',
    startIndex: 54900,
    endIndex: 56650,
    consumption: 1294,
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Prod Solides',
    equipments: [
        {
            "id": "eq-cm5i8fhdj",
            "name": "BLOC D1",
            "maxAmpere": 40,
            "consumption": 838.1
        },
        {
            "id": "eq-hcnz92dhu",
            "name": "COULOIR PRODUCTION",
            "maxAmpere": 63,
            "consumption": 382.7
        },
        {
            "id": "eq-bvkwp6rmh",
            "name": "RECUPERATEUR",
            "maxAmpere": 40,
            "consumption": 21
        },
        {
            "id": "eq-elptige4w",
            "name": "UTA magasin",
            "maxAmpere": 63,
            "consumption": 51.9
        }
    ]
  },
  {
    id: 'CAB-11',
    name: 'Armoire 11 - Thermoformeuses & Blisters',
    description: 'Chauffage opercules PVC/Alu, scellage rotatif et découpe blisters',
    category: 'electricite',
    startIndex: 38200,
    endIndex: 39980,
    consumption: 1032,
    multiplier: 10,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Moyennne',
    area: 'Conditionnement',
    equipments: [
        {
            "id": "eq-xao9idg5e",
            "name": "Sarong",
            "maxAmpere": 63,
            "consumption": 1032.4
        }
    ]
  },
  {
    id: 'CAB-12',
    name: 'Armoire 12 - Conditionnement Secondaire',
    description: 'Encartonneuses automatiques, étuyeuses et convoyeurs finaux',
    category: 'electricite',
    startIndex: 15400,
    endIndex: 16500,
    consumption: 8928,
    multiplier: 4,
    unit: 'kWh',
    status: 'Vert',
    criticality: 'Faible',
    area: 'Conditionnement',
    equipments: [
        {
            "id": "eq-axjtmamzb",
            "name": "RECUPERATEUR",
            "maxAmpere": 40,
            "consumption": 758.2
        },
        {
            "id": "eq-ppu0qi1g7",
            "name": "BLOC A",
            "maxAmpere": 63,
            "consumption": 3210
        },
        {
            "id": "eq-msrk07uiu",
            "name": "COULOIR PRODUCTION",
            "maxAmpere": 63,
            "consumption": 593.7
        },
        {
            "id": "eq-zgb4zzj0b",
            "name": "BLOC F&G",
            "maxAmpere": 63,
            "consumption": 2711.3
        },
        {
            "id": "eq-dom8itl5s",
            "name": "COULOIR PRODUCTION",
            "maxAmpere": 63,
            "consumption": 1654.7
        }
    ]
  },
  {
    id: 'CAB-13',
    name: 'Armoire 13 - Boucle Eau Purifiée (EP)',
    description: 'Pompes de circulation boucle d\'eau, ozoneur et lampes UV',
    category: 'electricite',
    startIndex: 41200,
    endIndex: 43100,
    consumption: 599,
    multiplier: 8,
    unit: 'kWh',
    status: 'Orange',
    criticality: 'Critique',
    area: 'Eau Process',
    equipments: [
        {
            "id": "eq-0bg1us4av",
            "name": "F570",
            "maxAmpere": 63,
            "consumption": 194.3
        },
        {
            "id": "eq-g5yww91ax",
            "name": "F57 Old",
            "maxAmpere": 63,
            "consumption": 3.8
        },
        {
            "id": "eq-29573465c",
            "name": "OMAG",
            "maxAmpere": 63,
            "consumption": 400.5
        }
    ]
  },
  {
    id: 'CAB-14',
    name: 'Compteur Général Usine',
    description: 'Arrivée d\'eau brute (SONEDE) pour toute l\'usine',
    category: 'eau',
    waterType: 'brute',
    startIndex: 5800,
    endIndex: 6920,
    consumption: 1120,
    multiplier: 1, // m³ water
    unit: 'm³',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Raccordement',
    equipments: [
        {
            "id": "eq-eb-1",
            "name": "Alimentation Chaudière",
            "maxAmpere": 0,
            "consumption": 220
        },
        {
            "id": "eq-eb-2",
            "name": "Sanitaires & Vestiaires",
            "maxAmpere": 0,
            "consumption": 120
        }
    ]
  },
  {
    id: 'CAB-16',
    name: 'Boucle PW-01 (Eau Purifiée)',
    description: 'Compteur d\'eau osmosée en circulation vers la production',
    category: 'eau',
    waterType: 'purifiee',
    startIndex: 1200,
    endIndex: 1980,
    consumption: 780,
    multiplier: 1,
    unit: 'm³',
    status: 'Orange',
    criticality: 'Critique',
    area: 'Eau Process',
    equipments: [
        {
            "id": "eq-pw-1",
            "name": "Lavage Cuves Fabrication",
            "maxAmpere": 0,
            "consumption": 450
        },
        {
            "id": "eq-pw-2",
            "name": "Siroperie",
            "maxAmpere": 0,
            "consumption": 330
        }
    ]
  },
  {
    id: 'CAB-15',
    name: 'Armoire 15 - Chaudière d\'Alimentation Vapeur',
    description: 'Chaufferie principale pour alimentation des ballons et autoclaves',
    category: 'gasoil',
    startIndex: 18900,
    endIndex: 21850,
    consumption: 21861,
    multiplier: 1.5, // units in liters of fuel
    unit: 'Litres',
    status: 'Vert',
    criticality: 'Critique',
    area: 'Fluides / Thermique',
    equipments: [
        {
            "id": "eq-n2fdpe56i",
            "name": "UTAR 1-8",
            "maxAmpere": 63,
            "consumption": 5207.9
        },
        {
            "id": "eq-1o4q3kk7b",
            "name": "UTA 5",
            "maxAmpere": 63,
            "consumption": 7211.1
        },
        {
            "id": "eq-hgw2msmkc",
            "name": "UTA 12-13",
            "maxAmpere": 63,
            "consumption": 9125.2
        },
        {
            "id": "eq-k0a18vzm4",
            "name": "UTA 14",
            "maxAmpere": 63,
            "consumption": 316.9
        }
    ]
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

export const MONTHLY_SOLAR_HISTORY = [
  { month: 'Jan', grid: 38000, solar: 4000 },
  { month: 'Fév', grid: 36000, solar: 5000 },
  { month: 'Mar', grid: 37500, solar: 7000 },
  { month: 'Avr', grid: 36000, solar: 10000 },
  { month: 'Mai', grid: 38700, solar: 12500 },
  { month: 'Juin', grid: 48500, solar: 14000 },
  { month: 'Juil', grid: 62000, solar: 16000 },
  { month: 'Août', grid: 65400, solar: 16000 },
  { month: 'Sept', grid: 55000, solar: 14000 },
  { month: 'Oct', grid: 44000, solar: 10000 },
  { month: 'Nov', grid: 39000, solar: 7000 },
  { month: 'Déc', grid: 38000, solar: 5000 },
];



const fs = require('fs');

const raw = `Armoire N°1	Transformateur N°1	1250	90977,3
Armoire N°1	Transformateur N°2	1250	0
Armoire N°1	Transformateur N°3	1250	89162,3
Armoire N°1	Groupe Frigorifique OMOMIX	80	1247,3
Armoire N°1	Armoire pompes evacuation eau de pluie	50	0
Armoire N°1	Climatiseur local buanderie	25	0
Armoire N°1	Climatiseur local PDR	32	66,2
Armoire N°1	Local Atelier informatique	40	357,8
Armoire N°1	Alimenation chaudière	50	137,8
Armoire N°1	Local buanderie prod	50	798,1
Armoire N°1	Parafoudre	40	0
Armoire N°1	Monte charge	125	273,4
Armoire N°1	Armoire Bloc D2 Normal	250	2098,6
Armoire N°1	Compresseur FIAC	630	64,1
Armoire N°1	Groupe frigorifique N°8	630	36990,6
Armoire N°1	Groupe frigorifique N°4	630	71,9
Armoire N°1	Groupe frigorifique N°6	630	20744,6
Armoire N°1	Groupe frigorifique N°7	630	420
Armoire N°1	Groupe frigorifique N°9	1000	36316,9
Armoire N°1	Alimentation secours	1600	156282,2
Armoire N°1	Batterie Condensateur	800	115,9
Armoire N°2	Local buanderie	50	32
Armoire N°2	Asservissement	32	12,4
Armoire N°2	local CTEU 1	50	1930,5
Armoire N°2	Alimentation ascenseurs	50	34,1
Armoire N°2	local CTEU 2	32	310,1
Armoire N°2	Normal LCQ et ADMINISTRATION	80	1463,8
Armoire N°2	Magasin MP/AC et PF	125	10264,3
Armoire N°2	Station d'épuration	125	1603,7
Armoire N°2	Onduleur LCQ	160	1511,9
Armoire N°2	Ondueleur DEV	160	1486,8
Armoire N°2	Local transformateur	40	434,6
Armoire N°2	Local Serveur	160	3453,7
Armoire N°2	Traitement d'air Bloc D2	250	21776,4
Armoire N°2	Bloc D2	250	2885,1
Armoire N°2	local technique	40	1553,1
Armoire N°2	Groupe éléctrogène	16	727,8
Armoire N°2	Local TGBT	10	53,9
Armoire N°2	Surpresseur incendie	50	15,3
Armoire N°2	local CTEU 3	125	3825,3
Armoire N°2	Administration	80	5436,3
Armoire N°2	Poste gardien N°2	40	0
Armoire N°2	Ligne air comprimé	200	18984,8
Armoire N°2	Local devloppement	80	4087,7
Armoire N°2	Traitement d'air Opalia	630	52766,3
Armoire N°2	Production	800	15104,8
Armoire N°3	Bloc C	160	2326,7
Armoire N°3	Bloc B	100	550,7
Armoire N°3	Bloc A	250	1163
Armoire N°3	Bloc D1	160	1833,2
Armoire N°3	Production	160	2022,7
Armoire N°3	Local comercial	160	1182,2
Armoire N°3	Production+ Bloc H	160	1268,5
Armoire N°3	omomix	160	1538,2
Armoire N°3	Karcher bloc H	80	245,4
Armoire N°4	F57 NEW	63	95,7
Armoire N°4	Tirelli	63	76,3
Armoire N°5	Comadis	63	86,9
Armoire N°6	BLOC B	63	752,3
Armoire N°6	BLOC C	63	1588,5
Armoire N°6	BLOC H	40	563,4
Armoire N°6	LCM	40	538,8
Armoire N°7	UTA 2, UTA 3, UTA 8, UTA 11 et éclairage étage technique	160	5996,8
Armoire N°7	surpresseur et pompes collecteur d'eau	160	18681,2
Armoire N°7	UTA 4, UTA 6, REC 2 et CVM	250	7812
Armoire N°7	REC 1, UTA 1, UTA 7, UTA 10, éclairage prod et CVM	250	12942,3
Armoire N°8	Blistereuse Marchesini	63	70,5
Armoire N°8	Cyclops	63	102,6
Armoire N°8	Granulateur	63	93,7
Armoire N°8	Guibli 50	63	394,3
Armoire N°8	Hulmann	63	341,7
Armoire N°9	GS	63	546,7
Armoire N°9	Vianni	63	5,4
Armoire N°9	Comprimeuse	63	291,9
Armoire N°9	SEJONG	63	12,1
Armoire N°9	Encarteneuse Marchesini	63	165,3
Armoire N°10	BLOC D1	40	838,1
Armoire N°10	COULOIR PRODUCTION	63	382,7
Armoire N°10	RECUPERATEUR	40	21
Armoire N°10	UTA magasin	63	51,9
Armoire N°11	Sarong	63	1032,4
Armoire N°12	RECUPERATEUR	40	758,2
Armoire N°12	BLOC A	63	3210
Armoire N°12	COULOIR PRODUCTION	63	593,7
Armoire N°12	BLOC F&G	63	2711,3
Armoire N°12	COULOIR PRODUCTION	63	1654,7
Armoire N°13	F570	63	194,3
Armoire N°13	F57 Old	63	3,8
Armoire N°13	OMAG	63	400,5
Armoire N°14	Prises	63	12,6
Armoire N°14	Eclairage	63	7,4
Armoire N°15	UTAR 1-8	63	5207,9
Armoire N°15	UTA 5	63	7211,1
Armoire N°15	UTA 12-13	63	9125,2
Armoire N°15	UTA 14	63	316,9`;

const data = {};
const lines = raw.split('\n');
lines.forEach(l => {
  if(!l.trim()) return;
  const parts = l.split('\t');
  if(parts.length < 4) return;
  const arm = parts[0].trim();
  const desc = parts[1].trim();
  const maxA = parseFloat(parts[2].replace(',','.'));
  const conso = parseFloat(parts[3].replace(',','.'));
  
  if(!data[arm]) data[arm] = [];
  data[arm].push({
    id: 'eq-' + Math.random().toString(36).substr(2, 9),
    name: desc,
    maxAmpere: maxA,
    consumption: conso
  });
});

const tsCode = fs.readFileSync('src/data.ts', 'utf-8');
// we will replace INITIAL_CABINETS directly 
// actually let's output a patch file or just a string mapping
let mapping = {};
for(let k in data) {
  // e.g., "Armoire N°1" -> "CAB-01"
  let numStr = k.match(/N°(\d+)/)[1];
  let cabId = `CAB-${numStr.padStart(2, '0')}`;
  mapping[cabId] = data[k];
}

const linesTs = tsCode.split('\n');
let inside = false;
let out = [];
let currentCab = null;

for(let line of linesTs) {
  if(line.includes("id: 'CAB-")) {
    currentCab = line.match(/id:\s*'([^']+)'/)[1];
  }
  
  // if we see area:, we need to append the equipments right after it
  // Actually let's just use string replace using AST or regex
  out.push(line);
}

// better way to replace:
let newCode = tsCode.replace(/area:\s*'[^']+'/g, (match, offset, string) => {
  // we need to find the cabId just before this
  let substr = string.substring(0, offset);
  let cabIdMatch = [...substr.matchAll(/id:\s*'([^']+)'/g)].pop();
  if(!cabIdMatch) return match;
  let cabId = cabIdMatch[1];
  
  if(mapping[cabId]) {
    let eqs = JSON.stringify(mapping[cabId], null, 4).replace(/\n/g, '\n    ');
    // adjust consumption of cabinet
    let totalCons = mapping[cabId].reduce((sum, e) => sum + e.consumption, 0);
    return `${match},\n    equipments: ${eqs}`;
  }
  
  return match;
});

// Calculate consumption and update it as well
newCode = newCode.replace(/consumption:\s*0/g, (match, offset, string) => {
   // find cab ID
   let substr = string.substring(0, offset);
   let cabIdMatch = [...substr.matchAll(/id:\s*'([^']+)'/g)].pop();
   if(!cabIdMatch) return match;
   let cabId = cabIdMatch[1];
   if(mapping[cabId]) {
    let totalCons = mapping[cabId].reduce((sum, e) => sum + e.consumption, 0);
    return `consumption: ${Math.round(totalCons)}`;
   }
   return match;
});

fs.writeFileSync('src/data.ts', newCode);
console.log("src/data.ts updated!");

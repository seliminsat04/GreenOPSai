import React, { useState } from 'react';

// STACKED BAR CHART: Direct vs Indirect cost per product
interface StackedBarProps {
  data: Array<{
    name: string;
    direct: number;
    indirect: number;
  }>;
  themeMode?: 'dark' | 'light';
}

export const StackedBarChart: React.FC<StackedBarProps> = ({ data, themeMode = 'dark' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(d => d.direct + d.indirect), 100);
  const chartHeight = 240;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingSides = 40;

  return (
    <div className={`relative p-5 rounded-2xl border transition-colors duration-300 ${
      themeMode === 'light' 
        ? 'bg-white border-slate-200/80 shadow-sm' 
        : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
    }`}>
      <h3 className={`font-display text-sm font-semibold mb-6 flex items-center justify-between ${
        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
      }`}>
        <span>Répartition Coûts (Direct vs Indirect en TND)</span>
        <div className="flex items-center space-x-3 text-xs font-sans">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-[#79b823] inline-block"></span>
            <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Direct</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-[#004b93] inline-block"></span>
            <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Prorata Indirect</span>
          </span>
        </div>
      </h3>

      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* SVG Drawing Zone */}
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 500 ${chartHeight}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const h = paddingTop + (chartHeight - paddingBottom - paddingTop) * (1 - ratio);
            const val = Math.round(maxValue * ratio);
            return (
              <g key={idx} className="opacity-40">
                <line 
                  x1={paddingSides} 
                  y1={h} 
                  x2={500 - paddingSides} 
                  y2={h} 
                  stroke={themeMode === 'light' ? '#cbd5e1' : '#334155'} 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />
                <text x={10} y={h + 4} className={`${themeMode === 'light' ? 'fill-slate-450' : 'fill-slate-500'} font-mono text-[10px]`}>{val}</text>
              </g>
            );
          })}

          {/* Bar rendering */}
          {data.map((item, index) => {
            const colWidth = (500 - paddingSides * 2) / data.length;
            const x = paddingSides + colWidth * index + (colWidth - 28) / 2;

            const total = item.direct + item.indirect;
            const hDirect = ((chartHeight - paddingBottom - paddingTop) * item.direct) / maxValue;
            const hIndirect = ((chartHeight - paddingBottom - paddingTop) * item.indirect) / maxValue;

            const yIndirect = chartHeight - paddingBottom - hIndirect;
            const yDirect = yIndirect - hDirect;

            const isHovered = hoveredIndex === index;

            return (
              <g key={index} 
                 onMouseEnter={() => setHoveredIndex(index)} 
                 onMouseLeave={() => setHoveredIndex(null)}
                 className="cursor-pointer">
                {/* Indirect Bar */}
                <rect 
                  x={x} 
                  y={yIndirect} 
                  width={28} 
                  height={Math.max(hIndirect, 1)} 
                  fill="#004b93" 
                  rx={2}
                  className="transition-all duration-300 hover:fill-blue-500"
                  opacity={hoveredIndex === null || isHovered ? 1 : 0.6}
                />
                {/* Direct Bar */}
                <rect 
                  x={x} 
                  y={yDirect} 
                  width={28} 
                  height={Math.max(hDirect, 1)} 
                  fill="#79b823" 
                  rx={2}
                  className="transition-all duration-300 hover:fill-[#8ec32d]"
                  opacity={hoveredIndex === null || isHovered ? 1 : 0.6}
                />
                
                {/* X labels */}
                <text 
                  x={x + 14} 
                  y={chartHeight - 12} 
                  textAnchor="middle" 
                  className={`font-display text-[10px] transition-colors duration-300 ${
                    themeMode === 'light'
                      ? (isHovered ? 'fill-emerald-600 font-semibold' : 'fill-slate-500')
                      : (isHovered ? 'fill-emerald-400 font-medium' : 'fill-slate-400')
                  }`}
                >
                  {item.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredIndex !== null && (
          <div 
            className={`absolute z-20 text-xs p-2.5 rounded-lg shadow-xl border transition-colors duration-300 ${
              themeMode === 'light' 
                ? 'bg-white border-slate-200 text-slate-800 shadow-lg' 
                : 'bg-slate-950/95 border-slate-700 text-slate-100'
            }`}
            style={{
              left: `${(hoveredIndex + 0.5) * (100 / data.length)}%`,
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className={`font-semibold pb-1 mb-1 font-display border-b ${
              themeMode === 'light' ? 'text-emerald-600 border-slate-100' : 'text-emerald-400 border-slate-800'
            }`}>{data[hoveredIndex].name}</div>
            <div className="flex justify-between space-x-4">
              <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Coût Direct :</span>
              <span className={`font-bold font-mono ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{data[hoveredIndex].direct.toLocaleString('fr-FR')} TND</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Coût Indirect :</span>
              <span className={`font-bold font-mono ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{data[hoveredIndex].indirect.toLocaleString('fr-FR')} TND</span>
            </div>
            <div className={`flex justify-between space-x-4 border-t pt-1 mt-1 font-semibold ${
              themeMode === 'light' ? 'border-slate-100 text-emerald-600' : 'border-slate-800 text-[#10b981]'
            }`}>
              <span>Total :</span>
              <span className="font-mono">{(data[hoveredIndex].direct + data[hoveredIndex].indirect).toLocaleString('fr-FR')} TND</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// DONUT CHART: CO2 Distribution by source
interface DonutProps {
  elecCO2: number;
  waterCO2: number;
  gasoilCO2: number;
  themeMode?: 'dark' | 'light';
}

export const DonutChart: React.FC<DonutProps> = ({ elecCO2, waterCO2, gasoilCO2, themeMode = 'dark' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = elecCO2 + waterCO2 + gasoilCO2;
  const categories = [
    { name: 'Électricité', value: elecCO2, color: '#79b823', hoverColor: '#8ec32d' },
    { name: 'Eau Purifiée', value: waterCO2, color: '#004b93', hoverColor: '#64ace0' },
    { name: 'Gasoil Chaudière', value: gasoilCO2, color: '#f59e0b', hoverColor: '#fbbf24' }
  ];

  // Map slices
  let accumulatedAngle = 0;
  const slices = categories.map((cat, idx) => {
    const percentage = total > 0 ? (cat.value / total) * 100 : 0;
    const angle = (cat.value / (total || 1)) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    return {
      ...cat,
      percentage,
      startAngle,
      endAngle: accumulatedAngle
    };
  });

  return (
    <div className={`relative p-5 rounded-2xl border transition-colors duration-300 flex flex-col justify-between ${
      themeMode === 'light' 
        ? 'bg-white border-slate-200/80 shadow-sm' 
        : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
    }`}>
      <h3 className={`font-display text-sm font-semibold mb-4 ${
        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
      }`}>
        Répartition Empreinte CO₂ par Fluide (%)
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-around flex-1 py-2">
        {/* SVG Circle Drawing */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {total === 0 ? (
              <circle cx="50" cy="50" r="35" fill="none" stroke={themeMode === 'light' ? '#cbd5e1' : '#334155'} strokeWidth="12" />
            ) : (
              slices.map((slice, idx) => {
                const r = 35;
                const circumference = 2 * Math.PI * r;
                const strokeLength = (slice.percentage / 100) * circumference;
                const strokeOffset = circumference - (slice.startAngle / 360) * circumference;
                const isHovered = hoveredIdx === idx;

                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke={catColor(idx)}
                    strokeWidth={isHovered ? 15 : 12}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })
            )}
          </svg>
          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-[10px] uppercase tracking-widest font-display ${
              themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>CO₂ Total</span>
            <span className={`text-xl font-bold font-mono ${
              themeMode === 'light' ? 'text-emerald-600' : 'text-emerald-400 glow-text-green'
            }`}>
              {total.toFixed(1)} t
            </span>
          </div>
        </div>

        {/* Labels checklist */}
        <div className="space-y-3 mt-4 sm:mt-0 w-full xs:max-w-[200px]">
          {slices.map((slice, idx) => (
            <div 
              key={idx} 
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                hoveredIdx === idx 
                  ? (themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-800') 
                  : (themeMode === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40')
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: slice.color }}></span>
                <span className={`text-xs ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{slice.name}</span>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold font-mono ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{slice.percentage.toFixed(1)}%</div>
                <div className={`text-[10px] font-mono ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{slice.value.toFixed(1)} t</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function catColor(idx: number): string {
    if (idx === 0) return '#79b823';
    if (idx === 1) return '#004b93';
    return '#f59e0b';
  }
};


// LINE CHART: 30 days temperature vs energy consumption
interface LineChartProps {
  data: Array<{
    day: string;
    temp: number;
    baseConso: number;
    currentConso: number;
  }>;
  themeMode?: 'dark' | 'light';
}

export const LineTempEnergyChart: React.FC<LineChartProps> = ({ data, themeMode = 'dark' }) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  // Take every 2nd point to avoid cluttering in smaller graph width
  const filteredData = data.filter((_, idx) => idx % 2 === 0);

  const maxTemp = Math.max(...filteredData.map(d => d.temp), 45);
  const minTemp = Math.min(...filteredData.map(d => d.temp), 15);
  const maxConso = Math.max(...filteredData.map(d => d.baseConso), 80000);
  const minConso = Math.min(...filteredData.map(d => d.currentConso), 30000);

  const width = 600;
  const height = 240;
  const paddingTop = 25;
  const paddingBottom = 35;
  const paddingLeft = 45;
  const paddingRight = 45;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Convert points to SVG line paths
  const getPointsPath = (key: 'temp' | 'currentConso') => {
    return filteredData.map((d, index) => {
      const x = paddingLeft + (index / (filteredData.length - 1)) * plotWidth;
      let y = 0;
      if (key === 'temp') {
        y = paddingTop + plotHeight * (1 - (d.temp - minTemp) / (maxTemp - minTemp || 1));
      } else {
        y = paddingTop + plotHeight * (1 - (d.currentConso - minConso) / (maxConso - minConso || 1));
      }
      return { x, y, ...d, index };
    });
  };

  const tempPoints = getPointsPath('temp');
  const consoPoints = getPointsPath('currentConso');

  const makeSvgPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    return points.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, '');
  };

  const tempPath = makeSvgPath(tempPoints);
  const consoPath = makeSvgPath(consoPoints);

  return (
    <div className={`relative p-5 rounded-2xl border transition-colors duration-300 w-full ${
      themeMode === 'light' 
        ? 'bg-white border-slate-200/80 shadow-sm' 
        : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
    }`}>
      <h3 className={`font-display text-sm font-semibold mb-6 flex items-center justify-between ${
        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
      }`}>
        <span>Analyse Climatique: Corrélation Énergie & Température (30J)</span>
        <div className="flex items-center space-x-4 text-xs font-sans">
          <span className="flex items-center space-x-1.5 font-sans">
            <span className="w-3 h-0.5 bg-[#f59e0b] inline-block"></span>
            <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Température extérieure (°C)</span>
          </span>
          <span className="flex items-center space-x-1.5 font-sans">
            <span className="w-3 h-0.5 bg-[#79b823] inline-block"></span>
            <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Consommation Globale (kWh)</span>
          </span>
        </div>
      </h3>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Y-Axis Grid Lines for Conso side */}
          {[0, 0.5, 1].map((ratio) => {
            const y = paddingTop + plotHeight * (1 - ratio);
            const val = Math.round(minConso + (maxConso - minConso) * ratio);
            return (
              <g key={ratio} className="opacity-30">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke={themeMode === 'light' ? '#94a3b8' : '#475569'} 
                  strokeWidth="1" 
                  strokeDasharray="2,2" 
                />
                <text x={12} y={y + 3} className={`${themeMode === 'light' ? 'fill-emerald-700 font-semibold' : 'fill-emerald-400'} font-mono text-[9px]`}>{val} kWh</text>
              </g>
            );
          })}

          {/* Right Y-Axis label for Temperature */}
          {[0, 0.5, 1].map((ratio) => {
            const y = paddingTop + plotHeight * (1 - ratio);
            const val = Math.round(minTemp + (maxTemp - minTemp) * ratio);
            return (
              <text key={`t-${ratio}`} x={width - paddingRight + 8} y={y + 3} className={`opacity-80 font-mono text-[9px] text-right ${themeMode === 'light' ? 'fill-amber-700 font-semibold' : 'fill-amber-400'}`}>
                {val}°C
              </text>
            );
          })}

          {/* Paths */}
          <path d={consoPath} fill="none" stroke="#79b823" strokeWidth="2.5" strokeLinecap="round" />
          <path d={tempPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="1" strokeLinecap="round" />

          {/* Interaction points */}
          {consoPoints.map((pt, idx) => {
            const isHovered = activePoint === idx;
            const stepWidth = plotWidth / (consoPoints.length - 1 || 1);
            return (
              <g key={idx} 
                 onMouseEnter={() => setActivePoint(idx)}
                 onMouseLeave={() => setActivePoint(null)}
                 className="cursor-pointer">
                {/* Invisible full-height hit area overlay */}
                <rect 
                  x={pt.x - stepWidth / 2} 
                  y={paddingTop} 
                  width={stepWidth} 
                  height={plotHeight} 
                  fill="currentColor" 
                  opacity="0"
                  pointerEvents="all"
                />
                {/* Overlay vertical bar highlight */}
                {isHovered && (
                  <line 
                    x1={pt.x} 
                    y1={paddingTop} 
                    x2={pt.x} 
                    y2={height - paddingBottom} 
                    stroke={themeMode === 'light' ? '#94a3b8' : '#475569'} 
                    strokeWidth="1" 
                    className="opacity-50"
                  />
                )}
                {/* Conso circle */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isHovered ? 6 : 3} 
                  fill="#79b823" 
                  className="transition-all duration-200" 
                />
                {/* Temp circle */}
                <circle 
                  cx={pt.x} 
                  cy={tempPoints[idx].y} 
                  r={isHovered ? 6 : 3} 
                  fill="#f59e0b" 
                  className="transition-all duration-200" 
                />
                
                {/* X Axis ticks */}
                {idx % 2 === 0 && (
                  <text x={pt.x} y={height - 12} textAnchor="middle" className={`font-display text-[9px] ${themeMode === 'light' ? 'fill-slate-600 font-medium' : 'fill-slate-500'}`}>
                    {pt.day.replace('Jour ', 'J')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip info */}
        {activePoint !== null && (
          <div 
            className={`absolute z-35 border p-2.5 rounded-lg shadow-2xl text-xs w-44 transition-colors duration-300 ${
              themeMode === 'light' 
                ? 'bg-white border-slate-200 text-slate-800' 
                : 'bg-slate-950/95 border-slate-700 text-slate-100'
            }`}
            style={{
              left: `${(consoPoints[activePoint].x / width) * 100}%`,
              top: '15px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className={`font-semibold pb-1 mb-1 font-display border-b ${
              themeMode === 'light' ? 'text-slate-800 border-slate-100' : 'text-slate-300 border-slate-800'
            }`}>
              {filteredData[activePoint].day} (Tunis)
            </div>
            <div className="flex justify-between">
              <span className="text-amber-500 font-medium">Temp :</span>
              <span className={`font-mono font-bold ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-100'}`}>{filteredData[activePoint].temp}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-500 font-medium">Énergie :</span>
              <span className={`font-mono font-bold ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-100'}`}>{filteredData[activePoint].currentConso.toLocaleString('fr-FR')} kWh</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// COMPARISON CHART: Current Year (2026) vs Previous Year (2025)
interface YearlyComparisonProps {
  data: Array<{
    month: string;
    currentYear: number;
    previousYear: number;
    saving?: number;
  }>;
  themeMode?: 'dark' | 'light';
}

export const YearlyComparisonChart: React.FC<YearlyComparisonProps> = ({ data, themeMode = 'dark' }) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'saving'>('both');

  const maxVal = Math.max(...data.map(d => Math.max(d.currentYear, d.previousYear)), 100000);
  const minVal = 0;

  const width = 600;
  const height = 240;
  const paddingTop = 25;
  const paddingBottom = 40;
  const paddingLeft = 55;
  const paddingRight = 35;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Points for 2026
  const points2026 = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight * (1 - (d.currentYear - minVal) / (maxVal - minVal || 1));
    return { x, y, ...d, index };
  });

  // Points for 2025  
  const points2025 = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight * (1 - (d.previousYear - minVal) / (maxVal - minVal || 1));
    return { x, y, ...d, index };
  });

  const makeSvgPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    return points.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, '');
  };

  const makeAreaPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    const linePath = makeSvgPath(points);
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const baseY = height - paddingBottom;
    return `${linePath} L ${endX} ${baseY} L ${startX} ${baseY} Z`;
  };

  const path2026 = makeSvgPath(points2026);
  const path2025 = makeSvgPath(points2025);
  const area2026 = makeAreaPath(points2026);
  const area2025 = makeAreaPath(points2025);

  const totalSaved = data.reduce((acc, d) => acc + (d.previousYear - d.currentYear), 0);

  return (
    <div className={`relative p-5 rounded-3xl border transition-all duration-300 w-full shimmer-element ${
      themeMode === 'light' 
        ? 'bg-white border-slate-205 shadow-sm' 
        : 'glass-panel-dark border-slate-800 backdrop-blur-md'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-40">
        <div>
          <h3 className={`font-display text-sm font-bold flex items-center gap-1.5 ${
            themeMode === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}>
            <span>Évolution & Comparaison Mensuelle des Coûts (TND)</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              themeMode === 'light' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {totalSaved > 0 ? `-${totalSaved.toLocaleString('fr-FR')} TND économisés` : 'Analyse comparative'}
            </span>
          </h3>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5">Comparatif 2026 vs 2025 intégrant l'HVAC optimisé et l'élasticité énergétique</p>
        </div>

        {/* View Mode Switcher */}
        <div className={`flex p-1 rounded-xl self-start ${themeMode === 'light' ? 'bg-slate-100' : 'bg-slate-900 border border-slate-800'}`}>
          <button 
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'both'
                ? (themeMode === 'light' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md font-bold')
                : (themeMode === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5')
            }`}
          >
            Courbes 26 vs 25
          </button>
          <button 
            type="button"
            onClick={() => setViewMode('saving')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'saving'
                ? (themeMode === 'light' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md font-bold')
                : (themeMode === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5')
            }`}
          >
            Économies Réalisées
          </button>
        </div>
      </div>

      {viewMode === 'both' ? (
        <div className="relative" style={{ height: `${height}px` }}>
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {/* Grids */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + plotHeight * (1 - ratio);
              const val = Math.round(minVal + (maxVal - minVal) * ratio);
              return (
                <g key={ratio} className="opacity-30">
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke={themeMode === 'light' ? '#cbd5e1' : '#334155'} 
                    strokeWidth="1" 
                    strokeDasharray="2,2" 
                  />
                  <text x={8} y={y + 3} className={`${themeMode === 'light' ? 'fill-slate-600 font-semibold' : 'fill-slate-500'} font-mono text-[9px]`}>
                    {val.toLocaleString('fr-FR')} DT
                  </text>
                </g>
              );
            })}

            {/* Areas */}
            <path d={area2025} fill={themeMode === 'light' ? 'url(#grad2025Light)' : 'url(#grad2025)'} className="transition-all duration-300" opacity="0.4" />
            <path d={area2026} fill={themeMode === 'light' ? 'url(#grad2026Light)' : 'url(#grad2026)'} className="transition-all duration-300" opacity="0.65" />

            {/* Lines */}
            <path d={path2025} fill="none" stroke={themeMode === 'light' ? '#64ace0' : '#004b93'} strokeWidth="2" strokeLinecap="round" strokeDasharray="3,3" />
            <path d={path2026} fill="none" stroke="#79b823" strokeWidth="2.5" strokeLinecap="round" />

            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="grad2025" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#004b93" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#004b93" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="grad2025Light" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64ace0" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#64ace0" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="grad2026" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#79b823" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#79b823" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="grad2026Light" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#79b823" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#79b823" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Interactive ticks & points */}
            {points2026.map((pt, idx) => {
              const isHovered = activePoint === idx;
              const stepWidth = plotWidth / (data.length - 1 || 1);
              return (
                <g key={idx} 
                   onMouseEnter={() => setActivePoint(idx)}
                   onMouseLeave={() => setActivePoint(null)}
                   className="cursor-pointer">
                  {/* Invisible full-height hit area overlay */}
                  <rect 
                    x={pt.x - stepWidth / 2} 
                    y={paddingTop} 
                    width={stepWidth} 
                    height={plotHeight} 
                    fill="currentColor" 
                    opacity="0"
                    pointerEvents="all"
                  />

                  {/* Vertical Hover Highlighter Bar */}
                  {isHovered && (
                    <line 
                      x1={pt.x} 
                      y1={paddingTop} 
                      x2={pt.x} 
                      y2={height - paddingBottom} 
                      stroke={themeMode === 'light' ? '#cbd5e1' : '#334155'} 
                      strokeWidth="1" 
                    />
                  )}

                  {/* Dot 2025 */}
                  <circle 
                    cx={pt.x} 
                    cy={points2025[idx].y} 
                    r={isHovered ? 5.5 : 2.5} 
                    fill={themeMode === 'light' ? '#64ace0' : '#004b93'} 
                    className="transition-all duration-200" 
                  />

                  {/* Dot 2026 */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={isHovered ? 6 : 3} 
                    fill="#79b823" 
                    stroke={themeMode === 'light' ? '#ffffff' : '#090e1e'}
                    strokeWidth={isHovered ? 1.5 : 0}
                    className="transition-all duration-200 shadow-md" 
                  />

                  <text 
                    x={pt.x} 
                    y={height - 10} 
                    textAnchor="middle" 
                    className={`font-display text-[9px] ${
                      isHovered
                        ? (themeMode === 'light' ? 'fill-slate-800 font-bold' : 'fill-slate-100 font-bold')
                        : (themeMode === 'light' ? 'fill-slate-500 font-medium' : 'fill-slate-400')
                    }`}
                  >
                    {pt.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend indicators */}
          <div className="absolute left-14 bottom-14 flex items-center space-x-4 text-[10px] select-none pointer-events-none">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-[#79b823] inline-block"></span>
              <span className={themeMode === 'light' ? 'text-slate-700 font-semibold' : 'text-emerald-400 font-medium'}>Courant 2026</span>
            </span>
            <span className="flex items-center space-x-1 font-mono">
              <span className="w-3 h-0.5 bg-blue-500 border-dashed border-t inline-block"></span>
              <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-450'}>Précédent 2025</span>
            </span>
          </div>

          {/* Floating Tooltip info */}
          {activePoint !== null && (
            <div 
              className={`absolute z-35 border p-3 rounded-xl shadow-2xl text-xs w-48 transition-all duration-200 ${
                themeMode === 'light' 
                  ? 'bg-white border-slate-200 text-slate-800 shadow-lg' 
                  : 'bg-slate-950/95 border-slate-800 text-slate-100'
              }`}
              style={{
                left: `${(points2026[activePoint].x / width) * 100}%`,
                top: `10px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className={`font-semibold pb-1.5 mb-1.5 font-display border-b flex justify-between items-center ${
                themeMode === 'light' ? 'text-slate-800 border-slate-100' : 'text-slate-300 border-slate-850'
              }`}>
                <span>{data[activePoint].month}</span>
                <span className="text-[10px] text-emerald-500 font-mono">2026 vs 2025</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-450">Coût 2025 :</span>
                <span className="font-mono font-bold">{data[activePoint].previousYear.toLocaleString('fr-FR')} DT</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#79b823] font-medium">Coût 2026 :</span>
                <span className="font-mono font-black text-[#79b823]">{data[activePoint].currentYear.toLocaleString('fr-FR')} DT</span>
              </div>
              <div className={`flex justify-between border-t pt-1.5 mt-1.5 font-bold ${
                themeMode === 'light' ? 'border-slate-100 text-emerald-600' : 'border-slate-850 text-emerald-400'
              }`}>
                <span>Économie :</span>
                <span className="font-mono">+{(data[activePoint].previousYear - data[activePoint].currentYear).toLocaleString('fr-FR')} DT</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative" style={{ height: `${height}px` }}>
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {/* Grids */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + plotHeight * (1 - ratio);
              const val = Math.round(10000 * ratio); // Max 10000 TND savings scale
              return (
                <g key={ratio} className="opacity-30">
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke={themeMode === 'light' ? '#cbd5e1' : '#334155'} 
                    strokeWidth="1" 
                    strokeDasharray="2,2" 
                  />
                  <text x={8} y={y + 3} className="fill-purple-500 font-mono text-[9px]">
                    {val.toLocaleString('fr-FR')} DT
                  </text>
                </g>
              );
            })}

            {/* Savings bar charts */}
            {data.map((item, index) => {
              const colWidth = plotWidth / data.length;
              const barWidth = Math.max(colWidth * 0.55, 12);
              const x = paddingLeft + colWidth * index + (colWidth - barWidth) / 2;
              
              const saving = Math.max(0, item.previousYear - item.currentYear);
              const barHeight = (plotHeight * saving) / 10000;
              const y = paddingTop + plotHeight - barHeight;

              const isHovered = activePoint === index;

              return (
                <g key={index} 
                   onMouseEnter={() => setActivePoint(index)} 
                   onMouseLeave={() => setActivePoint(null)}
                   className="cursor-pointer">
                  {/* Invisible full-height hit area overlay */}
                  <rect 
                    x={paddingLeft + colWidth * index} 
                    y={paddingTop} 
                    width={colWidth} 
                    height={plotHeight} 
                    fill="currentColor" 
                    opacity="0"
                    pointerEvents="all"
                  />
                  <rect 
                    x={x} 
                    y={y} 
                    width={barWidth} 
                    height={Math.max(barHeight, 2)} 
                    fill={isHovered ? '#004b93' : '#79b823'} 
                    rx={3.5}
                    className="transition-all duration-300"
                    opacity={activePoint === null || isHovered ? 1 : 0.65}
                  />

                  {/* Highlight text on top of bar on hover */}
                  {isHovered && (
                    <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[10px] font-bold font-mono fill-emerald-500">
                      +{saving.toLocaleString('fr-FR')}
                    </text>
                  )}

                  <text 
                    x={x + barWidth / 2} 
                    y={height - 10} 
                    textAnchor="middle" 
                    className={`font-display text-[9px] ${
                      isHovered
                        ? (themeMode === 'light' ? 'fill-slate-800 font-bold' : 'fill-slate-100 font-bold')
                        : (themeMode === 'light' ? 'fill-slate-500 font-medium' : 'fill-slate-400')
                    }`}
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend indicators */}
          <div className="absolute left-14 bottom-14 flex items-center space-x-2 text-[10px] select-none pointer-events-none">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            <span className={themeMode === 'light' ? 'text-slate-600 font-semibold' : 'text-emerald-400 font-medium'}>Gains Optimisés Électricité & Chauffage (TND)</span>
          </div>

          {/* Floating Tooltip info */}
          {activePoint !== null && (
            <div 
              className={`absolute z-35 border p-3 rounded-xl shadow-2xl text-xs w-48 transition-all duration-200 ${
                themeMode === 'light' 
                  ? 'bg-white border-slate-200 text-slate-800 shadow-lg' 
                  : 'bg-slate-950/95 border-slate-800 text-slate-100'
              }`}
              style={{
                left: `${((paddingLeft + (activePoint + 0.5) * (plotWidth / data.length)) / width) * 100}%`,
                top: `10px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className={`font-semibold pb-1.5 mb-1.5 font-display border-b flex justify-between items-center ${
                themeMode === 'light' ? 'text-slate-800 border-slate-100' : 'text-slate-300 border-slate-850'
              }`}>
                <span>{data[activePoint].month}</span>
                <span className="text-[10px] text-emerald-500 font-mono">Gains ANME</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-450">Coût 2025 :</span>
                <span className="font-mono font-bold">{data[activePoint].previousYear.toLocaleString('fr-FR')} DT</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#79b823] font-medium">Coût 2026 :</span>
                <span className="font-mono font-bold text-[#79b823]">{data[activePoint].currentYear.toLocaleString('fr-FR')} DT</span>
              </div>
              <div className={`flex justify-between border-t pt-1.5 mt-1.5 font-bold ${
                themeMode === 'light' ? 'border-slate-100 text-emerald-600' : 'border-slate-850 text-emerald-400'
              }`}>
                <span>Économie :</span>
                <span className="font-mono">+{(data[activePoint].previousYear - data[activePoint].currentYear).toLocaleString('fr-FR')} DT</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// TREEMAP CHART: Hierarchy of Cabinets and Equipments
import { Treemap, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const CabinetTreemap: React.FC<{ cabinets: any[], themeMode?: 'dark' | 'light' }> = ({ cabinets, themeMode = 'dark' }) => {
  // Format data for Recharts Treemap
  // We exclude CAB-01 (TGBT) to avoid duplicate consumption as it handles everything.
  const excludedCabinets = ['CAB-01'];
  
  const TREEMAP_COLORS = [
    '#0284c7', // sky-600
    '#ea580c', // orange-600
    '#059669', // emerald-600
    '#4f46e5', // indigo-600
    '#db2777', // pink-600
    '#d97706', // amber-600
    '#2563eb', // blue-600
    '#c026d3', // fuchsia-600
    '#65a30d', // lime-600
    '#7c3aed', // violet-600
    '#14b8a6', // teal-500
    '#b91c1c', // red-700
  ];

  const formattedData = cabinets
    .filter(c => !excludedCabinets.includes(c.id) && c.equipments && c.equipments.length > 0)
    .map((c, idx) => {
      const parentColor = TREEMAP_COLORS[idx % TREEMAP_COLORS.length];
      return {
        name: c.name.split(' - ')[0], // e.g. "Armoire 02"
        children: c.equipments.map((e: any) => ({
          name: e.name,
          size: Math.abs(e.consumption) > 0 ? Math.abs(e.consumption) : 1, // need positive size
          realSize: e.consumption,
          unit: c.unit || 'kWh',
          fill: parentColor,
        }))
      };
    });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-xl border shadow-xl ${themeMode === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
            <p className="font-bold font-sans text-sm leading-tight">{data.name}</p>
          </div>
          <p className="text-xs font-mono mt-1 text-[#79b823] ml-5">{data.realSize?.toLocaleString('fr-FR')} {data.unit}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative p-5 rounded-2xl border transition-colors duration-300 h-[28rem] ${
      themeMode === 'light' 
        ? 'bg-white border-slate-200/80 shadow-sm' 
        : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
    }`}>
      <h3 className={`font-display text-sm font-semibold mb-6 ${
        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
      }`}>
        Cartographie d'Arborescence : Consommation par Équipement (Sous-Comptage)
      </h3>
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={formattedData}
            dataKey="size"
            ratio={4 / 3}
            stroke={themeMode === 'light' ? '#fff' : '#0f172a'}
            isAnimationActive={false}
          >
            <RechartsTooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip2 } from 'recharts';

export const SolarVsNetworkChart: React.FC<{ data: any[], themeMode?: 'dark' | 'light' }> = ({ data, themeMode = 'dark' }) => {
  return (
    <div className={`relative p-5 rounded-2xl border transition-colors duration-300 h-96 ${
      themeMode === 'light' 
        ? 'bg-white border-slate-200/80 shadow-sm' 
        : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
    }`}>
      <h3 className={`font-display text-sm font-semibold mb-6 ${
        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
      }`}>
        Autoconsommation : Production Solaire vs Réseau STEG (kWh)
      </h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeMode === 'light' ? '#e2e8f0' : '#334155'} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: themeMode === 'light' ? '#64748b' : '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: themeMode === 'light' ? '#64748b' : '#94a3b8' }} tickFormatter={(val) => `${val/1000}k`} />
            <RechartsTooltip2 
              contentStyle={{ 
                backgroundColor: themeMode === 'light' ? '#fff' : '#0f172a',
                borderColor: themeMode === 'light' ? '#e2e8f0' : '#1e293b',
                borderRadius: '0.75rem',
                color: themeMode === 'light' ? '#0f172a' : '#f8fafc',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value.toLocaleString()} kWh`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="solar" name="Prod. Photovoltaïque" stackId="a" fill={themeMode === 'light' ? '#f59e0b' : '#fbbf24'} radius={[0, 0, 4, 4]} barSize={20} />
            <Bar dataKey="grid" name="Réseau (STEG)" stackId="a" fill={themeMode === 'light' ? '#0f172a' : '#1e293b'} radius={[4, 4, 0, 0]} barSize={20} />
            <Line type="monotone" dataKey="solar" name="Tendance Solaire" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};



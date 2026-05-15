import type { Anomaly } from '../types/ecg'

interface Props {
  anomaly: Anomaly
}

// Gera um path SVG de traco ECG estilizado baseado no tipo de mudanca
function getWaveformPath(anomaly: Anomaly): string {
  const { mainChange, primaryLeads } = anomaly.waveform
  const hasAnterior = primaryLeads.some(l => ['V1', 'V2', 'V3', 'V4'].includes(l))

  // Parametros base de um ciclo ECG normal
  // P: 40px, PR: 20px, QRS: 15px, ST: 30px, T: 40px
  // Cada ciclo começa em x=10, baseline y=60

  switch (mainChange) {
    case 'supra': {
      const stElev = hasAnterior ? -22 : -18
      return buildECGPath({ stOffset: stElev, tHeight: -22, qDepth: -4 })
    }
    case 'infra':
      return buildECGPath({ stOffset: 12, tHeight: -8, qDepth: -4 })
    case 't-invertida':
      return buildECGPath({ stOffset: 0, tHeight: 14, tInverted: true, qDepth: -4 })
    case 't-apiculada':
      return buildECGPath({ stOffset: 0, tHeight: -30, qDepth: -4 })
    case 't-bifasica':
      return buildECGPath({ stOffset: 0, tBifasica: true, qDepth: -4 })
    case 'bloqueio-rb':
      return buildBRDPath()
    case 'bloqueio-lb':
      return buildBREPath()
    case 'delta':
      return buildDeltaPath()
    case 'pr-longo':
      return buildECGPath({ prLong: true, stOffset: 0, tHeight: -14, qDepth: -4 })
    case 'pr-progressivo':
      return buildWenckebachPath()
    case 'dissociacao-av':
      return buildBAVTPath()
    case 'rr-irregular':
      return buildFAPath()
    case 'ondas-f':
      return buildFlutterPath()
    case 'qrs-largo':
      return buildTVPath()
    case 'sem-onda-p':
      return buildECGPath({ noP: true, stOffset: 0, tHeight: -14, qDepth: -4, fast: true })
    case 'baixa-voltagem':
      return buildECGPath({ stOffset: 0, tHeight: -8, qDepth: -2, scale: 0.35 })
    case 'alternancia-eletrica':
      return buildAlternanciaPath()
    case 'de-winter':
      return buildDeWinterPath()
    case 'fv':
      return buildFVPath()
    case 'torsades':
      return buildTorsadesPath()
    case 'ev':
      return buildEVPath()
    case 'eixo-esquerdo':
      return buildHBAEPath()
    case 'eixo-direito':
      return buildHBPEPath()
    case 'brugada-coved':
      return buildBrugadaCovedPath()
    case 'pericardite-concava':
      return buildPericarditeConvexPath()
    case 'mobitz2':
      return buildMobitz2Path()
    case 'qt-longo':
      return buildQTLongoPath()
    case 'bradicardia':
      return buildBradicardiaPath()
    default:
      return buildECGPath({ stOffset: 0, tHeight: -14, qDepth: -4 })
  }
}

interface ECGParams {
  stOffset?: number
  tHeight?: number
  tInverted?: boolean
  tBifasica?: boolean
  qDepth?: number
  prLong?: boolean
  noP?: boolean
  fast?: boolean
  scale?: number
}

function buildECGPath(p: ECGParams): string {
  const {
    stOffset = 0,
    tHeight = -14,
    tInverted = false,
    tBifasica = false,
    qDepth = -4,
    prLong = false,
    noP = false,
    fast = false,
    scale = 1,
  } = p

  const baseline = 70
  const s = scale
  const prLen = prLong ? 55 : 25
  const rrLen = fast ? 130 : 180

  // Ciclo 1
  const c1 = buildCycle(10, baseline, s, stOffset, tHeight, tInverted, tBifasica, qDepth, noP, prLen)
  // Ciclo 2
  const c2 = buildCycle(10 + rrLen, baseline, s, stOffset, tHeight, tInverted, tBifasica, qDepth, noP, prLen)
  // Ciclo 3 parcial
  const c3 = buildCycle(10 + rrLen * 2, baseline, s, stOffset, tHeight, tInverted, tBifasica, qDepth, noP, prLen)

  return [c1, c2, c3].join(' ')
}

function buildCycle(
  x0: number, bl: number, s: number,
  stOffset: number, tHeight: number,
  tInverted: boolean, tBifasica: boolean,
  qDepth: number, noP: boolean, prLen: number
): string {
  const parts: string[] = []
  let x = x0

  // Linha inicial
  parts.push(`M ${x} ${bl}`)
  x += 8

  // Onda P
  if (!noP) {
    parts.push(`Q ${x + 5} ${bl - 8 * s} ${x + 10} ${bl}`)
    x += 10
  }

  // Segmento PR
  parts.push(`L ${x + prLen} ${bl}`)
  x += prLen

  // QRS: Q
  parts.push(`L ${x + 2} ${bl + Math.abs(qDepth) * s}`)
  x += 2
  // R
  parts.push(`L ${x + 4} ${bl - 28 * s}`)
  x += 4
  // S
  parts.push(`L ${x + 3} ${bl + 6 * s}`)
  x += 3
  // Retorna baseline com offset ST
  parts.push(`L ${x + 4} ${bl + stOffset * s}`)
  x += 4

  // Segmento ST
  parts.push(`L ${x + 20} ${bl + stOffset * s}`)
  x += 20

  // Onda T
  if (tBifasica) {
    parts.push(`Q ${x + 8} ${bl - 12 * s} ${x + 14} ${bl}`)
    x += 14
    parts.push(`Q ${x + 6} ${bl + 10 * s} ${x + 12} ${bl}`)
    x += 12
  } else if (tInverted) {
    parts.push(`Q ${x + 10} ${bl + Math.abs(tHeight) * s} ${x + 20} ${bl}`)
    x += 20
  } else {
    parts.push(`Q ${x + 10} ${bl + tHeight * s} ${x + 20} ${bl}`)
    x += 20
  }

  // Final do ciclo
  parts.push(`L ${x + 15} ${bl}`)

  return parts.join(' ')
}

function buildBRDPath(): string {
  const bl = 70
  const segments: string[] = []
  for (let i = 0; i < 2; i++) {
    const x0 = 10 + i * 190
    segments.push(`M ${x0} ${bl}`)
    segments.push(`Q ${x0 + 5} ${bl - 7} ${x0 + 10} ${bl}`)
    segments.push(`L ${x0 + 33} ${bl}`)
    // Q
    segments.push(`L ${x0 + 35} ${bl + 4}`)
    // R
    segments.push(`L ${x0 + 39} ${bl - 26}`)
    // S1
    segments.push(`L ${x0 + 43} ${bl + 5}`)
    // R' (segunda deflexao positiva = orelhinha do BRD)
    segments.push(`L ${x0 + 47} ${bl - 14}`)
    // S2
    segments.push(`L ${x0 + 53} ${bl + 6}`)
    segments.push(`L ${x0 + 58} ${bl}`)
    // T invertida
    segments.push(`Q ${x0 + 68} ${bl + 12} ${x0 + 78} ${bl}`)
    segments.push(`L ${x0 + 95} ${bl}`)
  }
  return segments.join(' ')
}

function buildBREPath(): string {
  const bl = 70
  const segments: string[] = []
  for (let i = 0; i < 2; i++) {
    const x0 = 10 + i * 190
    segments.push(`M ${x0} ${bl}`)
    // Sem onda Q septal
    segments.push(`L ${x0 + 33} ${bl}`)
    // QRS largo entalhado
    segments.push(`L ${x0 + 37} ${bl - 15}`)
    segments.push(`L ${x0 + 43} ${bl - 10}`)  // entalhe
    segments.push(`L ${x0 + 49} ${bl - 26}`)  // R'
    segments.push(`L ${x0 + 58} ${bl}`)
    // T discordante (negativa em V5-V6)
    segments.push(`Q ${x0 + 68} ${bl + 14} ${x0 + 78} ${bl}`)
    segments.push(`L ${x0 + 95} ${bl}`)
  }
  return segments.join(' ')
}

function buildDeltaPath(): string {
  const bl = 70
  const segments: string[] = []
  for (let i = 0; i < 2; i++) {
    const x0 = 10 + i * 190
    segments.push(`M ${x0} ${bl}`)
    // P
    segments.push(`Q ${x0 + 5} ${bl - 7} ${x0 + 10} ${bl}`)
    // PR curto
    segments.push(`L ${x0 + 20} ${bl}`)
    // Onda delta (rampa lenta antes do QRS)
    segments.push(`L ${x0 + 32} ${bl - 10}`)
    // R
    segments.push(`L ${x0 + 37} ${bl - 26}`)
    // S
    segments.push(`L ${x0 + 43} ${bl + 5}`)
    segments.push(`L ${x0 + 48} ${bl}`)
    // ST e T normais
    segments.push(`L ${x0 + 58} ${bl}`)
    segments.push(`Q ${x0 + 68} ${bl - 12} ${x0 + 78} ${bl}`)
    segments.push(`L ${x0 + 95} ${bl}`)
  }
  return segments.join(' ')
}

function buildWenckebachPath(): string {
  const bl = 70
  const segments: string[] = []
  const prs = [20, 32, 44]
  let x = 10
  for (let i = 0; i < prs.length; i++) {
    const pr = prs[i]
    segments.push(`M ${x} ${bl}`)
    segments.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
    segments.push(`L ${x + 10 + pr} ${bl}`)
    if (i < prs.length - 1) {
      // QRS conduzido
      segments.push(`L ${x + 10 + pr + 2} ${bl + 4}`)
      segments.push(`L ${x + 10 + pr + 6} ${bl - 24}`)
      segments.push(`L ${x + 10 + pr + 9} ${bl + 5}`)
      segments.push(`L ${x + 10 + pr + 14} ${bl}`)
      segments.push(`Q ${x + 10 + pr + 24} ${bl - 12} ${x + 10 + pr + 34} ${bl}`)
      x += 10 + pr + 45
    } else {
      // P bloqueada (pausa)
      x += 10 + pr + 40
    }
    segments.push(`L ${x} ${bl}`)
  }
  return segments.join(' ')
}

function buildBAVTPath(): string {
  const bl = 70
  const segments: string[] = []
  // Ondas P independentes (rate ~70) e QRS independentes (rate ~35)
  const pPositions = [10, 50, 90, 130, 170, 210, 250, 290, 330, 370]
  const qrsPositions = [30, 110, 190, 270, 350]

  pPositions.forEach(x => {
    segments.push(`M ${x} ${bl}`)
    segments.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
  })

  qrsPositions.forEach(x => {
    segments.push(`M ${x} ${bl}`)
    segments.push(`L ${x + 2} ${bl + 6}`)
    segments.push(`L ${x + 6} ${bl - 22}`)
    segments.push(`L ${x + 9} ${bl + 7}`)
    segments.push(`L ${x + 14} ${bl}`)
    segments.push(`Q ${x + 26} ${bl - 12} ${x + 38} ${bl}`)
    segments.push(`L ${x + 48} ${bl}`)
  })

  return segments.join(' ')
}

function buildFAPath(): string {
  const bl = 70
  const segments: string[] = []
  // Linha de base irregular (fibrilacao)
  segments.push(`M 10 ${bl}`)
  const noisePoints = [15, 22, 28, 35, 40, 47, 55, 60, 67, 73]
  noisePoints.forEach((x, i) => {
    const y = bl + (i % 3 === 0 ? 3 : i % 3 === 1 ? -3 : 1.5)
    segments.push(`L ${x} ${y}`)
  })

  // QRS irregulares (RR variavel)
  const qrsX = [78, 128, 165, 225, 255, 320]
  qrsX.forEach(x => {
    segments.push(`M ${x} ${bl + 1}`)
    segments.push(`L ${x + 2} ${bl + 4}`)
    segments.push(`L ${x + 5} ${bl - 22}`)
    segments.push(`L ${x + 8} ${bl + 5}`)
    segments.push(`L ${x + 13} ${bl}`)
    // Linha de base irregular apos QRS
    const nextX = x + 13
    segments.push(`M ${nextX} ${bl}`)
    for (let j = 0; j < 5; j++) {
      const nx = nextX + j * 4
      const ny = bl + (j % 2 === 0 ? 2 : -2)
      segments.push(`L ${nx} ${ny}`)
    }
  })

  return segments.join(' ')
}

function buildFlutterPath(): string {
  const bl = 70
  const segments: string[] = []
  segments.push(`M 10 ${bl}`)
  // Ondas F em dente de serra
  for (let i = 0; i < 14; i++) {
    const x = 10 + i * 25
    segments.push(`L ${x + 12} ${bl - 12}`)
    segments.push(`L ${x + 25} ${bl + 4}`)
  }

  // QRS a cada 2 ondas (2:1) -- conduzindo sobre flutter
  const qrsX = [35, 85, 135, 185, 235, 285]
  qrsX.forEach(x => {
    segments.push(`M ${x} ${bl - 2}`)
    segments.push(`L ${x + 2} ${bl + 4}`)
    segments.push(`L ${x + 5} ${bl - 22}`)
    segments.push(`L ${x + 8} ${bl + 5}`)
    segments.push(`L ${x + 12} ${bl}`)
  })

  return segments.join(' ')
}

function buildTVPath(): string {
  const bl = 70
  const segments: string[] = []
  // TV: QRS largos regulares sem P
  for (let i = 0; i < 4; i++) {
    const x0 = 10 + i * 100
    segments.push(`M ${x0} ${bl}`)
    segments.push(`L ${x0 + 5} ${bl - 26}`)
    segments.push(`L ${x0 + 15} ${bl + 8}`)
    segments.push(`L ${x0 + 22} ${bl + 14}`)
    segments.push(`L ${x0 + 32} ${bl - 18}`)
    segments.push(`L ${x0 + 40} ${bl}`)
    segments.push(`L ${x0 + 50} ${bl}`)
  }
  return segments.join(' ')
}

function buildAlternanciaPath(): string {
  const bl = 70
  const segments: string[] = []
  const heights = [24, 12, 24, 12, 24, 12]
  heights.forEach((h, i) => {
    const x0 = 10 + i * 60
    segments.push(`M ${x0} ${bl}`)
    segments.push(`Q ${x0 + 5} ${bl - 7} ${x0 + 10} ${bl}`)
    segments.push(`L ${x0 + 22} ${bl}`)
    segments.push(`L ${x0 + 24} ${bl + 4}`)
    segments.push(`L ${x0 + 28} ${bl - h}`)
    segments.push(`L ${x0 + 32} ${bl + 5}`)
    segments.push(`L ${x0 + 37} ${bl}`)
    segments.push(`Q ${x0 + 44} ${bl - 10} ${x0 + 52} ${bl}`)
  })
  return segments.join(' ')
}

function buildDeWinterPath(): string {
  // J-point infra 2-3mm + ST ascendente em rampa + T alta e simetrica
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 2; i++) {
    const x = 10 + i * 195
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)   // P
    segs.push(`L ${x + 32} ${bl}`)                        // PR
    segs.push(`L ${x + 34} ${bl + 3}`)                    // Q
    segs.push(`L ${x + 38} ${bl - 26}`)                   // R
    segs.push(`L ${x + 42} ${bl + 10}`)                   // J-point 10px abaixo (infra J)
    segs.push(`L ${x + 58} ${bl - 2}`)                    // ST ascendente voltando
    segs.push(`Q ${x + 70} ${bl - 30} ${x + 82} ${bl}`)  // T alta e simetrica
    segs.push(`L ${x + 95} ${bl}`)
  }
  return segs.join(' ')
}

function buildFVPath(): string {
  // Fibrilação ventricular: oscilações caóticas sem QRS identificável
  const bl = 70
  const pts: [number, number][] = [
    [10, bl], [18, bl - 18], [25, bl + 22], [32, bl - 10], [39, bl + 15],
    [45, bl - 28], [51, bl + 8], [57, bl - 16], [63, bl + 24], [69, bl - 12],
    [75, bl + 20], [80, bl - 22], [86, bl + 6], [92, bl - 30], [98, bl + 14],
    [104, bl - 8], [110, bl + 26], [115, bl - 18], [121, bl + 10], [127, bl - 24],
    [133, bl + 16], [138, bl - 10], [144, bl + 22], [150, bl - 14], [156, bl + 8],
    [161, bl - 26], [167, bl + 18], [173, bl - 6], [179, bl + 28], [184, bl - 20],
    [190, bl + 12], [196, bl - 16], [202, bl + 20], [207, bl - 8], [213, bl + 14],
    [219, bl - 24], [225, bl + 10], [230, bl - 18], [236, bl + 22], [242, bl - 12],
    [248, bl + 6], [253, bl - 28], [259, bl + 16], [265, bl - 10], [271, bl + 24],
    [276, bl - 16], [282, bl + 8], [288, bl - 22], [294, bl + 18], [300, bl - 6],
    [305, bl + 20], [311, bl - 14], [317, bl + 10], [323, bl - 26], [329, bl + 12],
    [334, bl - 8], [340, bl + 22], [346, bl - 18], [352, bl + 6], [358, bl - 20],
    [364, bl + 14], [370, bl - 10], [376, bl + 18], [382, bl - 16], [390, bl + 8],
    [398, bl - 12], [410, bl + 4],
  ]
  return `M ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')
}

function buildTorsadesPath(): string {
  // TV polimorfica: QRS alarga e rotaciona de positivo para negativo
  const bl = 70
  const segs: string[] = []
  const beats = [
    { x: 8,   rOff: -28, sOff: 8 },
    { x: 68,  rOff: -20, sOff: 6 },
    { x: 128, rOff: -10, sOff: 3 },
    { x: 188, rOff: 10,  sOff: -3 },
    { x: 248, rOff: 20,  sOff: -6 },
    { x: 308, rOff: 28,  sOff: -8 },
    { x: 368, rOff: 20,  sOff: -5 },
  ]
  beats.forEach(({ x, rOff, sOff }) => {
    segs.push(`M ${x} ${bl}`)
    segs.push(`L ${x + 6} ${bl - rOff * 0.15}`)
    segs.push(`L ${x + 16} ${bl + rOff}`)
    segs.push(`L ${x + 26} ${bl + sOff}`)
    segs.push(`L ${x + 38} ${bl}`)
    // T discordante pequena
    const tDir = rOff < 0 ? 10 : -10
    segs.push(`Q ${x + 48} ${bl + tDir} ${x + 58} ${bl}`)
  })
  return segs.join(' ')
}

function buildEVPath(): string {
  // 2 batimentos sinusais + 1 EV prematuro largo + pausa compensatoria + 1 sinusal
  const bl = 70
  const segs: string[] = []
  const sinus = (x0: number) => [
    `M ${x0} ${bl}`,
    `Q ${x0 + 5} ${bl - 7} ${x0 + 10} ${bl}`,
    `L ${x0 + 28} ${bl}`,
    `L ${x0 + 30} ${bl + 4}`,
    `L ${x0 + 34} ${bl - 24}`,
    `L ${x0 + 37} ${bl + 5}`,
    `L ${x0 + 41} ${bl}`,
    `Q ${x0 + 51} ${bl - 13} ${x0 + 61} ${bl}`,
    `L ${x0 + 75} ${bl}`,
  ].join(' ')

  segs.push(sinus(5))
  segs.push(sinus(105))
  // EV prematuro: sem P, QRS largo e diferente, T discordante
  const ev = 195
  segs.push(`M ${ev} ${bl}`)
  segs.push(`L ${ev + 4} ${bl - 8}`)
  segs.push(`L ${ev + 10} ${bl - 32}`)
  segs.push(`L ${ev + 20} ${bl + 16}`)
  segs.push(`L ${ev + 30} ${bl + 10}`)
  segs.push(`L ${ev + 38} ${bl}`)
  segs.push(`Q ${ev + 48} ${bl + 20} ${ev + 60} ${bl}`) // T negativa (discordante)
  // Pausa compensatoria
  segs.push(`L ${ev + 108} ${bl}`)
  segs.push(sinus(ev + 108))
  return segs.join(' ')
}

function buildHBAEPath(): string {
  // HBAE: QRS estreito, padrao qR em DI/aVL (eixo esquerdo -45 a -90)
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 3; i++) {
    const x = 10 + i * 135
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
    segs.push(`L ${x + 28} ${bl}`)
    segs.push(`L ${x + 30} ${bl + 5}`)    // q pequeno
    segs.push(`L ${x + 34} ${bl - 28}`)   // R alto em DI/aVL
    segs.push(`L ${x + 38} ${bl}`)        // sem S profundo em DI
    segs.push(`Q ${x + 48} ${bl - 13} ${x + 58} ${bl}`)
    segs.push(`L ${x + 75} ${bl}`)
  }
  return segs.join(' ')
}

function buildHBPEPath(): string {
  // HBPE: QRS estreito, padrao rS em DI (eixo direito +90 a +180)
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 3; i++) {
    const x = 10 + i * 135
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
    segs.push(`L ${x + 28} ${bl}`)
    segs.push(`L ${x + 30} ${bl - 8}`)    // r pequeno em DI
    segs.push(`L ${x + 34} ${bl + 22}`)   // S profundo
    segs.push(`L ${x + 38} ${bl}`)
    segs.push(`Q ${x + 48} ${bl + 6} ${x + 58} ${bl}`) // T achata/inverte
    segs.push(`L ${x + 75} ${bl}`)
  }
  return segs.join(' ')
}

function buildBrugadaCovedPath(): string {
  // Brugada tipo 1 coved: r em V1, supra J, descida convexa, T negativa
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 2; i++) {
    const x = 10 + i * 200
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
    segs.push(`L ${x + 30} ${bl}`)
    segs.push(`L ${x + 33} ${bl - 10}`)  // r (BRD incompleto)
    segs.push(`L ${x + 38} ${bl - 24}`)  // supra J ~3mm
    // descida coved: convexa para baixo (curvada descendo para T negativa)
    segs.push(`C ${x + 52} ${bl - 22} ${x + 62} ${bl + 6} ${x + 70} ${bl + 14}`)
    segs.push(`Q ${x + 76} ${bl + 16} ${x + 84} ${bl}`)
    segs.push(`L ${x + 100} ${bl}`)
  }
  return segs.join(' ')
}

function buildPericarditeConvexPath(): string {
  // Pericardite: supra ST CONCAVO (saddle/smile) + depressao PR
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 2; i++) {
    const x = 10 + i * 200
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
    segs.push(`L ${x + 22} ${bl}`)
    segs.push(`L ${x + 32} ${bl + 3}`)    // depressao do PR
    segs.push(`L ${x + 34} ${bl + 4}`)    // Q
    segs.push(`L ${x + 38} ${bl - 22}`)   // R
    segs.push(`L ${x + 42} ${bl - 14}`)   // J-point levemente elevado
    // ST concavo: curva PARA CIMA no meio (saddle-back / smile)
    segs.push(`C ${x + 52} ${bl - 22} ${x + 62} ${bl - 22} ${x + 72} ${bl - 14}`)
    // T alta que se funde suavemente (pericardite tem T alta e T-ST continuo)
    segs.push(`Q ${x + 82} ${bl - 28} ${x + 92} ${bl}`)
    segs.push(`L ${x + 100} ${bl}`)
  }
  return segs.join(' ')
}

function buildMobitz2Path(): string {
  // Mobitz II: PR fixo + P bloqueada subita (sem QRS) + pausa = 2x PP
  const bl = 70
  const pr = 30
  const segs: string[] = []
  const beat = (x0: number) => [
    `M ${x0} ${bl}`,
    `Q ${x0 + 5} ${bl - 7} ${x0 + 10} ${bl}`,
    `L ${x0 + 10 + pr} ${bl}`,
    `L ${x0 + 10 + pr + 2} ${bl + 4}`,
    `L ${x0 + 10 + pr + 6} ${bl - 24}`,
    `L ${x0 + 10 + pr + 9} ${bl + 5}`,
    `L ${x0 + 10 + pr + 14} ${bl}`,
    `Q ${x0 + 10 + pr + 24} ${bl - 12} ${x0 + 10 + pr + 34} ${bl}`,
  ].join(' ')

  segs.push(beat(5))
  segs.push(beat(110))
  // P bloqueada: apenas onda P sem QRS
  segs.push(`M 215 ${bl}`)
  segs.push(`Q 220 ${bl - 7} 225 ${bl}`)
  segs.push(`L ${225 + pr} ${bl}`)
  // pausa (flat ate o proximo ciclo)
  segs.push(`L 320 ${bl}`)
  segs.push(beat(320))
  return segs.join(' ')
}

function buildQTLongoPath(): string {
  // QT prolongado: ST longo + T distante do QRS
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 2; i++) {
    const x = 5 + i * 205
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 7} ${x + 10} ${bl}`)
    segs.push(`L ${x + 30} ${bl}`)
    segs.push(`L ${x + 32} ${bl + 4}`)
    segs.push(`L ${x + 36} ${bl - 26}`)
    segs.push(`L ${x + 39} ${bl + 5}`)
    segs.push(`L ${x + 43} ${bl}`)
    segs.push(`L ${x + 88} ${bl}`)                        // ST longo (45px vs normal 20px)
    segs.push(`Q ${x + 102} ${bl - 15} ${x + 116} ${bl}`) // T broad e distante
    segs.push(`L ${x + 130} ${bl}`)
  }
  return segs.join(' ')
}

function buildBradicardiaPath(): string {
  // Bradicardia sinusal: ECG normal com RR longo (FC ~45 bpm)
  const bl = 70
  const segs: string[] = []
  for (let i = 0; i < 2; i++) {
    const x = 5 + i * 210
    segs.push(`M ${x} ${bl}`)
    segs.push(`Q ${x + 5} ${bl - 8} ${x + 10} ${bl}`)
    segs.push(`L ${x + 30} ${bl}`)
    segs.push(`L ${x + 32} ${bl + 4}`)
    segs.push(`L ${x + 36} ${bl - 26}`)
    segs.push(`L ${x + 39} ${bl + 5}`)
    segs.push(`L ${x + 44} ${bl}`)
    segs.push(`L ${x + 58} ${bl}`)
    segs.push(`Q ${x + 68} ${bl - 14} ${x + 78} ${bl}`)
    segs.push(`L ${x + 210} ${bl}`)                       // linha longa = RR longo
  }
  return segs.join(' ')
}

const LEAD_LABELS: string[] = ['DI', 'DII', 'DIII', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']

export default function ECGStrip({ anomaly }: Props) {
  const path = getWaveformPath(anomaly)
  const { primaryLeads, reciprocalLeads = [] } = anomaly.waveform
  const color = anomaly.color

  return (
    <div style={{ background: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
        Traço Esquemático
      </p>

      {/* Grade ECG */}
      <div style={{ position: 'relative', overflowX: 'auto' }}>
        <svg
          viewBox="0 0 420 140"
          style={{ width: '100%', minWidth: 320, height: 140, display: 'block' }}
          role="img"
          aria-label={`Traço ECG esquemático para ${anomaly.name}`}
        >
          {/* Grade de fundo */}
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fecdd3" strokeWidth="0.4"/>
            </pattern>
            <pattern id="bigGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="url(#smallGrid)"/>
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#fca5a5" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="420" height="140" fill="#fffbf5" rx="6"/>
          <rect width="420" height="140" fill="url(#bigGrid)" rx="6"/>

          {/* Linha de base */}
          <line x1="0" y1="70" x2="420" y2="70" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="4,4"/>

          {/* Traço ECG principal */}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Anotacoes nos achados principais */}
          {anomaly.waveform.findings?.slice(0, 3).map((f, i) => {
            const isPrimary = primaryLeads.includes(f.lead)
            const isReciprocal = reciprocalLeads.includes(f.lead)
            const labelColor = isPrimary ? color : isReciprocal ? '#f59e0b' : '#94a3b8'
            const yPos = 15 + i * 15
            return (
              <g key={i}>
                <rect x="5" y={yPos - 9} width={Math.min((f.label?.length ?? 10) * 5 + 8, 140)} height="12" rx="3"
                  fill={isPrimary ? `${color}22` : '#f1f5f9'} stroke={labelColor} strokeWidth="0.5"/>
                <text x="9" y={yPos} fill={labelColor} fontSize="7.5" fontFamily="monospace">
                  {f.lead}: {f.label ?? f.change}
                </text>
              </g>
            )
          })}

          {/* Legenda reciproco */}
          {reciprocalLeads.length > 0 && (
            <text x="415" y="130" fill="#d97706" fontSize="7" textAnchor="end" fontFamily="monospace">
              reciproco: {reciprocalLeads.slice(0, 3).join(', ')}
            </text>
          )}
        </svg>
      </div>

      {/* Derivações afetadas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
        {LEAD_LABELS.map(lead => {
          const isPrimary = primaryLeads.includes(lead as any)
          const isReciprocal = reciprocalLeads.includes(lead as any)
          return (
            <span
              key={lead}
              style={{
                padding: '2px 7px',
                borderRadius: 4,
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: isPrimary || isReciprocal ? 700 : 400,
                background: isPrimary ? `${color}18` : isReciprocal ? '#fef3c7' : '#f8fafc',
                color: isPrimary ? color : isReciprocal ? '#d97706' : '#94a3b8',
                border: `1px solid ${isPrimary ? `${color}55` : isReciprocal ? '#fcd34d' : '#e2e8f0'}`,
              }}
            >
              {lead}
            </span>
          )
        })}
      </div>
      {reciprocalLeads.length > 0 && (
        <p style={{ color: '#d97706', fontSize: 10, marginTop: 4 }}>
          Em amarelo: derivações com alteração recíproca
        </p>
      )}
    </div>
  )
}

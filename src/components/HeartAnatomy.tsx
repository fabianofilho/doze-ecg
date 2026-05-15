import type { HeartWall } from '../types/ecg'

interface Props {
  wall: HeartWall
  artery?: string
  color: string
}

// Mapeamento parede -> derivacoes
const WALL_LEADS: Record<string, string[]> = {
  'anterior': ['V3', 'V4'],
  'septal': ['V1', 'V2'],
  'lateral': ['V5', 'V6', 'DI', 'aVL'],
  'lateral-alta': ['DI', 'aVL'],
  'inferior': ['DII', 'DIII', 'aVF'],
  'posterior': ['V7-V9', '(espelho V1-V3)'],
  'vd': ['V3R', 'V4R'],
  'anterior-extensa': ['V1-V6', 'DI', 'aVL'],
  'global': ['aVR', 'infra difuso'],
}

const WALL_LABELS: Record<string, string> = {
  'anterior': 'Anterior',
  'septal': 'Septal',
  'lateral': 'Lateral',
  'lateral-alta': 'Lateral Alta',
  'inferior': 'Inferior',
  'posterior': 'Posterior',
  'vd': 'VD',
  'anterior-extensa': 'Anterior Extensa',
  'global': 'Circunferencial',
}

export default function HeartAnatomy({ wall, artery, color }: Props) {
  if (!wall) return null

  const leads = WALL_LEADS[wall] ?? []
  const label = WALL_LABELS[wall] ?? wall

  // Paredes ativas por regiao no SVG do coracao
  const showAnterior = wall === 'anterior' || wall === 'anterior-extensa' || wall === 'septal'
  const showSeptal = wall === 'septal' || wall === 'anterior-extensa'
  const showLateral = wall === 'lateral' || wall === 'lateral-alta' || wall === 'anterior-extensa'
  const showLateralAlta = wall === 'lateral-alta'
  const showInferior = wall === 'inferior'
  const showPosterior = wall === 'posterior'
  const showVD = wall === 'vd'
  const showGlobal = wall === 'global'

  const activeColor = showGlobal ? '#dc2626' : color
  const inactiveColor = '#e8ecf0'
  const strokeColor = '#cbd5e1'

  return (
    <div style={{ background: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
        Anatomia do Coracao
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* SVG do coracao -- vista anterior esquematica */}
        <svg
          viewBox="0 0 200 220"
          style={{ width: 180, minWidth: 140, height: 'auto' }}
          role="img"
          aria-label={`Coracao com parede ${label} destacada`}
        >
          {/* Contorno externo do coracao */}
          <path
            d="M 100 200 C 40 160 10 130 10 90 C 10 55 35 35 65 35 C 80 35 92 42 100 52 C 108 42 120 35 135 35 C 165 35 190 55 190 90 C 190 130 160 160 100 200 Z"
            fill={showGlobal ? `${activeColor}44` : '#f0f4f8'}
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          {/* VD -- lado direito do coracao (anatomico: esquerda no desenho) */}
          <path
            d="M 100 200 C 70 175 40 150 25 120 C 15 100 15 80 25 65 C 35 52 55 45 70 50 C 80 52 90 60 95 75 C 90 100 88 130 95 165 Z"
            fill={showVD ? `${activeColor}88` : showGlobal ? `${activeColor}33` : inactiveColor}
            stroke={showVD ? activeColor : strokeColor}
            strokeWidth={showVD ? 2 : 1}
          />

          {/* VE -- corpo principal */}
          <path
            d="M 100 200 C 115 178 130 158 140 135 C 150 115 155 95 150 75 C 145 58 132 48 118 46 C 108 44 103 50 100 58 C 97 50 93 44 83 46 C 70 48 60 60 62 78 C 65 98 75 125 95 165 Z"
            fill={showGlobal ? `${activeColor}44` : '#e8ecf0'}
            stroke={strokeColor}
            strokeWidth="1"
          />

          {/* Parede anterior -- VE anterior */}
          <path
            d="M 100 58 C 93 44 80 48 70 58 C 62 68 60 85 64 100 C 72 95 82 90 95 92 C 95 80 95 68 100 58 Z"
            fill={showAnterior && !showSeptal ? `${activeColor}88` : showGlobal ? `${activeColor}33` : '#dde3ea'}
            stroke={(showAnterior && !showSeptal) ? activeColor : strokeColor}
            strokeWidth={(showAnterior && !showSeptal) ? 1.5 : 0.8}
          />

          {/* Septo interventricular */}
          <path
            d="M 95 75 C 92 80 90 95 92 115 C 94 130 97 148 100 165 C 103 148 104 130 106 115 C 108 95 108 80 105 75 C 103 68 100 62 97 68 Z"
            fill={showSeptal ? `${activeColor}99` : showGlobal ? `${activeColor}33` : '#d4dae2'}
            stroke={showSeptal ? activeColor : '#b0bec5'}
            strokeWidth={showSeptal ? 1.5 : 0.8}
          />

          {/* Parede lateral */}
          <path
            d="M 105 75 C 115 65 128 55 140 58 C 150 62 155 75 152 92 C 148 108 138 120 125 130 C 115 118 110 100 106 85 Z"
            fill={showLateral ? `${activeColor}88` : showGlobal ? `${activeColor}33` : '#dde3ea'}
            stroke={showLateral ? activeColor : strokeColor}
            strokeWidth={showLateral ? 1.5 : 0.8}
          />

          {/* Parede lateral alta (base lateral) */}
          <path
            d="M 105 58 C 110 48 118 42 128 44 C 138 46 145 55 140 65 C 134 58 122 56 112 60 Z"
            fill={showLateralAlta ? `${activeColor}aa` : showLateral ? `${activeColor}55` : showGlobal ? `${activeColor}33` : '#dde3ea'}
            stroke={showLateralAlta || showLateral ? activeColor : strokeColor}
            strokeWidth={showLateralAlta ? 2 : 0.8}
          />

          {/* Parede inferior / diafragmatica */}
          <path
            d="M 95 165 C 80 175 60 182 45 188 C 55 198 75 205 100 208 C 125 205 145 198 155 188 C 140 182 120 175 105 165 Z"
            fill={showInferior ? `${activeColor}88` : showGlobal ? `${activeColor}33` : '#dde3ea'}
            stroke={showInferior ? activeColor : strokeColor}
            strokeWidth={showInferior ? 1.5 : 0.8}
          />

          {/* Parede posterior (mostrada como base posterior) */}
          <path
            d="M 100 62 C 108 55 118 50 128 54 C 120 50 110 46 100 52 C 90 46 80 50 72 54 C 82 50 92 55 100 62 Z"
            fill={showPosterior ? `${activeColor}88` : showGlobal ? `${activeColor}33` : '#c8d0da'}
            stroke={showPosterior ? activeColor : strokeColor}
            strokeWidth={showPosterior ? 1.5 : 0.8}
          />

          {/* Arteria coronaria direita (CD) */}
          <path
            d="M 65 42 C 35 48 18 65 18 90"
            fill="none"
            stroke={showInferior || showVD ? '#f97316' : '#b0bec5'}
            strokeWidth={showInferior || showVD ? 2.5 : 1}
            strokeDasharray={showInferior || showVD ? undefined : '3,3'}
          />

          {/* Arteria descendente anterior (DA) */}
          <path
            d="M 95 52 L 92 78 L 88 108 L 86 138 L 90 160"
            fill="none"
            stroke={showAnterior || showSeptal ? '#ef4444' : '#b0bec5'}
            strokeWidth={showAnterior || showSeptal ? 2.5 : 1}
            strokeDasharray={showAnterior || showSeptal ? undefined : '3,3'}
          />

          {/* Arteria circunflexa (Cx) */}
          <path
            d="M 105 52 C 118 48 132 50 140 60 C 148 70 148 88 140 100"
            fill="none"
            stroke={showLateral || showLateralAlta ? '#a78bfa' : '#b0bec5'}
            strokeWidth={showLateral || showLateralAlta ? 2.5 : 1}
            strokeDasharray={showLateral || showLateralAlta ? undefined : '3,3'}
          />

          {/* Labels das paredes */}
          {(showAnterior && !showSeptal) && (
            <text x="58" y="82" fill={activeColor} fontSize="7.5" fontWeight="bold" textAnchor="middle">Ant.</text>
          )}
          {showSeptal && (
            <text x="100" y="108" fill={activeColor} fontSize="7" fontWeight="bold" textAnchor="middle">Septo</text>
          )}
          {(showLateral || showLateralAlta) && (
            <text x="142" y="90" fill={activeColor} fontSize="7.5" fontWeight="bold">Lat.</text>
          )}
          {showInferior && (
            <text x="100" y="195" fill={activeColor} fontSize="7.5" fontWeight="bold" textAnchor="middle">Inf.</text>
          )}
          {showVD && (
            <text x="42" y="120" fill={activeColor} fontSize="7.5" fontWeight="bold" textAnchor="middle">VD</text>
          )}
          {showGlobal && (
            <text x="100" y="115" fill={activeColor} fontSize="9" fontWeight="bold" textAnchor="middle">Global</text>
          )}

          {/* Titulo */}
          <text x="100" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="system-ui, sans-serif">Vista anterior</text>
        </svg>

        {/* Informacoes laterais */}
        <div style={{ flex: 1, minWidth: 120 }}>
          {/* Parede afetada */}
          <div style={{
            background: `${activeColor}22`,
            border: `1px solid ${activeColor}55`,
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 8,
          }}>
            <p style={{ color: '#64748b', fontSize: 10, margin: '0 0 2px' }}>Parede afetada</p>
            <p style={{ color: activeColor, fontSize: 14, fontWeight: 700, margin: 0 }}>{label}</p>
          </div>

          {/* Arteria */}
          {artery && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 8,
            }}>
              <p style={{ color: '#64748b', fontSize: 10, margin: '0 0 2px' }}>Arteria culpada</p>
              <p style={{ color: '#0f172a', fontSize: 12, fontWeight: 600, margin: 0 }}>{artery}</p>
            </div>
          )}

          {/* Derivacoes correspondentes */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '8px 12px',
          }}>
            <p style={{ color: '#64748b', fontSize: 10, margin: '0 0 6px' }}>Derivacoes do ECG</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {leads.map(l => (
                <span
                  key={l}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    background: `${activeColor}33`,
                    color: activeColor,
                    border: `1px solid ${activeColor}66`,
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Legenda das arterias */}
          <div style={{ marginTop: 10 }}>
            <p style={{ color: '#94a3b8', fontSize: 9, marginBottom: 4 }}>Legenda arterias:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <LegendItem color="#ef4444" label="DA (LAD)" />
              <LegendItem color="#f97316" label="CD (RCA)" />
              <LegendItem color="#a78bfa" label="Cx (LCx)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 18, height: 2, background: color, borderRadius: 1 }} />
      <span style={{ color: '#94a3b8', fontSize: 9 }}>{label}</span>
    </div>
  )
}

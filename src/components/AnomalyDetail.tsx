import type { Anomaly } from '../types/ecg'
import ECGStrip from './ECGStrip'
import HeartAnatomy from './HeartAnatomy'
import CriteriaCard from './CriteriaCard'

interface Props {
  anomaly: Anomaly
}

export default function AnomalyDetail({ anomaly }: Props) {
  const isIschemia = anomaly.category === 'ischemias'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: `${anomaly.color}11`,
        border: `1px solid ${anomaly.color}33`,
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{
              color: anomaly.color,
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
            }}>
              {anomaly.name}
            </h2>
            {anomaly.timeSensitive && (
              <span style={{
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 10,
                fontWeight: 700,
                background: '#fee2e2',
                color: '#dc2626',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#ef4444',
                  animation: 'pulse 1.5s infinite',
                }} />
                Tempo-sensivel
              </span>
            )}
          </div>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.6, maxWidth: 600 }}>
            {anomaly.description}
          </p>
        </div>
      </div>

      {/* Conteudo principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isIschemia ? '1fr 1fr' : '1fr',
        gap: 16,
      }}>
        {/* ECG */}
        <div>
          <ECGStrip anomaly={anomaly} />
        </div>

        {/* Coracao (apenas isquemias) */}
        {isIschemia && anomaly.heartWall && (
          <div>
            <HeartAnatomy wall={anomaly.heartWall} artery={anomaly.artery} color={anomaly.color} />
          </div>
        )}
      </div>

      {/* Criterios */}
      <CriteriaCard anomaly={anomaly} />
    </div>
  )
}

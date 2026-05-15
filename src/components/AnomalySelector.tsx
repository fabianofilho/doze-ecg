import type { Anomaly } from '../types/ecg'

interface Props {
  anomalies: Anomaly[]
  selected: string | null
  onSelect: (id: string) => void
}

export default function AnomalySelector({ anomalies, selected, onSelect }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      padding: '12px 0',
    }}>
      {anomalies.map(a => {
        const isSelected = a.id === selected
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${isSelected ? a.color : '#e2e8f0'}`,
              background: isSelected ? `${a.color}18` : '#ffffff',
              color: isSelected ? a.color : '#475569',
              fontSize: 13,
              fontWeight: isSelected ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
            }}
          >
            {a.timeSensitive && (
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isSelected ? a.color : '#ef4444',
                flexShrink: 0,
                boxShadow: isSelected ? `0 0 4px ${a.color}` : undefined,
              }} />
            )}
            {a.shortName}
          </button>
        )
      })}
    </div>
  )
}

import type { Anomaly } from '../types/ecg'

interface Props {
  anomaly: Anomaly
}

export default function CriteriaCard({ anomaly }: Props) {
  const { criteria, exceptions, conductaTimeSensitive, color } = anomaly

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Criterios diagnosticos */}
      <Section title="Criterios Diagnosticos" color={color} icon="check">
        {criteria.map((c, i) => (
          <CriterionItem key={i} text={c.text} value={c.value} important={c.important} color={color} />
        ))}
      </Section>

      {/* Excecoes / Armadilhas */}
      {exceptions && exceptions.length > 0 && (
        <Section title="Armadilhas e Excecoes" color="#f59e0b" icon="warning">
          {exceptions.map((e, i) => (
            <CriterionItem key={i} text={e.text} value={e.value} important={e.important} color="#f59e0b" />
          ))}
        </Section>
      )}

      {/* Conduta tempo-sensivel */}
      {conductaTimeSensitive && conductaTimeSensitive.length > 0 && (
        <Section title="Conduta Tempo-Sensivel" color="#ef4444" icon="clock">
          {conductaTimeSensitive.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0' }}>
              <span style={{
                flexShrink: 0,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
              }}>
                {i + 1}
              </span>
              <span style={{ color: '#dc2626', fontSize: 13, lineHeight: 1.5 }}>{c}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({
  title, color, icon, children,
}: {
  title: string
  color: string
  icon: 'check' | 'warning' | 'clock'
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#ffffff',
      border: `1px solid ${color}33`,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        background: `${color}18`,
        borderBottom: `1px solid ${color}33`,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}>
        <SectionIcon type={icon} color={color} />
        <span style={{ color, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </div>
    </div>
  )
}

function SectionIcon({ type, color }: { type: 'check' | 'warning' | 'clock'; color: string }) {
  if (type === 'check') return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke={color} strokeWidth="1.2"/>
      <polyline points="3.5,6.5 5.5,8.5 9.5,4.5" stroke={color} strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (type === 'warning') return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1 L12 12 H1 Z" stroke={color} strokeWidth="1.2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6.5" y1="5.5" x2="6.5" y2="8.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="6.5" cy="10" r="0.6" fill={color}/>
    </svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke={color} strokeWidth="1.2"/>
      <polyline points="6.5,3.5 6.5,6.5 9,8" stroke={color} strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CriterionItem({
  text, value, important, color,
}: {
  text: string
  value?: string
  important?: boolean
  color: string
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '4px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{
        flexShrink: 0,
        width: 6,
        height: 6,
        borderRadius: '50%',
        marginTop: 6,
        background: important ? color : '#cbd5e1',
      }} />
      <span style={{
        color: important ? '#0f172a' : '#64748b',
        fontSize: 13,
        lineHeight: 1.6,
        fontWeight: important ? 500 : 400,
        flex: 1,
      }}>
        {text}
        {value && (
          <span style={{
            marginLeft: 6,
            padding: '1px 6px',
            borderRadius: 4,
            fontSize: 11,
            fontFamily: 'monospace',
            fontWeight: 700,
            background: `${color}22`,
            color,
          }}>
            {value}
          </span>
        )}
      </span>
    </div>
  )
}

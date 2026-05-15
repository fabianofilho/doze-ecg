import { useState, useMemo } from 'react'
import { allAnomalies, categorias } from './data'
import type { Category } from './types/ecg'
import TabNav from './components/TabNav'
import AnomalySelector from './components/AnomalySelector'
import AnomalyDetail from './components/AnomalyDetail'

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('ischemias')
  const [selectedId, setSelectedId] = useState<string>('iamcsst-inferior')

  const counts = useMemo(() => {
    const c = {} as Record<Category, number>
    categorias.forEach(cat => {
      c[cat.id] = allAnomalies.filter(a => a.category === cat.id).length
    })
    return c
  }, [])

  const filtered = useMemo(
    () => allAnomalies.filter(a => a.category === activeCategory),
    [activeCategory]
  )

  const selected = useMemo(
    () => allAnomalies.find(a => a.id === selectedId) ?? filtered[0],
    [selectedId, filtered]
  )

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat)
    const first = allAnomalies.find(a => a.category === cat)
    if (first) setSelectedId(first.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 0 12px',
            borderBottom: '1px solid #f1f5f9',
          }}>
            {/* Logo ECG */}
            <svg width="32" height="20" viewBox="0 0 120 40" fill="none">
              <polyline
                points="0,20 15,20 22,5 30,35 38,10 46,30 54,20 75,20 82,5 90,30 98,15 106,25 120,20"
                stroke="#ef4444"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                ECG Interativo
              </h1>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
                Doze por Oito Cardiologia
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 10,
                background: '#fee2e2',
                color: '#dc2626',
                fontWeight: 600,
              }}>
                {allAnomalies.filter(a => a.timeSensitive).length} tempo-sensiveis
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 10,
                background: '#f1f5f9',
                color: '#64748b',
                fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}>
                {allAnomalies.length} anomalias
              </span>
            </div>
          </div>

          {/* Tab navigation */}
          <TabNav active={activeCategory} onChange={handleCategoryChange} counts={counts} />
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 48px' }}>
        {/* Seletor de anomalias */}
        <div style={{
          borderBottom: '1px solid #e2e8f0',
          marginBottom: 20,
          background: '#ffffff',
          marginLeft: -24,
          marginRight: -24,
          paddingLeft: 24,
          paddingRight: 24,
        }}>
          <AnomalySelector
            anomalies={filtered}
            selected={selectedId}
            onSelect={setSelectedId}
          />
          <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, marginTop: 0 }}>
            Pontos vermelhos = doencas tempo-sensiveis
          </p>
        </div>

        {/* Detalhe da anomalia */}
        {selected && <AnomalyDetail anomaly={selected} />}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

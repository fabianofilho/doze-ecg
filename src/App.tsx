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
        padding: '0 24px',
        background: 'linear-gradient(135deg, #003D6B 0%, #006DB3 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,61,107,0.35)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 0 10px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}>
            {/* Logo Doze por Oito */}
            <img
              src="https://www.dozeporoitocardiologia.com/assets/logo-doze-footer-new-BX-yFShu.svg"
              alt="Doze por Oito Cardiologia"
              style={{ height: 36, width: 'auto', flexShrink: 0 }}
            />
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                ECG Interativo
              </h1>
              <p style={{ margin: 0, fontSize: 11, color: '#93c5fd' }}>
                Educação em Cardiologia
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 10,
                background: 'rgba(255,255,255,0.15)',
                color: '#fca5a5',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                {allAnomalies.filter(a => a.timeSensitive).length} tempo-sensíveis
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 10,
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)',
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
            Pontos vermelhos = doenças tempo-sensíveis
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

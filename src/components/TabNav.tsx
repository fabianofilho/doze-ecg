import { categorias } from '../data'
import type { Category } from '../types/ecg'

interface Props {
  active: Category
  onChange: (cat: Category) => void
  counts: Record<Category, number>
}

export default function TabNav({ active, onChange, counts }: Props) {
  return (
    <nav style={{
      display: 'flex',
      gap: 0,
      borderBottom: '1px solid #e2e8f0',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      {categorias.map(cat => {
        const isActive = cat.id === active
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderBottom: isActive ? `2px solid ${cat.color}` : '2px solid transparent',
              background: isActive ? `${cat.color}11` : 'transparent',
              color: isActive ? cat.color : '#475569',
              fontWeight: isActive ? 700 : 400,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CategoryIcon id={cat.id} color={isActive ? cat.color : '#94a3b8'} />
            {cat.label}
            <span style={{
              padding: '1px 6px',
              borderRadius: 10,
              fontSize: 11,
              background: isActive ? `${cat.color}22` : '#f1f5f9',
              color: isActive ? cat.color : '#94a3b8',
              border: `1px solid ${isActive ? `${cat.color}44` : '#e2e8f0'}`,
              fontWeight: 600,
            }}>
              {counts[cat.id]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function CategoryIcon({ id, color }: { id: Category; color: string }) {
  switch (id) {
    case 'ischemias':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1 C4 1 1 3.5 1 6.5 C1 10 7 14 7 14 C7 14 13 10 13 6.5 C13 3.5 10 1 7 1Z"
            fill={color} opacity="0.8"/>
        </svg>
      )
    case 'bloqueios':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="5" width="12" height="4" rx="1" fill={color} opacity="0.8"/>
          <line x1="4" y1="2" x2="4" y2="5" stroke={color} strokeWidth="1.5"/>
          <line x1="10" y1="2" x2="10" y2="5" stroke={color} strokeWidth="1.5"/>
        </svg>
      )
    case 'arritmias':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <polyline points="1,7 3,7 4,4 6,10 7,2 8,11 9,5 11,7 13,7"
            stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'sindromes':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.5" fill="none"/>
          <line x1="7" y1="4" x2="7" y2="7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="7" cy="9.5" r="0.8" fill={color}/>
        </svg>
      )
  }
}

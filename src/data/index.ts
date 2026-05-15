export { ischemias } from './ischemias'
export { bloqueios } from './bloqueios'
export { arritmias } from './arritmias'
export { sindromes } from './sindromes'

import { ischemias } from './ischemias'
import { bloqueios } from './bloqueios'
import { arritmias } from './arritmias'
import { sindromes } from './sindromes'
import type { Category } from '../types/ecg'

export const allAnomalies = [...ischemias, ...bloqueios, ...arritmias, ...sindromes]

export const categorias: { id: Category; label: string; color: string; bg: string }[] = [
  { id: 'ischemias', label: 'Isquemias', color: '#ef4444', bg: '#450a0a' },
  { id: 'bloqueios', label: 'Bloqueios', color: '#3b82f6', bg: '#172554' },
  { id: 'arritmias', label: 'Arritmias', color: '#8b5cf6', bg: '#2e1065' },
  { id: 'sindromes', label: 'Sindromes', color: '#10b981', bg: '#022c22' },
]

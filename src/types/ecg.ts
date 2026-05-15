export type Category = 'ischemias' | 'bloqueios' | 'arritmias' | 'sindromes'

export type HeartWall =
  | 'anterior'
  | 'septal'
  | 'lateral'
  | 'lateral-alta'
  | 'inferior'
  | 'posterior'
  | 'vd'
  | 'anterior-extensa'
  | 'global'
  | null

export type Lead =
  | 'DI' | 'DII' | 'DIII'
  | 'aVR' | 'aVL' | 'aVF'
  | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6'
  | 'V3R' | 'V4R' | 'V7' | 'V8' | 'V9'

export type EcgChange =
  | 'supra'               // supradesnivelamento ST convexo (STEMI)
  | 'infra'               // infradesnivelamento ST
  | 'q-patologico'
  | 't-invertida'
  | 't-apiculada'
  | 't-bifasica'
  | 'bloqueio-rb'         // right bundle branch block
  | 'bloqueio-lb'         // left bundle branch block
  | 'delta'               // onda delta (WPW)
  | 'pr-longo'            // PR > 200ms
  | 'pr-curto'
  | 'qrs-largo'
  | 'rr-irregular'
  | 'sem-onda-p'
  | 'ondas-f'             // flutter atrial
  | 'dissociacao-av'      // BAV total
  | 'pr-progressivo'      // Wenckebach
  | 'baixa-voltagem'
  | 'alternancia-eletrica'
  | 'normal'
  | 'de-winter'           // J-point infra + ST ascendente + T alta simetrica
  | 'fv'                  // fibrilacao ventricular: caos sem QRS
  | 'torsades'            // TV polimorfica com rotacao do eixo
  | 'ev'                  // extrassistole ventricular: 2 sinusais + EV prematuro + pausa
  | 'eixo-esquerdo'       // HBAE: QRS estreito, qR em DI/aVL
  | 'eixo-direito'        // HBPE: QRS estreito, rS em DI
  | 'brugada-coved'       // morfologia coved: supra J + descida convexa + T negativa
  | 'pericardite-concava' // supra ST concavo (saddle) + depressao PR
  | 'mobitz2'             // PR fixo + P bloqueada subita
  | 'qt-longo'            // QT visivelmente prolongado
  | 'bradicardia'         // ritmo sinusal normal com RR longo

export interface LeadFinding {
  lead: Lead
  change: EcgChange
  label?: string
}

export interface Criterion {
  text: string
  value?: string
  important?: boolean
}

export interface EcgWaveform {
  /** Derivacoes com achado principal */
  primaryLeads: Lead[]
  /** Derivacoes com achado reciproco ou secundario */
  reciprocalLeads?: Lead[]
  mainChange: EcgChange
  reciprocalChange?: EcgChange
  findings?: LeadFinding[]
}

export interface Anomaly {
  id: string
  name: string
  shortName: string
  category: Category
  /** Cor de destaque da categoria */
  color: string
  /** Descricao curta exibida no card */
  description: string
  /** Parede do coracao afetada (apenas isquemias) */
  heartWall?: HeartWall
  /** Arteria responsavel (apenas isquemias) */
  artery?: string
  criteria: Criterion[]
  exceptions?: Criterion[]
  conductaTimeSensitive?: string[]
  waveform: EcgWaveform
  /** Perigo tempo-sensivel */
  timeSensitive: boolean
}

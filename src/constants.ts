import type { Conditions } from './types'

export const STORAGE_KEYS = {
  conditions: 'snow-planner:conditions',
} as const

export const defaultConditions: Conditions = {
  lang: 'en',
  status: 'ug',
  year: '2',
  major: 'Business Administration',
  topik: '3',
  entry: 'after',
  track: 'korean',
  visa: 'd2',
  visaExpiry: '2027-03-10',
}

export const defaultChecklistDone: Record<string, boolean> = {}
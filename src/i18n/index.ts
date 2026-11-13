import type { ViewLang } from '../types'
import en, { type Messages } from './en'
import ko from './ko'
import zh from './zh'
import vi from './vi'
import my from './my'
import mn from './mn'

export type { Messages }

export const messages: Record<ViewLang, Messages> = { en, ko, zh, vi, my, mn }

// 날짜 표시와 <html lang> 에 쓰는 언어 코드
export const LOCALES: Record<ViewLang, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  zh: 'zh-CN',
  vi: 'vi-VN',
  my: 'my-MM',
  mn: 'mn-MN',
}

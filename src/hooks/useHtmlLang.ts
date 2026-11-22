import { useEffect } from 'react'
import { LOCALES } from '../i18n'
import type { ViewLang } from '../types'

// 화면 언어에 맞게 <html lang> 을 변경 (화면 읽기 프로그램·글꼴 선택에 쓰임)
export function useHtmlLang(lang: ViewLang) {
  useEffect(() => {
    document.documentElement.lang = LOCALES[lang]
  }, [lang])
}
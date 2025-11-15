import { format } from "date-fns"
import { pl, enUS, de } from "date-fns/locale"
import type { Locale } from "date-fns/locale"

const localeMap: Record<string, Locale> = {
  pl,
  en: enUS,
  "en-US": enUS,
  de,
}

function getDateLocale(localeCode: string = "pl"): Locale {
  return localeMap[localeCode] || pl
}

export function formatDate({
  date,
  includeTime = false,
  localeCode = "pl",
}: {
  date: string | Date
  includeTime?: boolean
  localeCode?: string
}): string {
  const ensuredDate = new Date(date)

  if (isNaN(ensuredDate.getTime())) {
    return ""
  }

  const locale = getDateLocale(localeCode)
  const timeFormat = includeTime ? "p" : ""

  return format(ensuredDate, `PP ${timeFormat}`, {
    locale,
  })
}

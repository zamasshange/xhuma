"use client"

import { createContext, useContext, useMemo } from "react"
import {
  DEFAULT_REGION,
  getRegionConfig,
  type RegionCode,
  type RegionConfig,
} from "@/lib/region/config"
import {
  formatCurrency as formatCurrencyAmount,
  formatDateLong as formatDateLongForRegion,
  formatDateShort as formatDateShortForRegion,
  formatNumber as formatNumberForRegion,
  formatPriceMonthly as formatPriceMonthlyForRegion,
} from "@/lib/locale"

type RegionContextValue = RegionConfig & {
  formatCurrency: (amount: number, options?: { decimals?: boolean; suffix?: string }) => string
  formatPriceMonthly: (amount: number, annual?: boolean) => string
  formatDateLong: (value: Date | string) => string
  formatDateShort: (value: Date | string) => string
  formatNumber: (value: number) => string
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function RegionProvider({
  region = DEFAULT_REGION,
  children,
}: {
  region?: RegionCode
  children: React.ReactNode
}) {
  const value = useMemo<RegionContextValue>(() => {
    const config = getRegionConfig(region)
    return {
      ...config,
      formatCurrency: (amount, options) => formatCurrencyAmount(amount, config, options),
      formatPriceMonthly: (amount, annual) => formatPriceMonthlyForRegion(amount, config, annual),
      formatDateLong: (value) => formatDateLongForRegion(value, config),
      formatDateShort: (value) => formatDateShortForRegion(value, config),
      formatNumber: (value) => formatNumberForRegion(value, config),
    }
  }, [region])

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext)
  if (!ctx) return buildFallbackRegionValue(DEFAULT_REGION)
  return ctx
}

function buildFallbackRegionValue(region: RegionCode): RegionContextValue {
  const config = getRegionConfig(region)
  return {
    ...config,
    formatCurrency: (amount, options) => formatCurrencyAmount(amount, config, options),
    formatPriceMonthly: (amount, annual) => formatPriceMonthlyForRegion(amount, config, annual),
    formatDateLong: (value) => formatDateLongForRegion(value, config),
    formatDateShort: (value) => formatDateShortForRegion(value, config),
    formatNumber: (value) => formatNumberForRegion(value, config),
  }
}

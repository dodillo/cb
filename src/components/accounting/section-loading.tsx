"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  BarChart4,
  Calculator,
  CreditCard,
  FileSpreadsheet,
  LineChart,
  PieChart,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react"

interface SectionLoadingProps {
  title: string
  description?: string
}

const financeIcons = [
  BarChart4,
  Calculator,
  CreditCard,
  FileSpreadsheet,
  LineChart,
  PieChart,
  Receipt,
  TrendingUp,
  Wallet,
]

const hashSeed = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const seededRandom = (seed: number) => {
  let currentSeed = seed
  return () => {
    let t = (currentSeed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const selectIcons = (seedKey: string) => {
  const random = seededRandom(hashSeed(seedKey))
  const icons = [...financeIcons]

  for (let i = icons.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[icons[i], icons[j]] = [icons[j], icons[i]]
  }

  return icons.slice(0, 3).map((Icon, index) => ({ Icon, id: index }))
}

export function SectionLoading({ title, description }: SectionLoadingProps) {
  const selectedIcons = useMemo(
    () => selectIcons(`${title}-${description ?? ""}`),
    [title, description],
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="flex justify-center mb-8">
        {selectedIcons.map(({ Icon, id }) => (
          <motion.div
            key={id}
            className="mx-4 text-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 1, 0.3],
              rotate: [0, id % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: id * 0.3,
            }}
          >
            <Icon size={48} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        {description && <p className="text-muted-foreground max-w-md">{description}</p>}
      </motion.div>

      <motion.div
        className="mt-8 w-48 h-1.5 bg-muted overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}

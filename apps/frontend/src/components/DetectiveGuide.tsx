import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

type Step = {
  text: string
}

type Props = {
  storageKey: string
  title: string
  steps: Step[]
  primary?: { label: string; to?: string; onClick?: () => void }
  secondary?: { label: string; to?: string; onClick?: () => void }
  visible?: boolean
  onClose?: () => void
  persistDismissal?: boolean
}

export function DetectiveGuide({
  storageKey,
  title,
  steps,
  primary,
  secondary,
  visible = true,
  onClose,
  persistDismissal = true,
}: Props) {
  const [open, setOpen] = React.useState<boolean>(() => {
    if (!persistDismissal) return visible
    const persisted = localStorage.getItem(storageKey)
    return visible && persisted !== 'dismissed'
  })

  // Sync open state when `visible` prop changes
  React.useEffect(() => {
    if (!persistDismissal) {
      setOpen(visible)
      return
    }
    const persisted = localStorage.getItem(storageKey)
    const shouldOpen = visible && persisted !== 'dismissed'
    setOpen(shouldOpen)
  }, [visible, persistDismissal, storageKey])

  function close() {
    if (persistDismissal) {
      localStorage.setItem(storageKey, 'dismissed')
    }
    setOpen(false)
    onClose?.()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/30"
          role="dialog"
          aria-label="Detective guidance"
        >
          <motion.div
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="m-4 w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl" aria-hidden>🕵️‍♀️</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h3>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  {steps.map((s, i) => (
                    <li key={i}>{s.text}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3">
                  {primary && primary.to && (
                    <Link
                      to={primary.to}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      onClick={close}
                    >
                      {primary.label}
                    </Link>
                  )}
                  {primary && primary.onClick && (
                    <button
                      onClick={() => {
                        primary.onClick?.()
                        close()
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {primary.label}
                    </button>
                  )}
                  {secondary && secondary.to && (
                    <Link
                      to={secondary.to}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      onClick={close}
                    >
                      {secondary.label}
                    </Link>
                  )}
                  {secondary && secondary.onClick && (
                    <button
                      onClick={() => {
                        secondary.onClick?.()
                        close()
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {secondary.label}
                    </button>
                  )}
                  {!primary && !secondary && (
                    <button
                      onClick={close}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      Got it
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}





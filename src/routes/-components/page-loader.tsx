import { Loader2Icon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid h-[calc(100dvh-57px)] pb-4 place-items-center"
      >
        <Loader2Icon className="stroke-1 size-12 animate-spin stroke-muted-foreground" />
      </motion.div>
    </AnimatePresence>
  )
}

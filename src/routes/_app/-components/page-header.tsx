import Typography from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { useInView, motion, AnimatePresence } from 'framer-motion'

export default function PageHeader({
  title,
  children,
  actions,
}: {
  children?: React.ReactNode
  title: string
  actions?: React.ReactNode
}) {
  const titleRef = useRef(null)
  const isInView = useInView(titleRef, { margin: '-54px 0px 0px 0px' })
  const pageTitle = 'Exercises'

  return (
    <>
      <div className="container sticky top-0 h-12 bg-background ">
        {actions}
        <AnimatePresence initial={false}>
          {!isInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography
                className="absolute inline font-semibold -translate-x-1/2 top-3 left-1/2"
                as="h1"
              >
                {title}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Typography
        ref={titleRef}
        className="container py-2"
        variant="h1"
        aria-hidden={!isInView}
      >
        {pageTitle}
      </Typography>
      <div
        className={cn(
          'sticky py-3 top-10 bg-background border-b-2 border-transparent transition-colors',
          !isInView && 'border-muted'
        )}
      >
        {children}
      </div>
    </>
  )
}

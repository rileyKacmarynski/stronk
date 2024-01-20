import Typography from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { useInView, motion, AnimatePresence } from 'framer-motion'
import { useHasMounted } from '@/lib/hooks'

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
  const hasMounted = useHasMounted()

  console.log('isInView', isInView)
  console.log('hasMounted', hasMounted)

  return (
    <>
      <div className="container sticky top-0 h-12 bg-background ">
        {actions}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography
            className={cn(
              'absolute inline font-semibold -translate-x-1/2 top-3 left-1/2 transition text-transparent',
              !isInView && hasMounted && 'text-current'
            )}
            aria-hidden={!isInView}
            as="h1"
          >
            {title}
          </Typography>
        </motion.div>
      </div>
      <Typography
        ref={titleRef}
        className="container py-2"
        variant="h1"
        aria-hidden={!isInView}
      >
        {title}
      </Typography>
      <div
        className={cn(
          'sticky top-12 bg-background border-b-2 border-transparent transition-colors',
          !isInView && hasMounted && 'border-muted'
        )}
      >
        {children}
      </div>
    </>
  )
}

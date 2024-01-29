import { Skeleton } from '@/components/ui/skeleton'
import { memo } from 'react'

function SkeletonLoader({ count }: { count?: number }) {
  const items = Array(count ?? 25).fill(0)

  return (
    <ul>
      {items.map((_, i) => (
        <li className="py-2 border-b -z-10 border-border" key={i}>
          <div className="space-y-4">
            <Skeleton
              className="h-5"
              style={{ width: `${getRandomNumber(120, 240)}px` }}
            />
            <div className="flex items-center gap-1 text-muted-foreground">
              <Skeleton
                className="h-3"
                style={{ width: `${getRandomNumber(30, 100)}px` }}
              />
              <Skeleton className="rounded-full size-1" />
              <Skeleton
                className="h-3"
                style={{ width: `${getRandomNumber(30, 100)}px` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

// for some reason tanstack router rerenders this a bunch
export default memo(SkeletonLoader)

function getRandomNumber(min: number, max: number) {
  // Ensure that the bounds are valid numbers
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Both bounds must be numbers')
  }

  // Generate a random number within the specified range
  return Math.floor(Math.random() * (max - min + 1)) + min
}

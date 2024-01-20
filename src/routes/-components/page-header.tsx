import { useTailwindMediaQuery } from "@/lib/utils"
import MobileLayout from "@/routes/-components/mobile-layout"

export type PageHeaderProps = {
  children?: React.ReactNode
  title: string
  actions?: React.ReactNode
  scrollContainer?: React.MutableRefObject<HTMLDivElement | null>
}

export default function PageHeader(props: PageHeaderProps) {

  const matches = useTailwindMediaQuery('md')

  return matches ? undefined : <MobileLayout.PageHeader {...props} />
}
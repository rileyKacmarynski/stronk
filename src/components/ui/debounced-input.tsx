import { Input } from "@/components/ui/input"
import { useDebounce } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function DebouncedInput({
  defaultValue,
  delay,
  onChange,
  className,
  ...rest
}: {
  defaultValue?: string
  delay?: number
  onChange: (value: string) => void | Promise<void>
} & Omit<React.ComponentProps<typeof Input>, 'onChange' | 'defaultValue' | 'value'>) {
  const [searchTemp, setSearchTemp] = useState(defaultValue ?? '')
  const debouncedValue = useDebounce(searchTemp, delay)
  useEffect(() => {
    console.log('debouncing yo', debouncedValue)
    onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <Input
      type="text"
      onChange={(e) => {
        setSearchTemp(e.target.value)
      }}
      value={searchTemp}
      className={cn(
        'transition-colors',
        searchTemp !== debouncedValue && 'text-muted-foreground',
        className
      )}
      {...rest}
    />
  )
}
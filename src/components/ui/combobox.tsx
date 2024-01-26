import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Loader } from '@/routes/-components/page-loader'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useState } from 'react'

export type ComboboxProps = {
  placeholder: string
  emptyText: string
  items: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string | undefined) => void
  isLoading?: boolean
}

export function Combobox({
  placeholder,
  emptyText,
  items,
  value,
  onValueChange,
  isLoading,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[180px] w-full justify-between"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
        >
          {value ? items.find((item) => item.value === value)?.label : placeholder}
          <AnimatePresence initial={false} mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="loading"
              >
                <Loader className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="data"
              >
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[180px] w-full p-0">
        <Command
          filter={(value, search) => {
            const item = items.find((i) => i.value === value)
            return item?.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="overflow-auto max-h-72">
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  if (onValueChange) {
                    onValueChange(currentValue === value ? undefined : currentValue)
                  }
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === item.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

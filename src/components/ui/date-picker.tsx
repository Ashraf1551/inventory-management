"use client"

import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  value?: string
  onChange?: (value: string) => void
  id?: string
  name?: string
  className?: string
  placeholder?: string
}

export function DatePicker({ value, onChange, id, name, className, placeholder = "Pick a date" }: Props) {
  const date = value ? new Date(value + "T00:00:00") : undefined

  function handleSelect(selected: Date | undefined) {
    if (selected) {
      const iso = selected.toISOString().split("T")[0]
      onChange?.(iso)
    }
  }

  return (
    <Popover>
      <input type="hidden" name={name} value={value ?? ""} />
      <PopoverTrigger
        id={id}
        render={
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? date.toLocaleDateString() : <span>{placeholder}</span>}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          captionLayout="dropdown"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

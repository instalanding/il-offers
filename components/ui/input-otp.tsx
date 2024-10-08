import { cn } from "@/lib/utils"
import { SlotProps } from "input-otp"

export function Slot(props: SlotProps) {
  return (
      <div
          className={cn(
              'relative w-10 h-10 text-[1rem]',
              'flex items-center justify-center',
              'transition-all duration-300',
              'border rounded-lg',
              'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
              'outline outline-0 outline-accent-foreground/20',
              { 'outline-1 outline-accent-foreground': props.isActive },
          )}
      >
          {props.char !== null && <div>{props.char}</div>}
          {props.hasFakeCaret && <FakeCaret />}
      </div>
  )
}

export function FakeCaret() {
  return (
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
          <div className="w-px h-4 bg-black" />
      </div>
  )
}

'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, disabled, ...props }, ref) {
    const [visible, setVisible] = React.useState(false)

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          {...props}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          className={cn('pr-10', className)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? (
            <EyeOff className="size-4 shrink-0" aria-hidden />
          ) : (
            <Eye className="size-4 shrink-0" aria-hidden />
          )}
        </Button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }

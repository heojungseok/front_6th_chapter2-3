import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ButtonHTMLAttributes, forwardRef, HTMLAttributes } from "react"

interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
}

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

// 대화상자 컴포넌트들
export const Dialog = DialogPrimitive.Root

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className || ""}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ),
)

export const DialogPortal = DialogPrimitive.Portal
export const DialogOverlay = DialogPrimitive.Overlay

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${className || ""}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
)

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`} {...props} />
)

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, ...props }, ref) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`} ref={ref} {...props} />
))

// displayName 설정
DialogTrigger.displayName = "DialogTrigger"
DialogContent.displayName = DialogPrimitive.Content.displayName
DialogHeader.displayName = "DialogHeader"
DialogTitle.displayName = DialogPrimitive.Title.displayName

import { forwardRef, HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm ${className || ""}`}
    ref={ref}
    {...props}
  />
))

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ""}`} ref={ref} {...props} />
))

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`} ref={ref} {...props} />
))

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div className={`p-6 pt-0 ${className || ""}`} ref={ref} {...props} />
))

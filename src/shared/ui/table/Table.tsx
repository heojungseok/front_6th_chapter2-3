import { forwardRef, HTMLAttributes } from "react"

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  className?: string
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className || ""}`} ref={ref} {...props} />
  </div>
))

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead className={`[&_tr]:border-b ${className || ""}`} ref={ref} {...props} />
))

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className || ""}`} ref={ref} {...props} />
))

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100 ${className || ""}`}
    ref={ref}
    {...props}
  />
))

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className || ""}`}
    ref={ref}
    {...props}
  />
))

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ""}`} ref={ref} {...props} />
))

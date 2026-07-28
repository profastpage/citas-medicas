import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ============================================================
// CitasPro Button — health/medical theme
// ============================================================
// Legibilidad al hacer clic (requisito del usuario):
//   - default (azul médico): en `active` el fondo se aclara y el
//     texto pasa a azul oscuro mUY contrastante.
//   - destructive (rojo): en `active` el fondo se aclara y el
//     texto pasa a rojo oscuro.
//   - secondary, outline, ghost: en `active` el texto pasa a
//     azul médico (color del tema de salud) para feedback claro.
// ============================================================

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: azul médico (sky-500). En hover se oscurece, en
        // active (clic) se aclara a azul cielo y texto azul muy oscuro.
        default:
          "bg-sky-500 text-white shadow-sm hover:bg-sky-600 active:bg-sky-100 active:text-sky-900",
        // Destructive: rojo. En active se aclara y texto rojo oscuro.
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-100 active:text-red-900",
        // Outline: borde + fondo blanco. En hover bg gris claro.
        // En active, texto azul médico (legible sobre el gris claro).
        outline:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-sky-100 active:text-sky-900 active:border-sky-300",
        // Secondary: gris claro. En active, texto azul médico.
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-sky-100 active:text-sky-900",
        // Ghost: transparente. En active, fondo azul claro + texto azul oscuro.
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-sky-100 active:text-sky-900",
        // Link: solo texto azul, subraya en hover.
        link: "text-sky-600 underline-offset-4 hover:underline active:text-sky-900",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

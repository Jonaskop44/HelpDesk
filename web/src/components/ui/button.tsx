import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Button grammar from DESIGN.md → Components → Buttons: pills for actions,
// compact rects for utilities, scale(0.95) as the press state, no shadows.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-[color,background-color,border-color,transform] outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:not-aria-[haspopup]:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // button-primary
        default: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
        // button-secondary-pill
        outline:
          "rounded-full border-primary bg-transparent text-primary hover:bg-primary/5 aria-expanded:bg-primary/5",
        // button-pearl-capsule
        secondary:
          "rounded-md border-3 border-divider bg-secondary text-secondary-foreground hover:bg-muted aria-expanded:bg-muted",
        // button-dark-utility
        utility: "rounded-sm bg-foreground text-background hover:bg-foreground/85",
        ghost:
          "rounded-full hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "rounded-full bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:outline-destructive",
        // text-link
        link: "rounded-xs text-link underline-offset-4 hover:underline",
      },
      size: {
        // 44px tall: DESIGN.md → Touch Targets
        default: "h-11 gap-2 px-5.5 text-body",
        xs: "h-7 gap-1 px-2.5 text-fine-print [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3.75 text-button-utility [&_svg:not([class*='size-'])]:size-3.5",
        // button-store-hero
        lg: "h-12 gap-2 px-7 text-button-large",
        // button-icon-circular
        icon: "size-11 rounded-full",
        "icon-xs":
          "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

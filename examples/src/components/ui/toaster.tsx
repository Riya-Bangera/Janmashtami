import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col space-y-4 max-w-[420px] pointer-events-none">
      {toasts.map(function ({ id, title, description, action, variant, open, ...props }) {
        return (
          <Toast 
            key={id} 
            variant={variant} 
            open={open}
            className="pointer-events-auto"
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </div>
  )
}
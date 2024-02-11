import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'

export default function ConfirmModal({
  children,
  onConfirm,
  title,
  description,
  destructive,
}: {
  children: React.ReactNode
  onConfirm: () => void
  title?: string
  description?: string
  destructive?: boolean
}) {
  const modalTitle = title ?? 'Are you sure?'
  const modalDescription = description ?? "This action can't be undone."

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
          <AlertDialogDescription>{modalDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              destructive ? buttonVariants({ variant: 'destructive' }) : undefined
            }
            onClick={onConfirm}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

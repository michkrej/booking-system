import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { Plan } from '@/utils/interfaces'
import { useEditPlan } from '@/hooks'
import { LoadingButton } from './loadingButton'

type PlanDeleteButtonProps = {
  plan: Plan
}

export const PlanDeleteButton = ({ plan }: PlanDeleteButtonProps) => {
  const { deletePlan, isPending } = useEditPlan()

  const handleDelete = () => {
    deletePlan(plan)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-sn rounded-full p-1 text-primary/60 transition-colors hover:bg-primary/30 hover:text-primary/100">
              <Trash />
            </div>
          </TooltipTrigger>
          <TooltipContent>Radera planering</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Är du helt säker?</DialogTitle>
          <DialogDescription>
            Om du raderar planeringen <b>{plan.label}</b> kommer den att tas bort permanent. Det går
            inte att ångra denna åtgärd.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <LoadingButton
            loading={isPending}
            onClick={() => {
              handleDelete()
            }}
          >
            Radera
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

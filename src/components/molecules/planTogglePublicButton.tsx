import { useEditPlan } from '@/hooks'
import { Plan } from '@/utils/interfaces'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Globe, GlobeLock, Loader } from 'lucide-react'

type PlanTogglePublicButtonProps = {
  plan: Plan
}

export const PlanTogglePublicButton = ({ plan }: PlanTogglePublicButtonProps) => {
  const { togglePublicPlan, isPending } = useEditPlan()
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="text-sn rounded-full p-1 text-primary/60 transition-colors hover:bg-primary/30 hover:text-primary/100"
          onClick={() => togglePublicPlan(plan)}
        >
          {isPending ? <Loader className="animate-spin" /> : null}
          {plan.public && !isPending ? <GlobeLock /> : <Globe />}
        </div>
      </TooltipTrigger>
      <TooltipContent>Gör planering {`${plan.public ? 'privat' : 'publik'}`}</TooltipContent>
    </Tooltip>
  )
}

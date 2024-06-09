import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useEditPlan } from '@/hooks'
import { Plan } from '@/utils/interfaces'
import { useState } from 'react'
import { LoadingButton } from './loadingButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const formSchema = z.object({
  newPlanName: z.string().min(1, 'Du måste ange ett nytt namn för planeringen')
})

type ChangePlanNameModalProps = {
  plan: Plan
}

export const PlanChangeNameButton = ({ plan }: ChangePlanNameModalProps) => {
  const { isPending, changePlanName } = useEditPlan()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPlanName: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    changePlanName(plan, values.newPlanName).then(() => {
      form.reset()
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-sn rounded-full p-1 text-primary/60 transition-colors hover:bg-primary/30 hover:text-primary/100">
              <Pencil />
            </div>
          </TooltipTrigger>
          <TooltipContent>Byt namn på planering</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Byt namn på planering</DialogTitle>
              <DialogDescription>
                Ange ett nytt namn för planeringen <strong>{plan.label}</strong>
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="newPlanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input
                      id="plan-name"
                      type="text"
                      placeholder="Ange ett namn för planeringen"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={isPending} className="mt-4">
                Skapa
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

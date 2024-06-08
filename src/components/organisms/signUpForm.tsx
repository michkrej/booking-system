import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { kårer } from '@/data/committees'
import { kårCommittees, sortAlphabetically } from '@/utils/helpers'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useEmailSignUp } from '@/hooks'
import { Kår } from '@/utils/interfaces'
import { LoadingButton } from '../molecules/loadingButton'

const formSchema = z
  .object({
    username: z.string().min(1, 'Du måste ange ett förnamn'),
    email: z.string().email('Felaktig e-postadress'),
    password: z.string().min(8, 'Lösenordet måste vara minst 8 tecken långt'),
    passwordControl: z.string().min(8, 'Lösenordet måste vara minst 8 tecken långt'),
    kår: z.string().min(1, 'Val av kår saknas'),
    fadderi: z.string().min(1, 'Val av fadderi saknas')
  })
  .refine((data) => data.password === data.passwordControl, {
    message: 'Lösenorden matchar inte',
    path: ['passwordControl']
  })

export const SignUpForm = () => {
  const { signup, isPending } = useEmailSignUp()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordControl: '',
      kår: '',
      fadderi: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    signup(values.email, values.password, values.username, values.fadderi)
  }

  const kårIsOther = form.watch('kår') === 'Övrigt'
  const kårisEmpty = form.watch('kår') === ''

  return (
    <div className="mx-auto grid w-[300px] gap-6 md:w-[450px]">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Skapa konto</h1>
        <p className="text-balance text-muted-foreground">
          Fyll i din information för att skapa ett konto
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...form}>
          <form className="grid gap-4 md:col-span-2" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Förnamn</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="Namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Tips: använd din fadderimejl</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lösenord</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Confirmation Field */}
            <FormField
              control={form.control}
              name="passwordControl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bekräfta lösenord</FormLabel>
                  <FormControl>
                    <Input id="passwordControl" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Kår Select Field */}
            <FormField
              control={form.control}
              name="kår"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kår</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      console.log(val)
                      field.onChange(val)
                      if (val === 'Övrigt') {
                        form.setValue('fadderi', kårer.Övrigt[0].id)
                      } else {
                        form.setValue('fadderi', '')
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kår" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(kårer).map((val) => {
                        return (
                          <SelectItem key={val} value={val}>
                            {val}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Fadderi Select Field */}
            <FormField
              control={form.control}
              name="fadderi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fadderi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={kårIsOther || kårisEmpty}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={'Fadderi'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortAlphabetically(kårCommittees(form.getValues().kår as Kår)).map(
                        (assignee) => (
                          <SelectItem key={assignee.text} value={assignee.id}>
                            {assignee.text}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <LoadingButton loading={isPending} type="submit" className="w-full md:col-span-2">
              Skapa ett konto
            </LoadingButton>
          </form>
        </Form>
        <Button variant="outline" className="w-full md:col-span-2">
          Registrera dig med Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Hade du redan ett konto?{' '}
        <span
          onClick={() => navigate('/', { state: { showSignUp: false } })}
          className="cursor-pointer underline"
        >
          Logga in
        </span>
      </div>
    </div>
  )
}

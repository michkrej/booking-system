import { useEmailLogin } from '@/hooks/useEmailLogin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { LoadingButton } from '@/components/molecules/loadingButton'

const formSchema = z.object({
  email: z.string().min(1, 'E-postadress saknas').email('Felaktig e-postadress'),
  password: z.string().min(8, 'Lösenord saknas')
})

export const LoginForm = () => {
  const { login, isPending } = useEmailLogin()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    login(values.email, values.password)
  }
  return (
    <div className="mx-auto grid w-[300px] gap-6 md:w-[350px]">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Logga in</h1>
        <p className="text-balance text-muted-foreground">
          Ange din e-post och lösenord för att logga in
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
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
            <LoadingButton loading={isPending} className="w-full" type="submit">
              Logga in
            </LoadingButton>
          </form>
        </Form>
        <Button variant="outline" className="w-full">
          Logga in med Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Har du inget konto?{' '}
        <span
          onClick={() => navigate('/', { state: { showSignUp: true } })}
          className="cursor-pointer underline"
        >
          Skapa konto
        </span>
      </div>
    </div>
  )
}

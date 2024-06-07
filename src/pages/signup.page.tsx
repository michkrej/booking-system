import { Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { LoaderCircle, LoaderCircleIcon } from 'lucide-react'
import { Kår } from '@/utils/interfaces'

// Define form schema with password confirmation validation
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

export const SignUpPage = () => {
  const { signup, isPending } = useEmailSignUp()
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    signup(values.email, values.password, values.username, values.fadderi)
  }

  return (
    <div className="flex min-h-screen justify-center items-center w-full">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Skapa konto</CardTitle>
          <CardDescription>
            Fyll i din information för att skapa ett konto, eller använd Google!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Förnamn</FormLabel>
                      <FormControl>
                        <Input id="username" placeholder="Namn" required {...field} />
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
                    <FormItem>
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tips: använd din fadderimejl så att din efterträdare kan använda samma konto
                      </FormDescription>
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
                        <Input id="password" type="password" required {...field} />
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
                        <Input id="passwordControl" type="password" required {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kår" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(kårer).map((val) => (
                            <SelectItem key={val} value={val}>
                              {val}
                            </SelectItem>
                          ))}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Fadderi" />
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
                      <FormDescription>
                        Om du tillhör t.ex. kårledningen använd Övrigt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit Button */}
                <Button type="submit" className="w-full relative" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle className="w-5 h-5 mr-2 animate-spin absolute left-1/4" />
                  ) : null}
                  Skapa ett konto
                </Button>
              </form>
            </Form>
            <Button variant="outline" className="w-full">
              Registrera dig med Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Hade du redan ett konto?{' '}
            <Link to="/" className="underline">
              Logga in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

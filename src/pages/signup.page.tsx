import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { kårer } from '@/data/committees'
import { kårCommittees, sortAlphabetically } from '@/utils/helpers'
import { Comment } from '@/components/ui/comment'

export const SignUpPage = () => {
  return (
    <div className="flex min-h-screen justify-center items-center w-full">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Förnamn</Label>
                <Input id="first-name" placeholder="Max" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Efternamn</Label>
                <Input id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
              <Comment>
                Tips: använd din fadderimejl så att din efterträdare kan använda samma konto
              </Comment>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Bekräfta lösenord</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label>Kår</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Kår" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(kårer).map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Fadderi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Fadderi" />
                </SelectTrigger>
                <SelectContent>
                  {sortAlphabetically(kårCommittees('Consensus')).map((assignee) => (
                    <SelectItem key={assignee.text} value={assignee.id}>
                      {assignee.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Comment>Om du tillhör t.ex. kårledningen använd Övrigt</Comment>
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

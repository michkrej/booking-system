import { CircleUser, Package2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { SiteLogo } from '../atoms/siteLogo'
import { useSignOut } from '@/hooks'

export const Header = () => {
  const { logout } = useSignOut()
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex flex-row items-center gap-4 text-sm font-medium md:gap-5 lg:gap-6">
        <Link to="/dashboard">
          <SiteLogo />
        </Link>
        <div className="h-10 border-r" />
        <Link to="#" className="text-foreground transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Orders
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Products
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Customers
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Analytics
        </Link>
      </nav>
      <div className="flex items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

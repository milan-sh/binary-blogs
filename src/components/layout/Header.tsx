import { MenuIcon, PenLineIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useLogout } from '@/hooks/use-logout'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/store/store'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

function Header() {
  const { status: authStatus, userData } = useAppSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const logout = useLogout()

  //nav items are shown according to the user's status
  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
  ].filter((item) => item.active)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-14 items-center gap-6">
        <Link to="/" aria-label="Binary Blogs home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.slug}
              to={item.slug}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'text-foreground'
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          <div className="hidden items-center gap-1.5 md:flex">
            {authStatus && userData ? (
              <>
                <Button asChild size="lg">
                  <Link to="/add-post">
                    <PenLineIcon data-icon="inline-start" />
                    Write
                  </Link>
                </Button>
                <UserMenu user={userData} />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="lg">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="lg">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.slug}
                    to={item.slug}
                    end
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                        isActive && 'bg-muted text-foreground'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              <Separator />
              <div className="flex flex-col gap-2 px-4">
                {authStatus && userData ? (
                  <>
                    <p className="truncate px-1 text-sm text-muted-foreground">
                      Signed in as <span className="font-medium text-foreground">{userData.name}</span>
                    </p>
                    <Button asChild size="lg" onClick={closeMobile}>
                      <Link to="/add-post">
                        <PenLineIcon data-icon="inline-start" />
                        Write a post
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        closeMobile()
                        void logout()
                      }}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg" onClick={closeMobile}>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" onClick={closeMobile}>
                      <Link to="/login">Log in</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header

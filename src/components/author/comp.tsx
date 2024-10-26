import { useUser } from "@clerk/clerk-react"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MessageCircle } from "lucide-react"

interface NavigationZoneProps {
    id: string
  }
  type UserData = {
    firstName: string
    lastName: string
    imageUrl: string
    bio: string
    teams: string[]
    recentBlogs: { title: string; date: string }[]
  }
function CreatePostButton() {
    return (
      <div>
          <Link href="/new-post" className='mb-2'>
              <Button className='gap-2 flex flex-row'><Plus height={22} />Create Post</Button>
          </Link>
      </div>
    )
  }
export function NavigationZone({ id }: NavigationZoneProps) {
    const { user } = useUser()

    return (
      <nav className="flex px-6 md:px-8 gap-5  justify-between overflow-hidden h-auto border-b">
        <div className='gap-5 flex flex-row '>
            <NavLink href={`/author/${id}`} label="Home" />
            <NavLink href={`/author/${id}/about`} label="About" />
            <NavLink href={`/author/${id}/blogs`} label="Blogs" />
            <NavLink href={`/author/${id}/contact`} label="Contact" />
        </div>
        {
            id === user?.id && (
                <CreatePostButton />
            )
        }
      </nav>
    )
  }
function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname()
    const isActive = pathname === href


  return (
    <Link 
      href={href} 
      className={`
        group pb-2 relative 
        ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}
      `}
    >
      <span className="text-sm font-medium group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
        {label}
      </span>
      <span 
        className={`
          absolute bottom-0 left-0 w-full h-0.5 
          bg-neutral-900 dark:bg-neutral-100 
          transition-transform origin-left
          ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
        `} 
      />
    </Link>
  )
}

export function AuthorSidebar({ userData }: { userData: UserData }) {
    return (
      <div className="flex w-full flex-col bg-card p-6 rounded-r-xl md:p-8 relative gap-6">
        <Avatar className="w-24 h-24 border">
          <AvatarImage src={userData.imageUrl} alt={`${userData.firstName} ${userData.lastName}`} />
          <AvatarFallback>
            <User className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">100k Followers</p>
        </div>
        <div className="space-y-2 pb-4 text-sm flex-col flex w-auto border-b dark:border-neutral-700">
          <p>World Class Author</p>
          <p>Friend of Textuality</p>
        </div>
        <p className="text-sm">{userData.bio}</p>
        <div className="flex gap-3">
          <Button className="flex-1">Follow</Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
export default {NavigationZone, AuthorSidebar}
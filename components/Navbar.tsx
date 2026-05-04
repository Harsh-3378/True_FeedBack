"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, User as UserIcon } from 'lucide-react'

const Navbar = () => {

    const {data: session} = useSession();
    const user = session?.user as User | undefined;
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.push('/')
    }

    const isActive = (path: string) => pathname === path;

  return (
    <nav className='sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-[#2A2A35]'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href="/" className='flex items-center gap-2 group'>
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">TF</span>
          </div>
          <span className='text-lg font-bold text-white group-hover:text-primary transition-colors'>
            True Feedback
          </span>
        </Link>
        
        <div className='flex items-center gap-4'>
          {session ? (
            <>
              {/* Navigation Links */}
              <div className='hidden md:flex items-center gap-2'>
                <Link href='/dashboard'>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:text-white'}`}
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
              
              {/* User Info */}
              <div className='flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10'>
                <div className='flex items-center gap-2'>
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className='text-sm text-gray-300 hidden sm:inline'>
                    {user?.username || user?.email}
                  </span>
                </div>
                
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="h-7 px-2 text-gray-400 hover:text-white hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1.5 hidden sm:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <div className='flex items-center gap-2'>
              <Link href='/sign-in'>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href='/sign-up'>
                <Button 
                  size="sm"
                  className="btn-primary"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

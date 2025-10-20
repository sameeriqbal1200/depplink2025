// app/components/LoginGuard.jsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginGuard() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/en/login' && pathname !== '/ar/login') {
      sessionStorage.setItem('preLoginRoute', pathname)
    }
  }, [pathname])

  return null
}
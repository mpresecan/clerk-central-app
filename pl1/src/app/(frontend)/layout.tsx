import React from 'react'
import { ClerkProvider, UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  description: 'PayloadCMS Application with Centralized Authentication',
  title: 'PayloadCMS App 1',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="p-4 flex justify-between items-center bg-white  dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="font-bold text-lg">PayloadCMS App 1</div>
              <nav className="flex gap-4">
                <Link href="/" className="hover:underline">Home</Link>
                <SignedIn>
                  <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                  <Link href="/profile" className="hover:underline">Profile</Link>
                </SignedIn>
              </nav>
            </div>
            <div>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="redirect" />
              </SignedOut>
            </div>
          </header>
          <main className="p-4">{children}</main>
          <footer className="p-4 text-center text-gray-500 text-sm">
            <p>PayloadCMS App 1 - Using Centralized Clerk Authentication</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}

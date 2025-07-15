import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Centralized Authentication Server',
  description: 'Primary authentication server for PayloadCMS applications',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Define the allowed redirect origins for satellite applications
  const allowedOrigins = [
    // Add the satellite application domains
    'http://localhost:3001', // pl1 local development
    'http://localhost:3002', // pl2 local development
    // Add production domains when deployed
    process.env.NEXT_PUBLIC_PL1_URL,
    process.env.NEXT_PUBLIC_PL2_URL,
  ].filter((origin): origin is string => Boolean(origin)); // Filter out undefined values

  return (
    <ClerkProvider
      // Configure allowed redirect origins for satellite applications
      allowedRedirectOrigins={allowedOrigins}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
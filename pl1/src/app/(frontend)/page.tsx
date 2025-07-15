import { currentUser } from '@clerk/nextjs/server'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import './styles.css'

export default async function HomePage() {
  const user = await currentUser()

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
            className="mx-auto mb-4"
          />
        </picture>
        <h1 className="text-4xl font-bold mb-4">PayloadCMS App 1</h1>
        <p className="text-gray-600 mb-6">
          Integrated with Centralized Clerk Authentication
        </p>
      </div>

      <SignedOut>
        <div className="bg-blue-50 dark:bg-blue-800/20 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p className="mb-4">
            This application uses centralized authentication. Sign in to access protected features.
          </p>
          <p className="text-sm text-gray-600">
            Authentication is handled by the central auth server at localhost:3000
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="bg-green-50 dark:bg-green-800/50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, {user?.firstName || 'User'}!</h2>
          <p className="mb-4">
            You are authenticated via the centralized Clerk authentication system.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/profile"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              Manage Profile
            </Link>
          </div>
        </div>
      </SignedIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">PayloadCMS Admin</h3>
          <p className="mb-4 text-gray-600">
            Access the PayloadCMS admin panel (separate authentication).
          </p>
          <a
            href="/admin"
            className="text-blue-600 hover:text-blue-800 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Admin Panel →
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Documentation</h3>
          <p className="mb-4 text-gray-600">
            Learn more about PayloadCMS and Clerk integration.
          </p>
          <a
            href="https://payloadcms.com/docs"
            className="text-blue-600 hover:text-blue-800 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Documentation →
          </a>
        </div>
      </div>
    </div>
  )
}

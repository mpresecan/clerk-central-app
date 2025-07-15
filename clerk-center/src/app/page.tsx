import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Centralized Authentication Server</h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Primary Authentication Hub</h2>
          <p className="mb-6 text-gray-600">
            This is the central authentication server that manages user identities for all connected applications.
            Sign in once here to access all satellite applications without re-authenticating.
          </p>

          <SignedIn>
            <div className="bg-green-50 bg-green-50 dark:bg-green-800/50 border border-green-200 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium text-green-800">You are signed in</h3>
              <p className="text-green-600">
                You can now access any of the connected satellite applications.
              </p>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex gap-4 justify-center mb-6">
              <Link
                href="/sign-in"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">PayloadCMS App 1</h3>
            <p className="text-gray-600 mb-4">
              Access the first PayloadCMS application using your centralized authentication.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_PL1_URL || 'http://localhost:3001'}
              className="text-blue-600 hover:text-blue-800 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Application →
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">PayloadCMS App 2</h3>
            <p className="text-gray-600 mb-4">
              Access the second PayloadCMS application using your centralized authentication.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_PL2_URL || 'http://localhost:3002'}
              className="text-blue-600 hover:text-blue-800 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Application →
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Centralized Authentication System</p>
      </footer>
    </div>
  );
}

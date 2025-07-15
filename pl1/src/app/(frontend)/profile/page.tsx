import { UserProfile } from '@clerk/nextjs';
import React from 'react';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="mb-6 text-gray-600">
          Manage your profile information through the centralized authentication system.
        </p>
        
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0"
            },
          }}
        />
      </div>
    </div>
  );
}

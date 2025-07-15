import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

export default async function DashboardPage() {
  // This page is protected by the middleware
  // Only authenticated users can access it
  const user = await currentUser();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      
      <div className="bg-white  dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName || 'User'}</h2>
        <p className="mb-4">
          This is a protected page in PayloadCMS App 2 that can only be accessed by authenticated users.
          Authentication is handled by the centralized Clerk authentication server.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-purple-800 mb-2">Your Profile Information</h3>
          <ul className="space-y-2">
            <li><strong>User ID:</strong> {user?.id}</li>
            <li><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</li>
            <li><strong>Name:</strong> {user?.firstName} {user?.lastName}</li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">App 2 Features</h3>
          <p className="text-gray-600">
            Features specific to PayloadCMS App 2 would be displayed here.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          <p className="text-gray-600">
            User settings for App 2, with data stored in PayloadCMS.
          </p>
        </div>
      </div>
    </div>
  );
}

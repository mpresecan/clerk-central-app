import type { CollectionConfig } from 'payload'

export const FrontendUsers: CollectionConfig = {
  slug: 'frontend-users',
  admin: {
    useAsTitle: 'clerkId',
    description: 'Front-end users authenticated via Clerk (stores only Clerk ID)',
  },
  // No built-in auth since this is managed by Clerk
  auth: false,
  fields: [
    {
      name: 'clerkId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Clerk user ID - all other user data is stored in Clerk',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address from Clerk (for reference)',
      },
    },
    // Add any application-specific fields here that aren't stored in Clerk
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'newsletter',
          type: 'checkbox',
          defaultValue: false,
          label: 'Subscribe to newsletter',
        },
      ],
    },
  ],
}

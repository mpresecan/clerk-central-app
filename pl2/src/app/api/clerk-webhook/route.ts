import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';
  
  if (!webhookSecret) {
    return new Response('Error: Missing webhook secret', {
      status: 500,
    });
  }

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  // Get the event type
  const eventType = evt.type;

  // Initialize Payload
  const payload_cms = await getPayload({ config: await config });

  // Handle the event
  try {
    if (eventType === 'user.created') {
      // Create a new frontend user in PayloadCMS
      const { id: clerkId, email_addresses } = evt.data;
      
      // Check if user already exists
      const existingUsers = await payload_cms.find({
        collection: 'frontend-users',
        where: {
          clerkId: { equals: clerkId },
        },
      });

      if (existingUsers.docs.length === 0) {
        // Create new user
        await payload_cms.create({
          collection: 'frontend-users',
          data: {
            clerkId,
            email: email_addresses[0]?.email_address || '',
          },
        });
      }
    } 
    else if (eventType === 'user.deleted') {
      // Delete the frontend user from PayloadCMS
      const { id: clerkId } = evt.data;
      
      // Find the user
      const existingUsers = await payload_cms.find({
        collection: 'frontend-users',
        where: {
          clerkId: { equals: clerkId },
        },
      });

      if (existingUsers.docs.length > 0) {
        // Delete the user
        await payload_cms.delete({
          collection: 'frontend-users',
          id: existingUsers.docs[0].id,
        });
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}

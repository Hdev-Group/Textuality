import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created":
        try {
          console.log('Sending welcome email to', event.data.email_addresses[0].email_address);
          const response = await fetch('http://localhost:3000/api/support/restricted/email/startsupport', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SECURE_TOKEN}`
            },
            body: JSON.stringify({ 
              email: event.data.email_addresses[0].email_address, 
              firstName: event.data.first_name, 
              lastName: event.data.last_name, 
              type: "welcome" 
            })
          });
        
          if (!response.ok) {
            console.error('Error from API:', await response.text());
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
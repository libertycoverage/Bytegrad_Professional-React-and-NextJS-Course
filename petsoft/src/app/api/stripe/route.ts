import prisma from "@/lib/db";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // V395

export async function POST(request: Request) {
    //const body = await request.text(); // V389
    //const stripeData = await request.json(); // V395
    const stripeBodyData = await request.text(); // V395
    const signature = request.headers.get("stripe-signature"); // V395

    console.log(stripeBodyData); // is visible in server
    //return new Response('OK', {status: 200}); // V391
    
    // verify webhook came from Stripe
    let event; // V395
    try {
      event = stripe.webhooks.constructEvent(stripeBodyData, signature, process.env.STRIPE_WEBHOOK_SECRET); // V395
    } catch (error) {
     //return Response.json({ error: error.message }, {status: 400}); // V395
     console.log("Webhook verification failed", error); // V395
     return Response.json( null, {status: 400}); // V395

     // fulfill order
     switch (event.type) {
       case "checkout.session.completed":
            // fulfill order
         await prisma?.user.update({
           where: {
           	//email: stripeData.data.object.customer_email,
             email: event.data.object.customer_email,
           }, // V392
           data: {
             hasAccess: true,
           }, // V392
         }); // V392
         break;
      default:
        console.log(`Unhandled event type ${event.type}`);    
     }
    } // V395


    // return 200 OK
    return Response.json(null, { status: 200 }); // V391
} // V389
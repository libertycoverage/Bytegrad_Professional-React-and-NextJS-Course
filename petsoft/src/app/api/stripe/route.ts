import prisma from "@/lib/db";

export async function POST(request: Request) {
    //const body = await request.text(); // V389
    const stripeData = await request.json();

    console.log(stripeData); // is visible in server
    //return new Response('OK', {status: 200}); // V391
    
    // verify webhook came from Stripe

    // fulfill order
    await prisma?.user.update({
        where: {
            email: stripeData.data.object.customer_email
        }, // V392
        data: {
            hasAccess: true,
        }, // V392
    }); // V392

    // return 200 OK
    return Response.json(null, { status: 200 }); // V391
} // V389
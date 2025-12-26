export async function POST(request: Request) {
    const body = await request.text(); // V389
    console.log(body); // is visible in server
    //return new Response('OK', {status: 200}); // V391
    
    // return 200 OK
    return Response.json(null, { status: 200 }); // V391
} // V389
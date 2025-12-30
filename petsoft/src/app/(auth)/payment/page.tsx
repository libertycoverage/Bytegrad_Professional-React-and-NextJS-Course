"use client";

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1'
import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react'
import { useSession } from "next-auth/react"; 
import { useRouter } from 'next/navigation';

//export default function Page() { // V382
export default function Page({ searchParams }: {searchParams: { [key: string]: string | string[] | undefined }}) {  // V382
  //console.log(searchParams);  // V382
  const [isPending, startTransition] = useTransition(); //V384
  
  const { data: session, update, status } = useSession(); // V393 // V394
  const router = useRouter(); //

  return (
    <main className="flex flex-col items-center space-y-10">
        <H1>PetSoft access requires payment</H1>

        {searchParams.success && (
          <Button onClick={async() => {
            await update(true); // V393
            router.push('/app/dashboard'); // V393
          }}
          disabled={status === "loading" || session?.user.hasAccess} // V394
          >
            Access PetSoft
          </Button>
        )} 

        {
          !searchParams.success && (
            <Button 
            disabled={isPending}  
            onClick={async () => {
              startTransition(async () => { 
                 await createCheckoutSession(); //V384
              }); //V384
              // V381
            }}>Buy lifetime access for $299</Button>
          ) // V382
        } 

        {
          searchParams.success && (<p className="test-sm text-green-700">Payment successful! You now have lifetime access to PetSoft.</p>)
        } 
        {/* V382 */}

        {
          searchParams.cancelled && (
            <p className="test-sm text-red-700">Payment cancelled. You can try again.</p>
          )
        }
        {/* V383 */}
    </main>
  ) 
} // V379

"use client";

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1'
import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react'

//export default function Page() { // V382
export default function Page({ searchParams }) {  // V382
  //console.log(searchParams);  // V382
  const [isPending, startTransition] = useTransition(); //V384

  return (
    <main className="flex flex-col items-center space-y-10">
        <H1>PetSoft access requires payment</H1>
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

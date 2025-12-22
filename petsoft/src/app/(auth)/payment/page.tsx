"use client";

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1'
import { Button } from '@/components/ui/button';
import React from 'react'

export default function Page() {
  return (
    <main className="flex flex-col items-center space-y-10">
        <H1>PetSoft access requires payment</H1>
        <Button onClick={async () => {
          await createCheckoutSession(); // V381
        }}>Buy lifetime access for $299</Button>
    </main>
  ) 
} // V379

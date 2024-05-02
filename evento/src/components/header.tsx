import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header>
        <Link href="/">Home</Link>
        <Link href="/events/all">All Events</Link>
    </header>
  )
}

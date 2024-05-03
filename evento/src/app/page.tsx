import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <main>
    <h1>Find events around you</h1>
    <p>Browse more than 10,000 events around you</p>

    {/* We want input field wrapped in the form */}
    <form> 
      <input placeholder="Search events in any city..." spellCheck={false}/>
    </form>

    <section>
      <p>Popular:</p>
      <div>
        <Link href="/events/austin">Austin</Link>
        <Link href="/events/seattle">Seattle</Link>
      </div>
    </section>
  </main>;
}

import React from "react";

export default function Stats({
  //numberOfCharacters,
  //instagramCharactersLeft,
  //facebookCharactersLeft,
  //numberOfWords,
  stats,
}) {
  return (
    <section className="stats">
      <Stat label="Words" number={stats.numberOfWords} />
      <Stat label="Characters" number={stats.numberOfCharacters} />
      <Stat label="Instagram" number={stats.instagramCharactersLeft} />
      <Stat label="Facebook" number={stats.facebookCharactersLeft} />
    </section>
  );
}

//we do not have to write export in front of this, component Stat is embedded into components Stats
function Stat({ label, number }) {
  return (
    <section className="stat">
      {/*<span className="stat__number">{number}</span> */}
      {/* we convert it to temp literals with back ticks `` we ned curly braces because it is javascript feature*/}
      {/* when we exceed that limit in instagram counter we want minus numbers to be red */}
      <span
        className={`stat__number ${number < 0 ? "stat__number--limit" : ""}`}
      >
        {number}
      </span>
      <h2 className="second-heading">{label}</h2>
    </section>
  );
}

{
  /* <section className="stat">
        <span className="stat__number">0</span>
        <h2 className="second-heading">Characters</h2>
      </section>
      <section className="stat">
        <span className="stat__number">280</span>
        <h2 className="second-heading">Instagram</h2>
      </section>
      <section className="stat">
        <span className="stat__number">2200</span>
        <h2 className="second-heading">Facebook</h2>
      </section>
     */
}

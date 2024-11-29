"use client";

import { useSearchContext } from "@/lib/hooks";
import { useState } from "react";

export default function SearchForm() {
  //const [searchQuery, setSearchQuery] = useState('');
  const { searchQuery, handleChangeSearchQuery} = useSearchContext();

  return (
    <form className="w-full h-full">
      <input className="w-full h-full bg-white/20 rounded-md px-5 outline-none focus:bg-white/50 transition hover:bg-white/30 placeholder:text-white/50" 
      placeholder="Search pets"
      type="search"
      //value={searchQuery}
      //onChange={(e) => setSearchQuery(e.target.value)} />
      onChange={(e) => handleChangeSearchQuery(e.target.value)} />
    </form>
  );
}

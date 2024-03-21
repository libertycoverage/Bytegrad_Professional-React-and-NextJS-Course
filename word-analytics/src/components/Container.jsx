import React, { useState } from "react";
import Textarea from "./Textarea";
import Stats from "./Stats";
import {
  FACEBOOK_MAX_CHARACTERS,
  INSTAGRAM_MAX_CHARACTERS,
} from "../lib/constants";

export default function Container() {
  const [text, setText] = useState("");
  //github Copilot is really good at these algorithm type of problems
  //const numberOfWords = text.split(/\s/).filter((word) => word !== "").length;
  // takes all written text, splits it by the space it will actually gives an array of all of the words
  // that array may also have empty strings, so we wanna remove the empty strings
  //then we take the length of the array of words, number of elements of that array (words)
  //const numberOfCharacters = text.length;
  //const instagramCharactersLeft = 280 - numberOfCharacters;
  //const facebookCharactersLeft = 2200 - numberOfCharacters;

  //to shrink the number of passed props numberOfCharacters, instagramCharactersLeft, facebookCharactersLeft, numberOfWords,
  //we can also make an object, the name of the key is the same name as the value
  const stats = {
    //numberOfWords: numberOfWords,
    numberOfWords: text.split(/\s/).filter((word) => word !== "").length,
    //numberOfCharacters: numberOfCharacters,
    numberOfCharacters: text.length,
    //instagramCharactersLeft: instagramCharactersLeft,
    instagramCharactersLeft: INSTAGRAM_MAX_CHARACTERS - text.length,
    //facebookCharactersLeft: facebookCharactersLeft,
    facebookCharactersLeft: FACEBOOK_MAX_CHARACTERS - text.length,
    // we moved hardcoded values as here to constants.js
  };

  return (
    <main className="container">
      <Textarea text={text} setText={setText} />
      <Stats
        //numberOfCharacters={numberOfCharacters}
        //instagramCharactersLeft={instagramCharactersLeft}
        //facebookCharactersLeft={facebookCharactersLeft}
        //numberOfWords={numberOfWords}
        stats={stats}
      />
    </main>
  );
}

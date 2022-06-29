import React from "react";
import FlipCard from "./FlipCard";

const FlipCardsGrid = ({ words }) => {
  return (
    <div className='row'>
      {words.map((word) => (
        <FlipCard word={word} key={word._id} />
      ))}
    </div>
  );
};

export default FlipCardsGrid;

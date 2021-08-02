// (Durstenfeld) Shuffle algortihm. Shuffles array of ids (with ids 1 to 52)
// Src: https://www.dstromberg.com/2019/02/tutorial-create-and-shuffle-a-pile-of-cards-in-javascript/
function shuffleArray(input) {
  const output = input.concat();
  var jdx, tmp, idx;
  for (idx = output.length - 1; idx > 0; idx--) {
    jdx = Math.floor(Math.random() * (idx + 1));
    tmp = output[idx];
    output[idx] = output[jdx];
    output[jdx] = tmp;
  }
  return output;
}

// Move id to array[0]
function cardToString(card) {
  return `${card.rank} of ${card.suit}`;
}

export { shuffleArray, cardToString };

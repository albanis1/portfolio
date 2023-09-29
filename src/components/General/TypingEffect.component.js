import React, { useState, useEffect } from 'react';

const TypingEffect = ({text}) => {
    const words = ["work.","eat.", "sleep.", "code.", "repeat."];
  const LETTER_TYPE_DELAY = 75;
  const WORD_STAY_DELAY = 2000;

  const DIRECTION_FORWARDS = 0;
  const DIRECTION_BACKWARDS = 1;

  const [direction, setDirection] = useState(DIRECTION_FORWARDS);
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const wordTypeInterval = setInterval(typeLetter, LETTER_TYPE_DELAY);

    return () => {
      clearInterval(wordTypeInterval);
    };
  }, [direction, letterIndex]);

  const typeLetter = () => {
    const word = words[wordIndex];

    if (direction === DIRECTION_FORWARDS) {
      setLetterIndex((prevLetterIndex) => prevLetterIndex + 1);

      if (letterIndex === word.length) {
        setDirection(DIRECTION_BACKWARDS);
        setTimeout(startTyping, WORD_STAY_DELAY);
      }
    } else if (direction === DIRECTION_BACKWARDS) {
      setLetterIndex((prevLetterIndex) => prevLetterIndex - 1);

      if (letterIndex === 0) {
        nextWord();
      }
    }

    const textToType = word.substring(0, letterIndex);

    setDisplayText(textToType);
  };

  const nextWord = () => {
    setLetterIndex(0);
    setDirection(DIRECTION_FORWARDS);
    setWordIndex((prevWordIndex) => (prevWordIndex + 1) % words.length);
  };

  const startTyping = () => {
    setDirection(DIRECTION_FORWARDS);
  };

  return (
    <div>
      <p className="typing-text">{displayText}</p>
    </div>
  );
}

export default TypingEffect
import React, { useState, useEffect } from 'react';
import { Timer, Wallet, Award } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const words = ['JAVASCRIPT', 'REACT', 'BLOCKCHAIN', 'CRYPTO', 'GAMING'];

const HangmanGame = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [showClaim, setShowClaim] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Keyboard input handler effect
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameState !== 'playing') return;
      
      const key = event.key.toUpperCase();
      // Check if the pressed key is a letter and hasn't been guessed yet
      if (/^[A-Z]$/.test(key) && !guessedLetters.has(key)) {
        handleGuess(key);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, guessedLetters, word]); // Dependencies for the effect

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setMistakes(0);
    setGameState('playing');
    setTimeElapsed(0);
    setShowClaim(false);
  };

  const calculateTokens = () => {
    // Base tokens for winning
    let baseTokens = 100;
    // Bonus tokens for speed (more tokens for faster completion)
    const speedBonus = Math.max(0, 300 - timeElapsed);
    // Penalty for mistakes
    const mistakePenalty = mistakes * 10;
    
    return Math.max(0, baseTokens + speedBonus - mistakePenalty);
  };

  const handleGuess = (letter) => {
    if (gameState !== 'playing') return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 6) {
        setGameState('lost');
      }
    }

    // Check for win
    const wordArray = word.split('');
    if (wordArray.every(letter => newGuessedLetters.has(letter))) {
      setGameState('won');
      setTokens(calculateTokens());
      setShowClaim(true);
    }
  };

  const getMaskedWord = () => {
    return word
      .split('')
      .map(letter => guessedLetters.has(letter) ? letter : '_')
      .join(' ');
  };

  const handleClaim = () => {
    alert(`Claimed ${tokens} tokens!`);
    setShowClaim(false);
  };

  // Generate keyboard
  const keyboard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
    <button
      key={letter}
      onClick={() => handleGuess(letter)}
      disabled={guessedLetters.has(letter) || gameState !== 'playing'}
      className={`m-1 p-2 rounded ${
        guessedLetters.has(letter)
          ? 'bg-gray-300'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      } transition-all duration-200 transform hover:scale-105`}
    >
      {letter}
    </button>
  ));

  // Hangman figure (simplified animation states)
  const hangmanStates = [
    'O',      // Head
    '|',      // Body
    '/',      // Left arm
    '\\',     // Right arm
    '/',      // Left leg
    '\\',     // Right leg
  ].slice(0, mistakes);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold text-blue-600">Hangman Game</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Timer className="text-gray-600" />
            <span>{timeElapsed}s</span>
          </div>
          <button className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded">
            <Wallet />
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Game Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Instructions */}
        <div className="text-center text-gray-600 mb-4">
          Type any letter on your keyboard or click the buttons below to guess
        </div>

        {/* Hangman Figure */}
        <div className="text-center mb-8 font-mono text-4xl space-y-2">
          {hangmanStates.map((part, index) => (
            <div
              key={index}
              className="animate-bounce-in"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {part}
            </div>
          ))}
        </div>

        {/* Word Display */}
        <div className="text-4xl text-center font-mono mb-8">
          {getMaskedWord()}
        </div>

        {/* Keyboard */}
        <div className="flex flex-wrap justify-center gap-1 mb-8">
          {keyboard}
        </div>

        {/* Game Status */}
        {gameState !== 'playing' && (
          <Alert className="mb-4">
            <AlertDescription>
              {gameState === 'won' 
                ? `Congratulations! You won in ${timeElapsed} seconds!` 
                : 'Game Over! Try again!'}
            </AlertDescription>
          </Alert>
        )}

        {/* Claim Button */}
        {showClaim && (
          <div className="text-center">
            <button
              onClick={handleClaim}
              className="flex items-center gap-2 mx-auto bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition-colors"
            >
              <Award />
              Claim {tokens} Tokens
            </button>
          </div>
        )}

        {/* New Game Button */}
        <button
          onClick={startNewGame}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg mx-auto block hover:bg-blue-600 transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default HangmanGame;
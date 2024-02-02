import React, { useState } from 'react';
import Board from './Board';

const Game = () => {
    const [squares, setSquares] = useState(Array(19 * 19).fill(null));

    const handleClick = (index) => {
    // Update squares array based on user's move
    const newSquares = [...squares];
    newSquares[index] = 'X'; // or 'O', depending on the player
    setSquares(newSquares);
    };

    return (
        <div className="game">
            <Board squares={squares} onClick={handleClick} />
        </div>
    );
};

export default Game;
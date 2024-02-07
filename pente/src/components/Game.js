import React, { useState } from 'react';
import Board from './Board';

import '../Button.css';

const Game = () => {
    const [squares, setSquares] = useState(Array(39 * 39).fill(null));
    const [boardSize, setBoardSize] = useState(39);
    let gameMode = 0;

    const handleSquareClick = (index) => {
        // Update squares array based on user's move
        const newSquares = [...squares];
        newSquares[index] = 'X'; // or 'O', depending on the player
        setSquares(newSquares);
    };

    const handleRestartGame = () =>
    {
        setSquares(Array(boardSize * boardSize).fill(null));
    }

    const handleStartGame = () => { // this doesnt work at all lol
        document.getElementById("Game").innerHTML = `<div className="game">
        <Board squares={squares} onClick={handleSquareClick} />
    </div>`
    }
    
    const updateSize = () => { // this is terrible but it works
        let size = document.getElementById("BoardSize").value; // get the value from the slider
        setBoardSize(size); // set the board size
        setSquares(Array(size * size).fill(null)); // set the 2d array
        document.getElementById("board").setAttribute("style", "grid-template-columns: repeat(" + size + ", 40px)"); // fix the style of the 2d array so its a square
    }

    return (
        <div id="Game">
            <div className="slidercontainer">
                <input type="range" max="39" min="9" class="slider" id="BoardSize" onChange={updateSize}/>
            </div>
            <div id="SizeText">
                {boardSize}
            </div>
            <div className="button" onClick={handleStartGame}>
                Start Game
            </div>
            <div className="button" onClick={handleRestartGame}>
                Restart Game
            </div>
            <div className="game">
                <Board squares={squares} onClick={handleSquareClick} />
            </div>
        </div>
    );
};

export default Game;
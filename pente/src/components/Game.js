import React, { useState } from 'react';
import Board from './Board';

import '../Button.css';
import { useLocation } from 'react-router-dom';

const Game = () => {
    const [squares, setSquares] = useState(Array(39 * 39).fill(null));
    const [boardSize, setBoardSize] = useState(39);
    const [turn, setTurn] = useState(true);
    const [gameMode, setGameMode] = useState(false);
    
    const handleSquareClick = (index) => {
        // Update squares array based on user's move
        const newSquares = [...squares];
        if (gameMode === false) // pvp functionality
        {
            if (turn)
            {
                if (newSquares[index] === null)
                {
                    newSquares[index] = 'X'; // or 'O', depending on the player
                }
                else
                {
                    return;
                }
            }
            else
            {
                if (newSquares[index] === null)
                {
                    newSquares[index] = 'O';
                }
                else
                {
                    return;
                }
            }
        }
        else
        {
            if (newSquares[index] === null)
            {
                newSquares[index] = 'X';
            }
            else
            {
                return;
            }
            let randomIndex = (Math.random() * (boardSize * boardSize)).toFixed() - 1;
            //console.log(newSquares[randomIndex]);
            while (newSquares[randomIndex] != null)
            {
                randomIndex = (Math.random() * (boardSize * boardSize)).toFixed() - 1;
            }
            newSquares[randomIndex] = 'O';
        }
        setSquares(newSquares);
        checkrow(index, newSquares);
        setTurn(!turn);
    };

    const checkrow = (rawIndex, squares) => 
    {
        const newSquares = squares;
        // horizontal check
        let horizontalIndexAdjusted = rawIndex % boardSize; // convert the 1d index into the index on the row
        let verticalIndexAdjusted = Math.trunc(rawIndex / boardSize);
        // this is going to be bad
        let count = 0;
        let maxCount = 0;
        //console.log(squares);

        // do the horizontal check
        for (let i = horizontalIndexAdjusted - 4; i <= horizontalIndexAdjusted + 4; i++) // for loop based on row index
        {
            // convert the row index to -4 - 4
            let mapped = (((i - (horizontalIndexAdjusted - 4)) * (-4 - 4)) / ((horizontalIndexAdjusted + 4) - (horizontalIndexAdjusted - 4))) + 4;
            if (i >= 0 && i < boardSize) // make sure that the index we are checking is on the row
            {
                if (turn) // check x if its player 1 and o if its player 2
                {
                    if (newSquares[rawIndex + mapped] === "X")
                    {
                        count++;
                    }
                    else
                    {
                        if (maxCount < count) maxCount = count; 
                        count = 0; 
                    }
                }
                else
                {
                    if (newSquares[rawIndex + mapped] === "O")
                    {
                        count++;
                    }
                    else
                    {
                        if (maxCount < count) maxCount = count; 
                        count = 0; 
                    }
                }
            }
        }

        // do the vertical check
        for (let i = verticalIndexAdjusted - 4; i <= verticalIndexAdjusted + 4; i++)
        {
            // this mapping is wrong. once fixed it should work
            let mapped = (((i - (verticalIndexAdjusted - 4)) * (-4 - 4)) / ((verticalIndexAdjusted + 4) - (verticalIndexAdjusted - 4))) + 4;
            if (i >= 0 && i < boardSize)
            {
                //newSquares[rawIndex + (mapped * boardSize)] = "Y";
                if (turn)
                {
                    if (newSquares[rawIndex + (mapped * boardSize)] === "X")
                    {
                        count++;
                    }
                    else
                    {
                        if (maxCount < count) maxCount = count; 
                        count = 0; 
                    }
                }
                else
                {
                    if (newSquares[rawIndex + (mapped * boardSize)] === "O")
                    {
                        count++;
                    }
                    else
                    {
                        if (maxCount < count) maxCount = count; 
                        count = 0; 
                    }
                }
            }
        }

        if (maxCount >= 5 || count == 5)
        {
            console.log("Done");
        }
        setSquares(newSquares);
    }

    const handleRestartGame = () => // just set the board to an empty board lol
    {
        setSquares(Array(boardSize * boardSize).fill(null));
        setTurn(true);
    }

    const handleStartGame = () => { // this doesnt work at all lol
        document.getElementById("Game").innerHTML = ``;
        return(
            `<div className="game">
                <Board squares={squares} onClick={handleSquareClick} />
            </div>`
        );
    }
    
    const updateSize = () => { // this is terrible but it works
        let size = document.getElementById("BoardSize").value; // get the value from the slider
        if (size % 2 === 1)
        {
            setBoardSize(size); // set the board size
            setSquares(Array(size * size).fill(null)); // set the 2d array
            document.getElementById("board").setAttribute("style", "grid-template-columns: repeat(" + size + ", 40px)"); // fix the style of the 2d array so its a square
        }
    }

    const updateGameMode = () => { // swap game mode based on playing with ai checkbox
        setGameMode(!gameMode);
        console.log(gameMode);
    }

    return (
        <div id="Game">
            <div className="slidercontainer">
                <input type="range" max="39" min="9" class="slider" id="BoardSize" onChange={updateSize}/>
            </div>
            <div id="SizeText">
                {boardSize}
            </div>
            <div className="button" onClick={handleRestartGame}>
                Restart Game
            </div>
            <div>
                <input type="checkbox" id="AI" onChange={updateGameMode}/>
                <label for="AI"> Play against AI</label>
            </div>
            <div className="game">
                <Board squares={squares} onClick={handleSquareClick} />
            </div>
        </div>
    );
};

export default Game;
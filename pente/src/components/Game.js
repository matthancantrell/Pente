import React, { useEffect, useState } from 'react';
import Board from './Board';

import '../Button.css';
import { useLocation } from 'react-router-dom';

const Game = ({ sizeInput, firstPlayer, startGameMode, p1_name, p2_name, gameBoard }) => {
    const sizeInputNumber = Number.parseInt(sizeInput);
    const firstPlayerBool = (firstPlayer === 'playerOne')

    const [p1Pieces, setp1Pieces] = useState(null);
    const [p2Pieces, setp2Pieces] = useState(null);

    const [turn, setTurn] = useState(firstPlayerBool);

    const [seconds, setSeconds] = useState(20);

    const [squares, setSquares] = useState(gameBoard === null ? Array(sizeInputNumber * sizeInputNumber).fill(null) : gameBoard);
    const [boardSize, setBoardSize] = useState(39);
    
    const [gameMode, setGameMode] = useState(startGameMode);
    const [playerOneName, setPlayerOneName] = useState(p1_name);
    const [playerTwoName, setPlayerTwoName] = useState(p2_name);
    const [playerOneTaken, setPlayerOneTaken] = useState(0);
    const [playerTwoTaken, setPlayerTwoTaken] = useState(0);

    const [gameOver, setGameOver] = useState(false);

    let firstTurn = true;

    var state = {
        Game: {
            BoardSize: sizeInputNumber,
            PlayerOneName: p1_name,
            PlayerTwoName: p2_name,
            Turn: turn,
            Mode: gameMode,
            Board: squares
        }
    }

    function startCountDown() {
        if (seconds > 0) {
            const timer = setInterval(() => {
                if(seconds > 0) {
                    setSeconds(prevSeconds => prevSeconds - 0.5, 0);
                }
            }, 1000); // Update every 1 second
        }
    }
    
    const handleSquareClick = (index) => {
        // Update squares array based on user's move
        const newSquares = [...squares];
        if (gameMode === false) // pvp functionality
        {
            if (seconds > 0)
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
                setSquares(newSquares);
                checkRow(index, newSquares);
                takePiece(index, newSquares);
                if (playerOneTaken >= 5 || playerTwoTaken >= 5)
                {
                    setGameOver(true);
                }
                setSeconds(-100000);
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
            setSquares(newSquares);
            checkRow(index, newSquares);
            takePiece(index, newSquares);
            checkRow(randomIndex, newSquares);
            takePiece(randomIndex, newSquares);
            if (playerOneTaken >= 5 || playerTwoTaken >= 5)
            {
                setGameOver(true);
            }
            if (!firstTurn)
            {
                setSeconds(-5);
            }
            else
            {
                setSeconds(20);
            }
        }
    };

    const checkRow = (rawIndex, squares) => 
    {
        const newSquares = squares;
        let horizontalIndexAdjusted = rawIndex % boardSize; // convert the 1d index into the index on the row
        let verticalIndexAdjusted = Math.trunc(rawIndex / boardSize); // onvert the 1d index to the index in the column
        // this is going to be bad
        let count = 0;
        let maxCount = 0;

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
        if (maxCount < count) maxCount = count; 
        count = 0; 

        // do the vertical check
        for (let j = verticalIndexAdjusted + 4; j >= verticalIndexAdjusted - 4; j--) // for loop based on the column index
        {
            // convert the index to a range of -4 to 4
            let mapped = -((((j - (verticalIndexAdjusted - 4)) * (-4 - 4)) / ((verticalIndexAdjusted + 4) - (verticalIndexAdjusted - 4))) + 4);
            if (j >= 0 && j < boardSize) // ensure that we stay within the baord
            {
                if (turn) // look for either x or o based on whose turn it is
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
        if (maxCount < count) maxCount = count; 
        count = 0;

        // do diagonal \ check
        for (let k = -4; k <= 4; k++) // i probably could have done it this way instead of mapping for the other two but oh well
        {
            if ((horizontalIndexAdjusted + k) >= 0 && (horizontalIndexAdjusted + k) < boardSize &&
                (verticalIndexAdjusted + k) >= 0 && (verticalIndexAdjusted + k) < boardSize) // ensure we dont leave the board on either axis
            {
                if (turn) // i vaugely understand the math that im using for diagonal \ 
                {
                    if (newSquares[(horizontalIndexAdjusted + k) + ((verticalIndexAdjusted + k) * boardSize)] === "X")
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
                    if (newSquares[(horizontalIndexAdjusted + k) + ((verticalIndexAdjusted + k) * boardSize)] === "O")
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
        if (maxCount < count) maxCount = count; 
        count = 0;

        // do diagonal / check
        for (let k = -4; k <= 4; k++)
        {
            if ((horizontalIndexAdjusted - k) >= 0 && (horizontalIndexAdjusted - k) < boardSize &&
                (verticalIndexAdjusted + k) >= 0 && (verticalIndexAdjusted + k) < boardSize)
            {
                // basically do the same as the last one but we go the opposite horizontal direction
                if (turn)
                {
                    if (newSquares[(horizontalIndexAdjusted - k) + ((verticalIndexAdjusted + k) * boardSize)] === "X")
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
                    if (newSquares[(horizontalIndexAdjusted - k) + ((verticalIndexAdjusted + k) * boardSize)] === "O")
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
        if (maxCount < count) maxCount = count; 
        count = 0;

        if (maxCount >= 5 || count === 5)
        {
            setGameOver(true);
            console.log("over");
        }
    }

    const takePiece = (rawIndex, squares)=> {
        const newSquares = squares;
        let horizontalIndexAdjusted = rawIndex % boardSize; // convert the 1d index into the index on the row
        let verticalIndexAdjusted = Math.trunc(rawIndex / boardSize); // onvert the 1d index to the index in the column
        // there is probably a way to do this in a for loop but i dont care enough about the readability of this
        // if you are actually reading through this, just stop. you dont want to see this. trust me
        if (turn)
        {
            // these four are the easy ones
            if(newSquares[rawIndex + 3] === 'X' && (horizontalIndexAdjusted + 3) < boardSize) // these should probably be swapped but i dont think that javascript cares enough to crash
            {
                if (newSquares[rawIndex + 2] === 'O' && newSquares[rawIndex + 1] === 'O')
                {
                    newSquares[rawIndex + 2] = null;
                    newSquares[rawIndex + 1] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
            if (newSquares[rawIndex - 3] === 'X' && (horizontalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex - 2] === 'O' && newSquares[rawIndex - 1] === 'O')
                {
                    newSquares[rawIndex - 2] = null;
                    newSquares[rawIndex - 1] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
            if (newSquares[rawIndex + (3 * boardSize)] === 'X' && (verticalIndexAdjusted + 3) < boardSize)
            {

                if (newSquares[rawIndex + (2 * boardSize)] === 'O' && newSquares[rawIndex + (1 * boardSize)] === 'O')
                {
                    newSquares[rawIndex + (2 * boardSize)] = null;
                    newSquares[rawIndex + (1 * boardSize)] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
            if (newSquares[rawIndex - (3 * boardSize)] === 'X' && (verticalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex - (2 * boardSize)] === 'O' && newSquares[rawIndex - boardSize] === 'O')
                {
                    newSquares[rawIndex - (2 * boardSize)] = null;
                    newSquares[rawIndex - boardSize] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }

            // these are going to get messy fast
            if (newSquares[rawIndex + 3 + (3 * boardSize)] === 'X' && (horizontalIndexAdjusted + 3) < boardSize && (verticalIndexAdjusted + 3) < boardSize)
            {
                if (newSquares[rawIndex + 2 + (2 * boardSize)] === 'O' && newSquares[rawIndex + 1 + (1 * boardSize)] === 'O')
                {
                    newSquares[rawIndex + 2 + (2 * boardSize)] = null;
                    newSquares[rawIndex + 1 + (1 * boardSize)] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
            if (newSquares[rawIndex + 3 - (3 * boardSize)] === 'X' && (horizontalIndexAdjusted + 3) < boardSize && (verticalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex + 2 - (2 * boardSize)] === 'O' && newSquares[rawIndex + 1 - boardSize] === 'O')
                {
                    newSquares[rawIndex + 2 - (2 * boardSize)] = null;
                    newSquares[rawIndex + 1 - boardSize] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
            if (newSquares[rawIndex - 3 + (3 * boardSize)] === 'X' && (horizontalIndexAdjusted - 3) >= 0 && (verticalIndexAdjusted + 3) < boardSize)
            {
                if (newSquares[rawIndex - 2 + (2 * boardSize)] === 'O' && newSquares[rawIndex - 1 + (1 * boardSize)] === 'O')
                {
                    newSquares[rawIndex - 2 + (2 * boardSize)] = null;
                    newSquares[rawIndex - 1 + (1 * boardSize)] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
            if (newSquares[rawIndex - 3 - (3 * boardSize)] === 'X' && (horizontalIndexAdjusted - 3) >= 0 && (verticalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex - 2 - (2 * boardSize)] === 'O' && newSquares[rawIndex - 1 - boardSize] === 'O')
                {
                    newSquares[rawIndex - 2 - (2 * boardSize)] = null;
                    newSquares[rawIndex - 1 - boardSize] = null;
                    setPlayerOneTaken(playerOneTaken + 1);
                }
            }
        }
        else
        {
            // these four are the easy ones
            if(newSquares[rawIndex + 3] === 'O' && (horizontalIndexAdjusted + 3) < boardSize) // these should probably be swapped but i dont think that javascript cares enough to crash
            {
                if (newSquares[rawIndex + 2] === 'X' && newSquares[rawIndex + 1] === 'X')
                {
                    newSquares[rawIndex + 2] = null;
                    newSquares[rawIndex + 1] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
            if (newSquares[rawIndex - 3] === 'O' && (horizontalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex - 2] === 'X' && newSquares[rawIndex - 1] === 'X')
                {
                    newSquares[rawIndex - 2] = null;
                    newSquares[rawIndex - 1] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
            if (newSquares[rawIndex + (3 * boardSize)] === 'O' && (verticalIndexAdjusted + 3) < boardSize)
            {

                if (newSquares[rawIndex + (2 * boardSize)] === 'X' && newSquares[rawIndex + (1 * boardSize)] === 'X')
                {
                    newSquares[rawIndex + (2 * boardSize)] = null;
                    newSquares[rawIndex + (1 * boardSize)] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
            if (newSquares[rawIndex - (3 * boardSize)] === 'O' && (verticalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex - (2 * boardSize)] === 'X' && newSquares[rawIndex - boardSize] === 'X')
                {
                    newSquares[rawIndex - (2 * boardSize)] = null;
                    newSquares[rawIndex - boardSize] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }

            // these are going to get messy fast
            if (newSquares[rawIndex + 3 + (3 * boardSize)] === 'O' && (horizontalIndexAdjusted + 3) < boardSize && (verticalIndexAdjusted + 3) < boardSize)
            {
                if (newSquares[rawIndex + 2 + (2 * boardSize)] === 'X' && newSquares[rawIndex + 1 + (1 * boardSize)] === 'X')
                {
                    newSquares[rawIndex + 2 + (2 * boardSize)] = null;
                    newSquares[rawIndex + 1 + (1 * boardSize)] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
            if (newSquares[rawIndex + 3 - (3 * boardSize)] === 'O' && (horizontalIndexAdjusted + 3) < boardSize && (verticalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex + 2 - (2 * boardSize)] === 'X' && newSquares[rawIndex + 1 - boardSize] === 'X')
                {
                    newSquares[rawIndex + 2 - (2 * boardSize)] = null;
                    newSquares[rawIndex + 1 - boardSize] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
            if (newSquares[rawIndex - 3 + (3 * boardSize)] === 'O' && (horizontalIndexAdjusted - 3) >= 0 && (verticalIndexAdjusted + 3) < boardSize)
            {
                if (newSquares[rawIndex - 2 + (2 * boardSize)] === 'X' && newSquares[rawIndex - 1 + (1 * boardSize)] === 'X')
                {
                    newSquares[rawIndex - 2 + (2 * boardSize)] = null;
                    newSquares[rawIndex - 1 + (1 * boardSize)] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
            if (newSquares[rawIndex - 3 - (3 * boardSize)] === 'O' && (horizontalIndexAdjusted - 3) >= 0 && (verticalIndexAdjusted - 3) >= 0)
            {
                if (newSquares[rawIndex - 2 - (2 * boardSize)] === 'X' && newSquares[rawIndex - 1 - boardSize] === 'X')
                {
                    newSquares[rawIndex - 2 - (2 * boardSize)] = null;
                    newSquares[rawIndex - 1 - boardSize] = null;
                    setPlayerTwoTaken(playerTwoTaken + 1);
                }
            }
        }
    }
    
    const updateSize = () => { // this is terrible but it works
        let size = sizeInputNumber; // get the value from the slider
        if (size % 2 === 1)
        {
            setBoardSize(size); // set the board size
            setSquares(squares); // set the 2d array
            document.getElementById("board").setAttribute("style", "grid-template-columns: repeat(" + size + ", 40px)"); // fix the style of the 2d array so its a square
        }
    }

    function findCenter() {
        const centerIndex = Math.floor(sizeInputNumber / 2);
        handleSquareClick(centerIndex * sizeInputNumber + centerIndex);
    }

    function onClick() {
        setSeconds(20);
        setTurn(!turn);
    }

    function onContinue() {
        setTurn(!turn);
        const newSquares = [...squares];
        let randomIndex = (Math.random() * (boardSize * boardSize)).toFixed() - 1;
        while (newSquares[randomIndex] != null)
        {
            randomIndex = (Math.random() * (boardSize * boardSize)).toFixed() - 1;
        }
        newSquares[randomIndex] = 'O';
        setSquares(newSquares);
        checkRow(randomIndex, newSquares);
        takePiece(randomIndex, newSquares);
        setSeconds(20);
        setTurn(!turn);
    }

    const handleDownload = () => {
        const { Game } = state;
        const json = JSON.stringify(Game);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'board_data.json'; // Filename
        document.body.appendChild(link);
        
        // Click the link to trigger download
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }

    useEffect(() => {
        updateSize();
        findCenter();
        startCountDown();
    }, []);

    return (
        <div id="Game">
            <button onClick={handleDownload}>Save</button>
            <div className="game">
                { seconds > 0 && !gameOver && (
                    <>
                        <p>{seconds}</p>
                    </>
                )}
                { seconds < 0  && seconds > -100000 && !gameMode && !gameOver && (
                    <>
                        <p>Times Up!</p>
                        { turn && (
                            <p>Press Continue To Start {playerTwoName}'s Turn</p>
                        )}
                        { !turn && (
                            <p>Press Continue To Start{playerOneName}'s Turn</p>
                        )}
                        <button onClick={onClick}>Continue</button>
                    </>
                )}
                { seconds < 0 && gameMode && !gameOver && (
                    <>
                        <p>Times Up!</p>
                        { turn && (
                            <p>Your Turn Has Been Skipped</p>
                        )}
                        <button onClick={onContinue}>Continue</button>
                    </>
                )}
                { seconds <= -100000  && !gameMode && !gameOver && (
                    <>
                        { turn && (
                            <p>Press Next When {playerTwoName} Is Ready</p>
                        )}
                        { !turn && (
                            <p>Press Next When {playerOneName} Is Ready</p>
                        )}
                        <button onClick={onClick}>Continue</button>
                    </>
                )}
                { gameOver && (
                    <>
                        { turn && (
                            <p>{playerOneName} Wins!</p>
                        )}
                        { !turn && (
                            <p>{playerTwoName} Wins!</p>
                        )}
                        <button><a href='/'>Restart</a></button>
                    </>
                )}
                <Board squares={squares} onClick={handleSquareClick} />
            </div>
        </div>
    );
};

export default Game;
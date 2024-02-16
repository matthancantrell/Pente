import { useState } from "react";
import Game from "../components/Game";

function LoadGame() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);

    const handleFileChange = (event) => {
        // Get the selected file
        const file = event.target.files[0];
        setSelectedFile(file);

        // Check if the file is a JSON file
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                setJsonData(parsedData);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
            };
            reader.readAsText(file);
        } else {
            console.log('Selected file is not a JSON file.');
        }
    };
    
    return(
        <div>
            <h1 name='Load Game'>Load Game</h1>
            <input type="file" onChange={handleFileChange} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            {jsonData && (
            <div>
                <p>Game Data:</p>
                <ul>
                <li>Player One: {jsonData.PlayerOneName}</li>
                <li>Player Two: {jsonData.PlayerTwoName}</li>
                </ul>
                <Game 
                    sizeInput={ jsonData.BoardSize } 
                    firstPlayer={ jsonData.PlayerOneName }
                    startGameMode = { jsonData.Mode } 
                    p1_name={ jsonData.PlayerOneName } 
                    p2_name={ jsonData.PlayerTwoName } 
                    gameBoard={ jsonData.Board }
                />
            </div>
            )}
        </div>
    );
}

export default LoadGame;
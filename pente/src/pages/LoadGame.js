import { useState } from "react";

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
            <input type="file" onChange={handleFileChange} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            {jsonData && (
            <div>
                <p>Game Data:</p>
                <ul>
                <li>Player One: {jsonData.PlayerOne.Name}</li>
                <li>Player Two: {jsonData.PlayerTwo.Name}</li>
                </ul>
            </div>
            )}
        </div>
    );
}

export default LoadGame;
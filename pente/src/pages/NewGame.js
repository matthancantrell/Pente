import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function NewGame() {
    const [formData, setFormData] = useState({
        boardSize: 0,
        enemyType: ''
    })

    const nav = useNavigate();

    function onKeyDown() {
        return false;
    }

    const onChange = (e) => {
        const { name, value } = e.target;
        // Check if it's a number for the 'age' field
        const integerValue = name === 'boardSize' ? parseInt(value) : value;

        setFormData({ ...formData, [name]: integerValue });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData.boardSize);
        nav('/Play', {gameData: {formData}});
    }

    const center = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    }

    return (
        <div style={center}>
            <h1>New Game</h1>

            <form onSubmit={onSubmit}>
                <p>Board Size: <input type='number' name='boardSize' min='9' max='39' step='2' value={formData.boardSize} onChange={onChange} onKeyDown={onKeyDown} />
                </p>
                <p>Enemy Type:</p>
                    <input
                        type="radio"
                        checked={formData.enemyType === 'player'}
                        id="player" 
                        name="enemyType" 
                        value="player"
                        onChange={onChange}
                    />
                    <label htmlFor="enemyType">Player</label> <br />

                    <input 
                        type="radio" 
                        checked={formData.enemyType === 'ai'}
                        id="ai" 
                        name="enemyType" 
                        value="ai" 
                        onChange={onChange}
                    />
                    <label htmlFor="ai">AI</label> 
                    <br />
                    <br />
                <button type='submit'>Create New Game</button>
            </form>
        </div>
    );
}

export default NewGame;
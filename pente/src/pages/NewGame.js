import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewGame() {
    const [formData, setFormData] = useState({
        boardSize: 0,
        enemyType: '',
        firstPlayer: '',
        playerOneName: '',
        playerTwoName: '',
        turn: '',
        board: null
    });

    const nav = useNavigate();

    function onKeyDown() {
        return false;
    }

    const onChange = (e) => {
        const { name, value } = e.target;
        // Check if it's a number for the 'boardSize' field
        const integerValue = name === 'boardSize' ? parseInt(value) : value;

        setFormData({ ...formData, [name]: integerValue });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (formData.playerTwoName === "") {
            formData.playerTwoName = "AI"
        }
        nav('/Play', { state: { formData } });
    };

    const center = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    return (
        <div style={center}>
            <h1 name='New Game'>New Game</h1>

            <form onSubmit={onSubmit}>
                <p>
                    Board Size:{' '}
                    <input
                        type='number'
                        name='boardSize'
                        min='9'
                        max='39'
                        step='2'
                        value={formData.boardSize}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                    />
                </p>
                <p>Enemy Type:</p>
                <input
                    type='radio'
                    checked={formData.enemyType === 'player'}
                    id='player'
                    name='enemyType'
                    value='player'
                    onChange={onChange}
                />
                <label htmlFor='enemyType'>Player</label>
                <br />
                <input
                    type='radio'
                    checked={formData.enemyType === 'ai'}
                    id='ai'
                    name='enemyType'
                    value='ai'
                    onChange={onChange}
                />
                <label htmlFor='ai'>AI</label>
                <br />
                <p>Who goes first? (The first player's piece will be placed in the center of the board)</p>
                        <input
                            type='radio'
                            id='playerOne'
                            checked={formData.firstPlayer === 'playerOne'}
                            name='firstPlayer'
                            value='playerOne'
                            onChange={onChange}
                        />
                        <label htmlFor='firstPlayer'>Player One (X)</label>
                        <br />
                        <input
                            type='radio'
                            id='playerTwo'
                            checked={formData.firstPlayer === 'playerTwo'}
                            name='firstPlayer'
                            value='playerTwo'
                            onChange={onChange}
                        />
                        <label htmlFor='firstPlayer'>Player Two (O)</label>
                        <br />
                        <p>Player One Name: <input type='text' name='playerOneName' value={formData.playerOneName} onChange={onChange} /></p>
                {formData.enemyType === 'player' && (
                    <>
                        <p>Player Two Name: <input type='text' name='playerTwoName' value={formData.playerTwoName} onChange={onChange} /></p>
                    </>
                )}
                <br />
                <button type='submit'>Create New Game</button>
            </form>
        </div>
    );
}

export default NewGame;

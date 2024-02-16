import { useLocation } from "react-router-dom";
import Game from "../components/Game";

function Play() {

    const location = useLocation();
    const formData = location.state.formData;

    console.log(formData);

    return (
        <>
            <div>
                <div>
                    <p>
                        Player One: { formData.playerOneName }
                    </p>
                    <p>
                        Player Two: { formData.playerTwoName }
                    </p>
                </div>
                <div>
                    <Game 
                        sizeInput={ formData.boardSize } 
                        firstPlayer={ formData.firstPlayer }
                        startGameMode = { formData.enemyType === "ai" } 
                        p1_name={ formData.playerOneName } 
                        p2_name={ formData.playerTwoName } 
                        gameBoard={ formData.board }
                        playerOneCaptures={ null }
                        playerTwoCaptures={ null }
                        Turn={ null }
                    />
                </div>
            </div>
        </>
    );
}

export default Play;
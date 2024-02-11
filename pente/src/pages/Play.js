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
                    <Game sizeInput={ formData.boardSize } firstPlayer={ formData.firstPlayer } />
                </div>
            </div>
        </>
    );
}

export default Play;
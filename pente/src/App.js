import './App.css';
import Game from './components/Game';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import NewGame from './pages/NewGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />}/>
        <Route path='/NewGame' element={<NewGame />} />
        <Route path='/Play' element={<Game />} />
      </Routes>
    </BrowserRouter>
    // <div>
    //   <Game></Game>
    // </div>
  );
}

export default App;
/*
  class for intersection
    has one enum for empty, player one, player two

  class for board
    has a 2d array of intersections
    has a list of players 
    have a place function that does the logic for if the intersection is empty
    another function for checking if we have a 5 in a row (called in 32)
    another function for checking if we can capture  (called in 32)
    another function for checking if the player won from capturing (called in 34)

  class for player
    all this has is an counter for how many pieces we have captrued 
    we could also have a color that the player can choose if we have time

  i guess we just have the board in the main window or something
*/
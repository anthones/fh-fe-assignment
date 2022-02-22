import React from 'react';
import { WhoIsStaying } from '../WhoIsStaying';
import './App.css';

function App() {
  return (
    <div className="App">
      <WhoIsStaying initialRooms={"1:4,6|3"}/>
    </div>
  );
}

export default App;

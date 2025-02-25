import React, { useState } from "react";
import ModalNew from "./ModalNew";
import GameScreen from "./GameScreen";
import "./App.css";

const App = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="app-container">
      <header className="app-header">
        {/* Insert your hosted image URL here */}
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAHlBMVEX83QnaEhr+5AjZABrlZxXYABvyqw/94Qj83AjlahaOSkTMAAABBklEQVR4nO3dwW1CQRAFwbExBvJP2PfpM1r8VRVCH99IuzMAAAAAAG/wzTYvtrmxzRebJqVJaVKalCalSWlSmpQmpUlpUpqUJqVJaVKalJ2t5ofNbl+nTykAAAAAcAlPNrt9ue+UJqVJaVKalCalSWlSmpQmpUlpUpqUJqVJaVKalCY1d7b5ZZsH2+lTCgAAAAD/0OlR6wPZY8tuX+47pUlpUpqUJqVJaVKalCalSWlSmpQmpUlpUpqUJqVJea+gvGtRp08pAAAAAHAJpz/P+kD+fSu7fbnvlCalSWlSmpQmpUlpUpqUJqVJaVKalCalSWlSmpSdrebFZrev06cUAAAAAOCa/gDFrbrrMaBq1gAAAABJRU5ErkJggg=="
          alt="Word Translation Game"
          className="game-logo"
        />
      </header>
      {showModal ? (
        <ModalNew onClose={() => setShowModal(false)} />
      ) : (
        <GameScreen />
      )}
    </div>
  );
};

export default App;

import React from "react";
import { Modal as BootstrapModal, Button } from "react-bootstrap";
import "./Modal.css";

const ModalNew = ({ onClose }) => {
  return (
    <BootstrapModal show={true} onHide={onClose} centered>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Game Rules</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p>Welcome to the Word Translation Game!</p>
        <p>
          You will be shown 5 words, one at a time. For each word, type the
          correct translation and submit.
        </p>
        <p>
          You can keep trying until you get it correct. Your score will be
          higher if you answer quickly and with fewer incorrect attempts.
        </p>
        <p>
          After all 5 words, the game will end, and your total score will be
          displayed.
        </p>
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button className="start-button" onClick={onClose}>
          Start Game
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default ModalNew;

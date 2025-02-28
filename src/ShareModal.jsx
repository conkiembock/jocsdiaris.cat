import React from "react";
import { Modal as BootstrapModal, Button } from "react-bootstrap";
import "./ShareModal.css";

const ShareModal = ({ show, onHide, completedWords }) => {
  const generateEmojiResult = (score) => {
    if (score > 700) return "🟩🟩🟩";
    if (score > 500) return "🟩🟩";
    if (score > 300) return "🟨🟨";
    if (score > 0) return "🟥";
    return "⬜";
  };

  const resultText = completedWords
    .map(
      (item) =>
        `${generateEmojiResult(item.score)} ${item.word} → ${item.translation}`
    )
    .join("\n");

  return (
    <BootstrapModal show={show} onHide={onHide} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Els teus resultats</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p>Ho has fet aixi:</p>
        <pre className="share-results">{resultText}</pre>
        <p>Comparteix-ho amb els teus amics!</p>
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Tancar
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default ShareModal;

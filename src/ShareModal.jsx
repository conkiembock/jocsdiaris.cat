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
        <BootstrapModal.Title>Share Your Results</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p>Here’s how you did:</p>
        <pre className="share-results">{resultText}</pre>
        <p>Copy and share this with your friends!</p>
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default ShareModal;

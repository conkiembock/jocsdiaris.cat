import React from "react";
import { Modal as BootstrapModal, Button } from "react-bootstrap";
import "./Modal.css";

const ModalNew = ({ onClose }) => {
  return (
    <BootstrapModal show={true} onHide={onClose} centered>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Regles del Joc</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p>Benvinguts al Joc de Cinc Paraules!</p>
        <p>
        Se't mostraran 5 paraules, una per una. Per a cada paraula, escriu la 
        traducció correcta i envia-la.
        </p>
        <p>
        Pots continuar intentant-ho fins que l'encertis. La teva puntuació serà
        més alta si respons ràpidament i amb menys intents incorrectes.
        </p>
        <p>
        Després de les 5 paraules, el joc finalitzarà i es mostrarà la teva puntuació total.
        </p>
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button className="start-button" onClick={onClose}>
          Som-hi!
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default ModalNew;

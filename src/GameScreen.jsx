import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Card, ListGroup } from "react-bootstrap";
import CountryFlag from "react-country-flag"; // Updated import
import ShareModal from "./ShareModal";
import ProgressBar from "./ProgressBar";
import "./GameScreen.css";

const words = [
  { word: "manzana", translation: "poma" },
  { word: "trago", translation: "glop" },
  { word: "escaparate", translation: "aparador" },
  { word: "columpio", translation: "gronxador" },
  { word: "cadera", translation: "maluc" },
];

const skipMessages = [
  "ai, quina pena!",
  "ostres, no saps?",
  "buf",
  "quin disgust, saltar!",
  "mare meva, res!",
  "t'escapa?",
  "quina llàstima...",
  "quin mal :/",
  "t'escapa?",
  "que ràbia!",
];

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const corners = [
  { top: "30%", left: "20%", transform: "translateX(-50%) rotate(30deg)" },
  { top: "30%", right: "10%", transform: "translateX(50%) rotate(-30deg)" },
  { bottom: "30%", left: "20%", transform: "translateX(-50%) rotate(30deg)" },
  { bottom: "30%", right: "10%", transform: "translateX(50%) rotate(-30deg)" },
];

const GameScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [totalScore, setTotalScore] = useState(0);
  const [completedWords, setCompletedWords] = useState([]);
  const [showPoints, setShowPoints] = useState(null);
  const [showPenalty, setShowPenalty] = useState(null);
  const [showSkipMessage, setShowSkipMessage] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [potentialScore, setPotentialScore] = useState(1000);
  const [animationCorner, setAnimationCorner] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setStartTime(Date.now());
    setIncorrectAttempts(0);
    setPotentialScore(1000);
    if (inputRef.current) inputRef.current.focus();

    const interval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(interval);
        return;
      }
      const timeTaken = (Date.now() - startTime) / 1000;
      const newScore = Math.max(
        0,
        1000 - Math.floor(timeTaken) * 10 - incorrectAttempts * 50
      );
      setPotentialScore(newScore);

      if (newScore <= 0) {
        handleSkip();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const calculateScore = (timeTaken) => {
    return Math.max(
      0,
      1000 - Math.floor(timeTaken) * 10 - incorrectAttempts * 50
    );
  };

  const getRandomCorner = () => {
    return corners[Math.floor(Math.random() * corners.length)];
  };

  const handleSkip = () => {
    if (currentIndex >= words.length) return;

    const currentWord = words[currentIndex];
    setCompletedWords([
      ...completedWords,
      {
        word: currentWord.word,
        translation: currentWord.translation,
        score: 0,
      },
    ]);
    const randomMessage =
      skipMessages[Math.floor(Math.random() * skipMessages.length)];
    setShowSkipMessage(randomMessage);
    setAnimationCorner(getRandomCorner());
    setTimeout(() => {
      setShowSkipMessage(null);
      setAnimationCorner(null);
    }, 1000);
    setInput("");
    setCurrentIndex(currentIndex + 1);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = () => {
    const currentWord = words[currentIndex];
    const playerAnswer = removeAccents(input.trim().toLowerCase());
    const correctAnswer = removeAccents(currentWord.translation.toLowerCase());
    const timeTaken = (Date.now() - startTime) / 1000;
    const scoreForThisWord = calculateScore(timeTaken);

    if (playerAnswer === correctAnswer) {
      setTotalScore(totalScore + scoreForThisWord);
      setCompletedWords([
        ...completedWords,
        {
          word: currentWord.word,
          translation: currentWord.translation,
          score: scoreForThisWord,
        },
      ]);
      setShowPoints(scoreForThisWord);
      setAnimationCorner(getRandomCorner());
      setTimeout(() => {
        setShowPoints(null);
        setAnimationCorner(null);
      }, 1000);
      setInput("");
      setCurrentIndex(currentIndex + 1);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setIncorrectAttempts(incorrectAttempts + 1);
      setShowPenalty(-50);
      setAnimationCorner(getRandomCorner());
      setTimeout(() => {
        setShowPenalty(null);
        setAnimationCorner(null);
      }, 1000);
      setInput("");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  if (currentIndex >= words.length) {
    let message;
    if (totalScore < 1000) {
      message = "No entens res tu!";
    } else if (totalScore < 2000) {
      message = "Quin esforç, però no!";
    } else if (totalScore < 3000) {
      message = "Ja parlem";
    } else if (totalScore < 4000) {
      message = "Ai, gairebé perfecte!";
    } else {
      message = "Increïble, un mestre!";
    }

    return (
      <Container className="game-over">
        <Card className="text-center">
          <Card.Body>
            <Card.Title as="h2">Fins aquí, nano!</Card.Title>
            <Card.Text>Punts: {totalScore}</Card.Text>
            <Card.Text>{message}</Card.Text>
            <Button
              className="share-button"
              onClick={() => setShowShareModal(true)}
            >
              Compartir
            </Button>
          </Card.Body>
        </Card>
        {completedWords.length > 0 && (
          <div className="completed-words-container">
            <div className="list-header">
              <span>
                <CountryFlag
                  countryCode="ES"
                  svg
                  style={{ fontSize: "1.5em" }}
                />{" "}
                Castellano
              </span>
              <span>
                <CountryFlag
                  countryCode="CAT"
                  svg
                  style={{ fontSize: "1.5em" }}
                />{" "}
                Català
              </span>
            </div>
            <ListGroup className="completed-words-list">
              {completedWords.map((item, index) => (
                <ListGroup.Item key={index}>
                  {item.word} → {item.translation} (+{item.score} punts)
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
        <ShareModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          completedWords={completedWords}
        />
      </Container>
    );
  }

  return (
    <Container className="game-screen">
      {completedWords.length > 0 && (
        <div className="completed-words-container">
          <div className="list-header">
            <span>
              <CountryFlag countryCode="ES" svg style={{ fontSize: "1.5em" }} />{" "}
              Castellà
            </span>
            <span>
              <CountryFlag countryCode="ES" svg style={{ fontSize: "1.5em" }} />{" "}
              Català
            </span>
          </div>
          <ListGroup className="completed-words-list">
            {completedWords.map((item, index) => (
              <ListGroup.Item key={index}>
                {item.word} → {item.translation} (+{item.score} points)
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      <Card className="text-center">
        <Card.Body>
          <Card.Title as="h2">Com es diu en català?</Card.Title>
          <Card.Text className="word-display">
            {words[currentIndex].word}
          </Card.Text>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Form.Group controlId="translationInput">
              <ProgressBar potentialScore={potentialScore}>
                <Form.Control
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  // Removed onKeyPress
                  onFocus={() => {
                    if (inputRef.current) {
                      inputRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                  placeholder=""
                  className="input-field"
                  ref={inputRef}
                />
              </ProgressBar>
            </Form.Group>
            <div className="button-group">
              <Button className="submit-button" onClick={handleSubmit}>
                Enviar
              </Button>
              <Button className="skip-button" onClick={handleSkip}>
                Saltar
              </Button>
            </div>
          </Form>
          {showPoints !== null && (
            <div
              className="result-animation"
              style={{
                top: animationCorner?.top,
                left: animationCorner?.left,
                right: animationCorner?.right,
                bottom: animationCorner?.bottom,
                transform: animationCorner?.transform,
                color: "#ff9966",
              }}
            >
              +{showPoints} punts
            </div>
          )}
          {showPenalty !== null && (
            <div
              className="result-animation"
              style={{
                top: animationCorner?.top,
                left: animationCorner?.left,
                right: animationCorner?.right,
                bottom: animationCorner?.bottom,
                transform: animationCorner?.transform,
                color: "#ff0000",
              }}
            >
              {showPenalty} punts
            </div>
          )}
          {showSkipMessage !== null && (
            <div
              className="result-animation"
              style={{
                top: animationCorner?.top,
                left: animationCorner?.left,
                right: animationCorner?.right,
                bottom: animationCorner?.bottom,
                transform: animationCorner?.transform,
                color: "#999",
              }}
            >
              {showSkipMessage}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GameScreen;

import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Card, ListGroup } from "react-bootstrap";
import Flag from "react-flag-icon-css";
import ShareModal from "./ShareModal";
import ProgressBar from "./ProgressBar";
import "./GameScreen.css";

const words = [
  { word: "apple", translation: "manzana" },
  { word: "banana", translation: "plátano" },
  { word: "cherry", translation: "cereza" },
  { word: "date", translation: "dátil" },
  { word: "elderberry", translation: "saúco" },
];

const skipMessages = [
  "Skipped it!",
  "Onward we go!",
  "Next one, please!",
  "Pass!",
  "Moving along!",
  "Nope, next!",
  "Skipping ahead!",
  "Let’s try another!",
  "Outta here!",
  "See ya, word!",
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
        clearInterval(interval); // Stop interval when game is over
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
    if (currentIndex >= words.length) return; // Prevent skip after game over

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
      message = "Keep practicing, you'll get there!";
    } else if (totalScore < 2000) {
      message = "Nice effort, you're on your way!";
    } else if (totalScore < 3000) {
      message = "Great job, you're a word wizard!";
    } else if (totalScore < 4000) {
      message = "Awesome score, almost perfect!";
    } else {
      message = "Incredible! You're a translation master!";
    }

    return (
      <Container className="game-over">
        <Card className="text-center">
          <Card.Body>
            <Card.Title as="h2">Game Over</Card.Title>
            <Card.Text>Your total score is: {totalScore}</Card.Text>
            <Card.Text>{message}</Card.Text>
            <Button
              className="share-button"
              onClick={() => setShowShareModal(true)}
            >
              Share
            </Button>
          </Card.Body>
        </Card>
        {completedWords.length > 0 && (
          <div className="completed-words-container">
            <div className="list-header">
              <span>
                <Flag code="us" size="lg" /> English
              </span>
              <span>
                <Flag code="es" size="lg" /> Spanish
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
              <Flag code="us" size="lg" /> English
            </span>
            <span>
              <Flag code="es" size="lg" /> Spanish
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
          <Card.Title as="h2">Translate the word:</Card.Title>
          <Card.Text className="word-display">
            {words[currentIndex].word}
          </Card.Text>
          <Form>
            <Form.Group controlId="translationInput">
              <ProgressBar potentialScore={potentialScore}>
                <Form.Control
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  onFocus={() => {
                    if (inputRef.current) {
                      inputRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                  placeholder="Enter translation"
                  className="input-field"
                  ref={inputRef}
                />
              </ProgressBar>
            </Form.Group>
            <div className="button-group">
              <Button className="submit-button" onClick={handleSubmit}>
                Submit
              </Button>
              <Button className="skip-button" onClick={handleSkip}>
                Skip
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
              +{showPoints} points
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
              {showPenalty} points
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

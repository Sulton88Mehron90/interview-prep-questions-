import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Flashcard from '../Flashcard/Flashcard';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BrainImage from '../../Images/brain2.png';
import './FlashcardContainer.css';

export default function FlashcardContainer({ flashcards }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState(location.state?.category || '');
  const [numberOfQuestions, setNumberOfQuestions] = useState(location.state?.numberOfQuestions || 3);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);

  const [flippedStates, setFlippedStates] = useState({});

  useEffect(() => {
    let filtered = flashcards;

    if (category) {
      filtered = flashcards.filter(card => card.category === category);
    }

    setFilteredFlashcards(filtered.slice(0, numberOfQuestions));

    setFlippedStates({});

  }, [category, numberOfQuestions, flashcards]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleNumberOfQuestionsChange = (e) => {
    setNumberOfQuestions(parseInt(e.target.value, 10));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (category) {
      navigate('/flashcards', { state: { category, numberOfQuestions } });
    } else {

      alert('Please choose a category.');
    }
  };

  return (
    <div className='container' role="main">
      <form onSubmit={handleSubmit} className="category-form">
        <label htmlFor="category-select">Category:</label>
        <select id="category-select" value={category} onChange={handleCategoryChange} required>
        <option value="" disabled className="smaller-text">Choose one</option>
          <option value="fe">Frontend</option>
          <option value="be">Backend</option>
          <option value="behavioral">Behavioral</option>
        </select>
        <label htmlFor="number-of-questions">Number of Questions:</label>
        <input
  className="smaller-text"
  id="number-of-questions"
  type="number"
  value={numberOfQuestions}
  onChange={handleNumberOfQuestionsChange}
  min="1"
  max="100"
/>
        <button type="submit" className="update-button">Update</button>
      </form>
      <div className='card-grid' aria-live="polite">
        {filteredFlashcards.map((flashcard, index) => (
          <Flashcard
            key={flashcard.id || index}
            flashcard={flashcard}
            flipped={flippedStates[flashcard.id]}
            onFlip={() => setFlippedStates({ ...flippedStates, [flashcard.id]: !flippedStates[flashcard.id] })}
          />
        ))}
        <div className="exit-and-brain-container">
          <Link to="/" className="button go-back-button" aria-label="Return to home">Exit</Link>
          <img src={BrainImage} alt="Brain" className="brain-img" />
        </div>
      </div>
    </div>
  );
}

FlashcardContainer.propTypes = {
  flashcards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};

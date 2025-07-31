import { useState } from "react";
import RulesModal from "../components/RulesModal";


export default function TestEntrance() {
  const [showModal, setShowModal] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleStartTest = () => {
    setShowModal(true);
  };

  return (
    <div className="test-entrance-container">
      <div className="test-card animate__animated animate__fadeIn">
        <div className="test-header">
          <h2><i className="bi bi-journal-text me-2"></i>Upcoming Test</h2>
          <div className="test-badge">New</div>
        </div>
        
        <div className="test-details">
          <div className="test-info">
            <i className="bi bi-card-heading"></i>
            <span>Web Technologies Quiz</span>
          </div>
          <div className="test-info">
            <i className="bi bi-clock"></i>
            <span>30 Minutes Duration</span>
          </div>
          <div className="test-info">
            <i className="bi bi-question-circle"></i>
            <span>10 Questions</span>
          </div>
        </div>
        
        <button 
          className="start-test-btn"
          onClick={handleStartTest}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className={isHovering ? 'animate__animated animate__pulse' : ''}>
            <i className="bi bi-arrow-right-circle me-2"></i>
            Start Test Now
          </span>
        </button>
      </div>

      {showModal && <RulesModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
import React, { useEffect, useState } from 'react';

function MCQTest() {
  const [examFinished, setExamFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [malpractice, setMalpractice] = useState(false);
  const [malpracticeType, setMalpracticeType] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
    const [showPopup, setShowPopup] = useState(false);
      const [showCompletionPopup, setShowCompletionPopup] = useState(false);
    

  useEffect(() => {
    fetch("http://localhost:8000/admin/mcqquestions")
      .then(res => res.json())
      .then(data => setQuestions(data[0].MCQ));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeTaken(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    const username = localStorage.getItem("token");
      setShowCompletionPopup(true);
    const results = questions.map((q, idx) => ({
      question: q.question,
      selected: answers[idx],
      correctAnswer: q.correctAnswer,
      success: answers[idx] === q.correctAnswer,
    }));

    await fetch("http://localhost:8000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        results,
        timeTaken,
        malpractice_type: [...new Set(malpracticeType)],
        totalMarks: results.filter(r => r?.success).length,
        test_type: "MCQ",
        malpractice: false
      }),
    });

    localStorage.removeItem("token");
    setExamFinished(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 4000);
  };

  const handleMalpractice = async (type) => {
    setMalpractice(true);
    
    setMalpracticeType(prev => [...new Set([...prev, type])]);

    const username = localStorage.getItem("token");

    const results = questions.map((q, idx) => ({
      question: q.question,
      selected: answers[idx],
      correctAnswer: q.correctAnswer,
      success: answers[idx] === q.correctAnswer,
    }));

    await fetch("http://localhost:8000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        results,
        timeTaken: Math.floor((Date.now() - startTime) / 1000),
        malpractice_type: [...new Set([...malpracticeType, type])],
        totalMarks: results.filter(r => r?.success).length,
        test_type: "MCQ",
        malpractice: type
      }),
    });

    setShowPopup(true);
    setExamFinished(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 4000);
  };

  useEffect(() => {
    const handleCopy = (e) => {
      if (examFinished) return;
      e.preventDefault();
      handleMalpractice("Copy");
    };
    const handleBlur = () => {
      if (examFinished) return;
      handleMalpractice("Tab Switch");
    };

    document.addEventListener("copy", handleCopy);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("blur", handleBlur);
    };
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">MCQ Test</h2>

      <div className="alert alert-info text-center">
        Time Elapsed: {formatTime(timeTaken)}
      </div>

      {malpractice && (
        <div className="alert alert-danger text-center">
          ⚠️ Malpractice Detected - Submitting test...
        </div>
      )}

      {questions.length === 0 ? (
        <div className="text-center">
          <div className="spinner-border text-primary" />
          <p>Loading questions...</p>
        </div>
      ) : (
        <form className="mb-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4 p-3 border rounded shadow-sm">
              <h5>Q{qIndex + 1}. {q.question}</h5>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${qIndex}`}
                    id={`q${qIndex}-option${oIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleSelect(qIndex, oIndex)}
                  />
                  <label className="form-check-label" htmlFor={`q${qIndex}-option${oIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <div className="text-center">
            <button type="button" className="btn btn-success px-4 py-2" onClick={handleSubmit}>
              Submit Test
            </button>
          </div>
        </form>
      )}

      {showPopup && (
        <div className={`malpractice-modal visible`}>
          <div className="modal-content animate__animated animate__headShake">
            <div className="modal-icon">
              <i className="bi bi-exclamation-octagon"></i>
            </div>
            <h3>Malpractice Detected!</h3>
            <p>Your test has been flagged for suspicious activity:</p>
            <ul>
              {malpracticeType.map((type, i) => (
                <li key={i}>{type}</li>
              ))}
            </ul>
            <p>Your test is being submitted automatically.</p>
            <div className="countdown">
              Redirecting in 3 seconds...
            </div>
          </div>
        </div>
          )}
          {showCompletionPopup && (
        <div className={`completion-modal visible`}>
          <div className="modal-content animate__animated animate__fadeIn">
            <div className="modal-icon">
              <i className="bi bi-check-circle-fill text-success"></i>
            </div>
            <h3>Test Completed Successfully!</h3>
            <p>Thank you for taking the test. Your responses have been submitted.</p>
            <div className="countdown">
              You will be redirected to login page in 3 seconds...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MCQTest;

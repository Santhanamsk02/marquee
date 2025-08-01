import React, { useEffect, useState } from 'react';


function Test() {
  const [information, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [malpractice, setMalpractice] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [malpracticeType, setMalpracticeType] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [showPopup, setShowPopup] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/admin/codingquestions")
      .then(res => res.json())
      .then(data => setQuestions(data[0].Coding));
  }, []);

  useEffect(() => {
    let timer = setInterval(() => setTimeTaken(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.documentElement.requestFullscreen().catch(() => {
      setIsFullscreen(false);
    });
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);



   const submitAndLogout = async (detectedType) => {
    setShowPopup(true);
    
    const username = localStorage.getItem("token");
   
    const resultData = {
      title: information[index].question,
      language,
      expected_output: information[index].expectedOutput,
      success: false,
      malpractice: true,
      malpractice_type: [...new Set([...malpracticeType, detectedType])],
      timeTaken: Math.floor((Date.now() - startTime) / 1000),

    };
     console.log(resultData);
    const newResults = [...results];
    newResults[index] = resultData;

    await fetch("http://localhost:8000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, results: newResults,totalMarks: newResults.filter(r => r?.success).length,test_type:"Coding",malpractice:detectedType })
    });
    setExamFinished(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 3000);
  };


  const handleCompile = async () => {
    const endTime = Date.now();
    const question = information[index];
    

    const res = await fetch("http://localhost:8000/compile", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language,
        expected_output: question.expectedOutput
      })
    });

    const data = await res.json();
    setOutput(data.output + (data.success ? " ✅" : " ❌"));

    const questionTime = Math.floor((endTime - startTime) / 1000);

    const resultData = {
      title: information[index].question,
      code,
      language,
      expected_output: information[index].expectedOutput,
      output: data.output,
      success: data.success,
      malpractice,
      malpractice_type: malpracticeType,
      timeTaken: questionTime
    };

    const newResults = [...results];
    newResults[index] = resultData;
    setResults(newResults);

    setStartTime(Date.now());
  };

  useEffect(() => {
    const handleCopy = async (e) => {
      e.preventDefault();
      if (examFinished) return;
      setMalpractice(true);
      setMalpracticeType(prev => [...new Set([...prev, "Copy"])]);
      await submitAndLogout("Copy");
    };

    const handleBlur = async (e) => {
      if (examFinished) return;
      setMalpractice(true);
      setMalpracticeType(prev => [...new Set([...prev, "Tab Switch"])]);
      await submitAndLogout("Tab Switch");
    };

    document.addEventListener("copy", handleCopy);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("blur", handleBlur);
    };
  });
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuestionChange = (newIndex) => {
    setIndex(newIndex);
    setOutput("");
    setCode("")
  };

  const handleFinishExam = async () => {
    const username = localStorage.getItem("token");
    await fetch("http://localhost:8000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username, results, totalMarks: results.filter(r => r?.success).length, test_type: "Coding", malpractice:false
       })
    });
    
    setShowCompletionPopup(true);
    setExamFinished(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 4000);
  };

  return (
    <div className="test-container">
      {!isFullscreen && (
        <div className="fullscreen-warning alert alert-warning">
          ⚠️ Please enable fullscreen for the best experience
        </div>
      )}

      <div className="header-bar">
        <div className="time-display">
          <i className="bi bi-clock"></i> {formatTime(timeTaken)}
        </div>
        {malpractice && (
          <div className="malpractice-alert">
            <i className="bi bi-exclamation-triangle"></i> Malpractice Detected
          </div>
        )}
      </div>

      <div className="main-content">
        {information.length > 0 ? (
          <div className="row g-4">
            <div className="col-md-5">
              <div className="question-card glass-card">
                <h3 className="question-title">
                  Question {index + 1} of {information.length} 
                </h3>
                <div className="txt">
                  {information[index].question}
                </div>
                <div className="output-container">
                  <h5>Output:</h5>
                  <pre className={`output ${output.includes("✅") ? 'success' : output.includes("❌") ? 'error' : ''}`}>
                    {output || "Your output will appear here..."}
                  </pre>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="code-editor-container glass-card">
                <div className="editor-header">
                  <select 
                    className="form-select language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                  </select>
                  
                  <button 
                    className="btn btn-primary compile-btn"
                    onClick={handleCompile}
                  >
                    <i className="bi bi-play-fill"></i> Run Code
                  </button>
                </div>
                
                <textarea
                  className="code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Write your ${language} code here...`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="loading-placeholder">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading questions...</p>
          </div>
        )}
      </div>

      <div className="navigation-footer">
        <button 
          className="btn btn-outline-primary"
          disabled={index === 0}
          onClick={() => handleQuestionChange(index - 1)}
        >
          <i className="bi bi-arrow-left"></i> Previous
        </button>
        
        <button 
          className="btn btn-success"
          onClick={handleFinishExam}
        >
          <i className="bi bi-check-circle"></i> Finish Exam
        </button>
        
        <button 
          className="btn btn-outline-primary"
          disabled={index === information.length - 1}
          onClick={() => handleQuestionChange(index + 1)}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>

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

export default Test;
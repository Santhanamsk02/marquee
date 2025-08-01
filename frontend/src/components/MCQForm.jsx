import { useState } from "react";

export default function MCQForm({ formData, setFormData, submitTest }) {
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [q, setQ] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 1
  });

  const handleNext = () => {
    const updated = [...questions, q];
    setQuestions(updated);
    setQ({ question: "", options: ["", "", "", ""], correctAnswer: 1 });

    if (updated.length === formData.numQuestions) {
      submitTest({ ...formData, questions: updated });
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div>
      <h3>MCQ Question {current + 1}</h3>
      <input placeholder="Question" value={q.question} onChange={e => setQ({ ...q, question: e.target.value })} /><br />
          {q.options.map((opt, i) => (
          <div>
        <input key={i} placeholder={`Option ${i + 1}`} value={opt}
          onChange={e => {
            const newOpts = [...q.options];
            newOpts[i] = e.target.value;
            setQ({ ...q, options: newOpts });
                      }} />
                  <br/>
                  </div>
      ))}
      <input placeholder="Correct Option (1-4)" type="number" value={q.correctAnswer}
        onChange={e => setQ({ ...q, correctAnswer: parseInt(e.target.value) })} /><br />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

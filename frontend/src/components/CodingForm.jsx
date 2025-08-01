import { useState } from "react";

export default function CodingForm({ formData, setFormData, submitTest }) {
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [q, setQ] = useState({
    title: "",
    expected_output: ""
  });

  const handleNext = () => {
    const updated = [...questions, q];
    setQuestions(updated);
    setQ({ title: "", expected_output: "" });

    if (updated.length === formData.numQuestions) {
      submitTest({ ...formData, questions: updated });
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div>
      <h3>Coding Question {current + 1}</h3>
      <input placeholder="Title" value={q.title} onChange={e => setQ({ ...q, title: e.target.value })} /><br />
      <textarea placeholder="Expected Output" value={q.expected_output} onChange={e => setQ({ ...q, expected_output: e.target.value })}></textarea><br />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

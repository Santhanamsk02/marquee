import { useEffect, useState } from "react";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ id: "", title: "", expected_output: "" });

  useEffect(() => {
    fetch("http://localhost:8000/admin/questions")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleAdd = async () => {
    await fetch("http://localhost:8000/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    alert("Question Added");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Manage Questions</h3>
      <input placeholder="ID" onChange={e => setForm({ ...form, id: parseInt(e.target.value) })} /><br />
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} /><br />
      <textarea placeholder="Expected Output" onChange={e => setForm({ ...form, expected_output: e.target.value })}></textarea><br />
      <button onClick={handleAdd}>Add Question</button>

      <hr />
      <h4>Existing Questions</h4>
      <ul>
        {questions.map(q => (
          <li key={q.id}>{q.id}. {q.title}</li>
        ))}
      </ul>
    </div>
  );
}

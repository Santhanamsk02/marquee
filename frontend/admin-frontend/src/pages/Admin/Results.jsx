import { useEffect, useState } from "react";

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/admin/results")
      .then(res => res.json())
          .then(data => setResults(data));      
  }, []);

    return (
      
      <div style={{ padding: 20 }}>
      <h3>Student Results</h3>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            {r.username} - Total Marks: {r.total_marks} - {new Date(r.submitted_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

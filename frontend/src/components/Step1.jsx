export default function Step1({ formData, setFormData, nextStep }) {
  return (
    <div>
      <h2>Step 1: Test Details</h2>
      <input placeholder="Test Name" onChange={e => setFormData({ ...formData, testName: e.target.value })} /><br />
      <input placeholder="Duration (in minutes)" type="number" onChange={e => setFormData({ ...formData, duration: e.target.value })} /><br />
      <select onChange={e => setFormData({ ...formData, type: e.target.value })}>
        <option value="">Select Type</option>
        <option value="MCQ">MCQ</option>
        <option value="Coding">Coding</option>
      </select><br />
      <input placeholder="Number of Questions" type="number" onChange={e => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })} /><br />
      <button onClick={nextStep}>Next</button>
    </div>
  );
}
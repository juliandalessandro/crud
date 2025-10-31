import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecord } from "../services/recordsApi"; 
import "../App.css";

function UploadRecord() {

  const navigate = useNavigate();

  const [record, setRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    cover: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createRecord(record);

      setRecord({ title: "", artist: "", year: "", genre: "", cover: "" });

      navigate("/", { 
        state: { toastMessage: "Record uploaded successfully" }, 
        replace: true 
      });

    } catch (err) {
      console.error(err);
      setError("Error uploading record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Record</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input className="form-input" type="text" name="title" placeholder="Title" value={record.title} onChange={handleChange} required />
        <input className="form-input" type="text" name="artist" placeholder="Artist" value={record.artist} onChange={handleChange} required />
        <input className="form-input" type="number" name="year" placeholder="Year" value={record.year} onChange={handleChange} required />
        <input className="form-input" type="text" name="genre" placeholder="Genre" value={record.genre} onChange={handleChange} required />
        <input className="form-input" type="text" name="cover" placeholder="Cover URL" value={record.cover} onChange={handleChange} required />

        <button className="btn-upload" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default UploadRecord;
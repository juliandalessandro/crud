import axios from "axios";
import { useEffect, useState } from "react";
import '../App.css';

function ListOfRecords() {

  const [listOfRecords, setListOfRecords] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/records").then((response) => {
      setListOfRecords(response.data);
    });
  }, []);

  return (
    <div className="records-container">
      <h2>List of Records</h2>

      <div className="records-grid">
        {listOfRecords.map((record) => (
          <div className="record-card" key={record.id}>
            <img 
              src={record.cover} 
              alt={record.title}
              className="record-cover"
            />

            <h3 className="record-title">
              {record.title} <span>({record.year})</span>
            </h3>

            <p className="record-artist">{record.artist}</p>
            <p className="record-genre">{record.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOfRecords;

import React from 'react';
import '../App.css';

function RecordCard({ record, onEdit, onDelete }) {
  return (
    <div className="record-card">
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

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(record)}>✏️</button>
        <button className="btn-delete" onClick={() => onDelete(record)}>🗑️</button>
      </div>
    </div>
  );
}

export default RecordCard;

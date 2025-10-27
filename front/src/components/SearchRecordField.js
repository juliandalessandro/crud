import '../App.css';

function SearchRecordField({ search, setSearch }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto 16px', display: 'flex', gap: 8 }}>
      <input
        type="search"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-input"
        style={{ flex: 1 }}
      />
      {/* En el futuro: botones/selects para filtros por artista/género/año */}
    </div>
  );
}

export default SearchRecordField;

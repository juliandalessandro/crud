//REACT imports
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
//LIBRARIES imports
import axios from "axios";
//CSS import
import '../App.css';
//COMPONENTS imports
import EditRecordModal from "../components/EditRecordModal";
import DeleteRecordModal from "../components/DeleteRecordModal";
import SearchRecordField from "../components/SearchRecordField";
import RecordCard from "../components/RecordCard";

function ListOfRecords() {
  
  const location = useLocation(); //to get the toast message from UploadRecord to ListOfRecords page
  const [listOfRecords, setListOfRecords] = useState([]); //List of records from records table
  const [isClosing, setIsClosing] = useState(false); //For modal closing
  

  // SEARCH + DEBOUNCE states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  // EDIT states
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [editRecord, setEditRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    cover: ""
  });
  const [editMessage, setEditMessage] = useState("");


  // DELETE states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");


  // UPLOAD states
  // Upload toast (comes from UploadRecord via location.state)
  const [uploadMessage, setUploadMessage] = useState("");


  /* ------------------ FETCH records ------------------ */
  useEffect(() => {
    let mounted = true;
    axios.get("http://localhost:3001/records")
      .then((response) => {
        if (!mounted) return;
        setListOfRecords(response.data || []);
      })
      .catch((err) => {
        console.error("Error fetching records:", err);
      });
    return () => { mounted = false; };
  }, []);

  /* ----------------------- UPLOAD handlers----------------------- */
  /* ------------- In order to not show the Record Upload toast message on F5------------- */
  useEffect(() => {
    if (location.state?.toastMessage) {
      setUploadMessage(location.state.toastMessage);

      // Important: clear the history state so F5 won't show the toast again
      try {
        // keep current url but replace state (clears any state passed)
        window.history.replaceState({}, document.title);
      } catch (err) {
        // fallback: ignore
        // some environments may restrict replaceState
      }

      const t = setTimeout(() => setUploadMessage(""), 2500);
      return () => clearTimeout(t);
    }
  }, [location.state]);


  /* ----------------------- SEARCH handlers----------------------- */

  /* ------------------ Filter List ------------------ */
  const filteredRecords = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (!q) return listOfRecords;
    return listOfRecords.filter(r =>
      (r.title || "").toString().toLowerCase().includes(q)
    );
  }, [listOfRecords, debouncedSearch]);
  
  /* ------------------ Debounce for Search ------------------ */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // ms debounce (ajustable)

    return () => clearTimeout(handler);
  }, [search]);

  
  /* ----------------------- MODAL handlers----------------------- */
  /* ------------------ Keyboard Handling (Esc to close modal) ------------------ */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseDelete();
        handleCloseEdit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // deps empty: attach once
  

  /* ----------------------- DELETE handlers----------------------- */
  /* ----------------------- Set record to delete ----------------------- */
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  /* ----------------------- Close Delete modal ----------------------- */
  const handleCloseDelete = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
      setRecordToDelete(null);
    }, 200); // match CSS fade duration
  };

  /* ----------------------- Delete API ----------------------- */
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await axios.delete(`http://localhost:3001/records/${recordToDelete.id}`);
      handleCloseDelete();
      setListOfRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
      setDeleteMessage(`Deleted: ${recordToDelete.title}`);
      setTimeout(() => setDeleteMessage(""), 2500);
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  /* ----------------------- EDIT handlers ----------------------- */
  /* ----------------------- Set record to Edit ----------------------- */
  const handleEdit = (record) => {
    setRecordToEdit(record);
    // ensure primitive normalization (strings) so comparison behaves
    setEditRecord({
      title: record.title ?? "",
      artist: record.artist ?? "",
      year: record.year ?? "",
      genre: record.genre ?? "",
      cover: record.cover ?? ""
    });
    setShowEditModal(true);
    document.body.classList.add("modal-open");
  };

  /* ----------------------- Set changes ----------------------- */
  const handleEditChange = (e) => {
    setEditRecord(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ----------------------- Checking actual changes on record edit ----------------------- */
  /* true si hay alguna diferencia real entre original y edit (normalizando a string) */
  const isEditChanged = () => {
    if (!recordToEdit) return false;

    const fields = ["title", "artist", "year", "genre", "cover"];

    return fields.some(key =>
      String(recordToEdit[key] ?? "") !== String(editRecord[key] ?? "")
    );
  };

  /* ----------------------- Close Edit modal ----------------------- */
  const handleCloseEdit = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditModal(false);
      setIsClosing(false);
      document.body.classList.remove("modal-open");
      setRecordToEdit(null);
      setEditRecord({ title: "", artist: "", year: "", genre: "", cover: "" });
    }, 200);
  };

  /* ----------------------- Edit API ----------------------- */
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!recordToEdit) return;
    try {
      // close modal with fade immediately
      handleCloseEdit();

      await axios.put(`http://localhost:3001/records/${recordToEdit.id}`, editRecord);

      // update local list
      setListOfRecords(prev =>
        prev.map(r => (r.id === recordToEdit.id ? { ...r, ...editRecord } : r))
      );

      setEditMessage("Record updated");
      setTimeout(() => setEditMessage(""), 2500);
    } catch (err) {
      console.error("Error updating record:", err);
      setEditMessage("Error updating record");
      setTimeout(() => setEditMessage(""), 2500);
    }
  };



  /* ----------------------- RENDER ----------------------- */

  return (
    <div className="records-container">
      {/* SEARCH FIELD */}
      <SearchRecordField
        search={search}
        setSearch={setSearch}
      />

      <h2>List of Records</h2>

      <div className="records-grid">
        {filteredRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>


      {/* ----------------------- DELETE MODAL ----------------------- */}
      {showDeleteModal && <DeleteRecordModal
            show={showDeleteModal}
            isClosing={isClosing}
            record={recordToDelete}
            onCancel={handleCloseDelete}
            onConfirm={handleConfirmDelete}
        />
      }


      {/* ----------------------- EDIT MODAL ----------------------- */}
      {showEditModal && <EditRecordModal
            show={showEditModal}
            isClosing={isClosing}
            record={editRecord}
            onClose={handleCloseEdit}
            onChange={handleEditChange}
            onSubmit={handleSubmitEdit}
            isChanged={isEditChanged}
        />
      }


      {/* ----------------------- TOAST MESSAGES ----------------------- */}
      {editMessage && <div className="toast-message-edit-upload">{editMessage}</div>}
      {deleteMessage && <div className="toast-message">{deleteMessage}</div>}
      {uploadMessage && <div className="toast-message-edit-upload">{uploadMessage}</div>}
    </div>
  );
}

export default ListOfRecords;

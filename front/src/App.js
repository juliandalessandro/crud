import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListOfRecords from "./pages/ListOfRecords";
import UploadRecord from "./pages/UploadRecord";

function App() {

  return (
    <Router>
      <div className="App"> 
      
        <Navbar />

        <Routes>
          <Route path="/" element={<ListOfRecords />}/>
          <Route path="/uploadRecord" element={<UploadRecord />}/>
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;

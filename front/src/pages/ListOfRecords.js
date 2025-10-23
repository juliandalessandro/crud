import axios from "axios";
import { useEffect, useState } from "react";


function ListOfRecords() {

  const [listOfRecords, setListOfRecords] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/records").then((response) => {
      setListOfRecords(response.data);
    })
  }, []);

  return (
    <div>
      
      <h2>List of Records</h2>

      {listOfRecords.map((value, key) => {
            return <div>

              <div> {value.title} </div>
              <div> {value.artist} </div>
              <div> {value.year} </div>
              <div> {value.genre} </div>

            </div>
      })}

    </div>
    
  )
}

export default ListOfRecords;
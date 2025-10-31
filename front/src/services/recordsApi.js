const BASE_URL = "http://localhost:3001/records";

// GET all records
export async function getRecords() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
}

// UPLOAD record
export async function createRecord(data) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Failed to create record");
  return response.json();
}

// UPDATE record
export async function updateRecord(id, data) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update record");
  return response.json();
}

// DELETE record
export async function deleteRecord(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete record");

  // Some backends return no JSON on delete, so avoid parsing
  try {
    return await response.json();
  } catch {
    return true; // consider delete successful
  }
}

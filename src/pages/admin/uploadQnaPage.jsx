import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAllFiles } from "../../../appwrite/admin/jsonqna.js";
import "../../styles/adminPage.css";

const server = "https://bckd.onrender.com";
const ITEMS_PER_PAGE = 5;

const PDFManager = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setFetchingFiles(true);
    try {
      const files = await fetchAllFiles();
      const normalized = files.map((f) => ({
        name: f.name || f.NAME,
        max_id: f.max_id || f.MAX_SIZE,
        docId: f.docId || f.$id,
      }));
      setUploadedFiles(normalized);
    } catch (error) {
      console.error("Fetch files error:", error);
    } finally {
      setFetchingFiles(false);
    }
  };

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => setStatus(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const paginatedFiles = uploadedFiles.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
    } else {
      setStatus("❗ Only JSON files are allowed.");
    }
  };

  const handleUpload = async () => {
  if (!file || !name.trim()) {
    setStatus("❗ Please provide both a file and a name.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", name);

  setLoading(true);
  setStatus("⏳ Uploading...");

  try {
    const uploadUrl = `${server}/upload/json/qna`;
    const response = await axios.post(uploadUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const newFile = {
      name: response.data.file_name,
      max_id: response.data.max_id,
      docId: response.data.doc_id,
    };

    setUploadedFiles((prev) => [newFile, ...prev]); // ⬅️ Insert new file at the top
    setStatus("✅ Upload successful and metadata saved.");
    setName("");
    setFile(null);
    document.querySelector(".input-file").value = null;
  } catch (error) {
    console.error("Upload or metadata error:", error);
    setStatus("❌ Upload or saving metadata failed.");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (name, max_id, docId) => {
  if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

  setDeletingId(docId);
  setStatus(`🗑️ Deleting "${name}"...`);

  try {
    const form = new FormData();
    form.append("file_name", name);
    form.append("max_id", max_id);
    form.append("doc_id", docId);

    await axios.post(`${server}/upload/json/qna/delete`, form);

    // ✅ Remove from local state instead of re-fetching
    setUploadedFiles((prev) => prev.filter((file) => file.docId !== docId));

    setStatus(`✅ "${name}" deleted successfully.`);
  } catch (error) {
    console.error("Delete failed:", error);
    setStatus(`❌ Failed to delete "${name}".`);
  } finally {
    setDeletingId(null);
  }
};


  return (
    <div className="pdf-container">
      <h2>📄 JSON Data Upload</h2>

      <div className="upload-box">
        <input
          type="text"
          placeholder="Enter file name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-text"
          disabled={loading}
        />
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="input-file"
          disabled={loading}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-upload"
        >
          {loading ? "⏳ Uploading..." : "📤 Upload"}
        </button>
      </div>

      {status && <p className="status-msg">{status}</p>}

      <div className="uploaded-list">
        {fetchingFiles ? (
          <p>Loading files...</p>
        ) : paginatedFiles.length === 0 ? (
          <p>No uploaded files found.</p>
        ) : (
          paginatedFiles.map((file) => (
            <div key={file.docId} className="file-card">
              <div className="file-info">
                <strong>{file.name}</strong>
                <p>Entries: {file.max_id}</p>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDelete(file.name, file.max_id, file.docId)}
                disabled={loading || deletingId === file.docId}
              >
                {deletingId === file.docId ? "🗑️ Deleting..." : "Delete"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pagination-controls">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          ◀ Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={(page + 1) * ITEMS_PER_PAGE >= uploadedFiles.length}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default PDFManager;

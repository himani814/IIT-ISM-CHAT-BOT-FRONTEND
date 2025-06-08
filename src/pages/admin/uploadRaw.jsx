import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  storeFileMeta,
  deleteFileMeta,
  fetchAllFiles,
} from "../../../appwrite/appwriteUploadRaw.js";
import "../../styles/adminPage.css";

const server = "https://bckd.onrender.com";

const PDFManager = () => {
  const [name, setName] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entryCategory, setEntryCategory] = useState("");
  const [dataEntries, setDataEntries] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await fetchAllFiles();
        console.log(files)
        setUploadedFiles(files);
        setHasMore(files.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Fetch files error:", error);
      }
    };
    loadFiles();
  }, []);

  const paginatedFiles = uploadedFiles.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handleAddEntry = () => {
    if (!entryText.trim()) {
      setStatus("❗ Please enter text for the entry.");
      return;
    }

    const entryTextWordCount = entryText.trim().split(/\s+/).length;
    if (entryTextWordCount > 100) {
      setStatus("❗ Entry text must not exceed 100 words.");
      return;
    }

    const entryCategoryWordCount = entryCategory.trim().split(/\s+/).length;
    if (entryCategoryWordCount > 250) {
      setStatus("❗ Category must not exceed 250 words.");
      return;
    }

    if (!name.trim()) {
      setStatus("❗ Please enter a file name before adding entries.");
      return;
    }

    const id = `${name}${dataEntries.length + 1}`;
    const newEntry = {
      _id: id,
      text: entryText.trim(),
      category: entryCategory.trim(),
    };

    setDataEntries((prev) => [...prev, newEntry]);
    setEntryText("");
    setEntryCategory("");
    setStatus("");
  };

  const handleUpload = async () => {
    if (!name.trim() || dataEntries.length === 0) {
      setStatus("❗ Please enter a file name and add at least one entry.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Uploading...");

    try {
      const payload = {
        name: name.trim(),
        data: dataEntries,
      };

      const response = await axios.post(`${server}/upload/raw`, payload);
      const max_id = response.data.max_id || 0;

      const docId = await storeFileMeta(name.trim(), max_id);

      setUploadedFiles((prev) => [
        { name: name.trim(), max_id, docId },
        ...prev,
      ]);
      setStatus("✅ Uploaded successfully.");
      setName("");
      setDataEntries([]);
    } catch (error) {
      console.error(error);
      setStatus("❌ Upload or saving metadata failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (NAME, MAX_SIZE) => {
    const confirm = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirm) return;

    try {
      await axios.post(`${server}/delete`, {
        name: NAME,
        max_id: parseInt(MAX_SIZE),
      });

      const fileToDelete = uploadedFiles.find((f) => f.name === name);
      if (fileToDelete?.docId) {
        await deleteFileMeta(fileToDelete.docId);
      }

      const updatedFiles = uploadedFiles.filter((f) => f.name !== name);
      setUploadedFiles(updatedFiles);
      setHasMore(updatedFiles.length > (page + 1) * ITEMS_PER_PAGE);
      setStatus("🗑️ File deleted from backend and database.");
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("❌ Delete failed.");
    }
  };

  const handleNextPage = () => {
    if ((page + 1) * ITEMS_PER_PAGE < uploadedFiles.length) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  return (
    <div className="pdf-container">
      <h2>📄 Raw Data Upload</h2>

      <div className="upload-box">
        <input
          type="text"
          placeholder="Enter file name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-text"
        />

        <textarea
          placeholder="Enter text (max 100 words)"
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          className="input-text"
          rows={3}
        />

        <input
          type="text"
          placeholder="Enter category (optional, max 250 words)"
          value={entryCategory}
          onChange={(e) => setEntryCategory(e.target.value)}
          className="input-text"
        />

        <button onClick={handleAddEntry} className="btn-upload">
          ➕ Add Entry
        </button>

        <button onClick={handleUpload} disabled={loading} className="btn-upload">
          {loading ? "Uploading..." : "📤 Upload"}
        </button>
      </div>

      {status && <p className="status-msg">{status}</p>}

      {dataEntries.length > 0 && (
        <div className="entry-list">
          <h4>Entries to Upload:</h4>
          {dataEntries.map((entry, index) => (
            <div key={index} className="entry-item">
              <strong>{entry._id}</strong>: {entry.text} — <em>{entry.category}</em>
            </div>
          ))}
        </div>
      )}

      <div className="uploaded-list">
        {paginatedFiles.length === 0 ? (
          <p>No files found.</p>
        ) : (
          paginatedFiles.map((file, idx) => (
            <div key={idx} className="file-card">
              <div className="file-info">
                <strong>{file.NAME}</strong>
                <p>NUMBER_CHUNK: {file.MAX_SIZE}</p>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDelete(file.name, file.max_id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 0}>
          ◀ Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page + 1}</span>
        <button
          onClick={handleNextPage}
          disabled={(page + 1) * ITEMS_PER_PAGE >= uploadedFiles.length}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default PDFManager;

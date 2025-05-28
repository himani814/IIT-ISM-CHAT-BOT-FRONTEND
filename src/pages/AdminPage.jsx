import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  storeFileMeta,
  fetchAllFiles,
  deleteFileMeta,
} from "../../appwrite/appwriteUploadPdf.js"; // Import Appwrite functions
import "../styles/adminPage.css";

const PDFManager = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      setStatus("❗ Please provide both a file and a name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    setLoading(true);
    setStatus("⏳ Uploading...");

    try {
      // Upload file to backend (Pinecone + file storage)
      const response = await axios.post(
        "https://bckd.onrender.com/upload/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const max_id = response.data.max_id || 0;

      // Save metadata to Appwrite
      const metaResponse = await storeFileMeta(name, max_id);

      // Add documentId to state for delete use
      setUploadedFiles((prev) => [
        ...prev,
        { name, max_id, docId: metaResponse.$id },
      ]);
      setStatus("✅ Upload successful and metadata saved.");
      setName("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus("❌ Upload or saving metadata failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name, max_id) => {
    try {
      // First delete from backend (Pinecone)
      await axios.post("https://bckd.onrender.com/delete/", {
        name,
        max_id: parseInt(max_id),
      });

      // Find the documentId of the file metadata in uploadedFiles
      const fileToDelete = uploadedFiles.find((f) => f.name === name);

      if (fileToDelete?.docId) {
        // Then delete from Appwrite database
        await deleteFileMeta(fileToDelete.docId);
      }

      // Update UI after deletion
      setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
      setStatus("🗑️ File deleted from backend and database.");
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("❌ Delete failed.");
    }
  };

  // Load files from Appwrite on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const documents = await fetchAllFiles();
        // Map Appwrite documents to state, including docId for deletion
        const files = documents.map((doc) => ({
          name: doc.NAME,
          max_id: doc.MAX_SIZE,
          docId: doc.$id,
        }));
        setUploadedFiles(files);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        setStatus("❌ Failed to load uploaded files.");
      }
    };

    loadFiles();
  }, []);

  return (
    <div className="pdf-container">
      <h2>📄 PDF Upload & Management</h2>

      <div className="upload-box">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-text"
        />

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="input-file"
        />

        <button onClick={handleUpload} disabled={loading} className="btn-upload">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {status && <p className="status-msg">{status}</p>}

      <div className="uploaded-list">
        {uploadedFiles.map((file, idx) => (
          <div key={idx} className="file-card">
            <div className="file-info">
              <strong>{file.name}</strong>
              <p>max_id: {file.max_id}</p>
            </div>
            <button
              className="btn-delete"
              onClick={() => handleDelete(file.name, file.max_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFManager;

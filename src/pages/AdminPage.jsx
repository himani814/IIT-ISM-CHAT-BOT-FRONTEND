import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  storeFileMeta,
  fetchAllFiles,
  deleteFileMeta,
} from "../../appwrite/appwriteUploadPdf.js";
import "../styles/adminPage.css";

const PDFManager = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("pdf"); // "pdf" or "text"
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
      const uploadUrl =
        fileType === "pdf"
          ? "https://bckd.onrender.com/upload/pdf"
          : "https://bckd.onrender.com/upload/text";

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const max_id = response.data.max_id || 0;

      const metaResponse = await storeFileMeta(name, max_id);

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
      await axios.post("https://bckd.onrender.com/delete/", {
        name: `${name}_0`,
        max_id: parseInt(max_id),
      });

      const fileToDelete = uploadedFiles.find((f) => f.name === name);

      if (fileToDelete?.docId) {
        await deleteFileMeta(fileToDelete.docId);
      }

      setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
      setStatus("🗑️ File deleted from backend and database.");
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("❌ Delete failed.");
    }
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const documents = await fetchAllFiles();
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
      <h2>📄 File Upload & Management</h2>

      <div className="upload-box">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-text"
        />

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="input-select"
        >
          <option value="pdf">PDF</option>
          <option value="text">Text</option>
        </select>

        <input
          type="file"
          accept={fileType === "pdf" ? ".pdf" : ".txt"}
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

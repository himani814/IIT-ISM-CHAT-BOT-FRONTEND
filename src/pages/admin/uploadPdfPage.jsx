import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  fetchAllFiles,
} from "../../../appwrite/admin/fetch_from_appwrite.js";
import "../../styles/adminPage.css";


const server = "https://bckd.onrender.com";
// const server="http://localhost:8000";


const PDFManager = () => {
  const { folder_id: collection_id } = useParams();

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);

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
    formData.append("filename", name);
    formData.append("collection_id", collection_id);

    setLoading(true);
    setStatus("⏳ Uploading...");

    try {
      const uploadUrl =
        fileType === "pdf"
          ? `${server}/upload/gemini/pdf`
          : `${server}/upload/gemini/text`;

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const max_id = response.data.max_id || 0;
      const metaResponse = await storeFileMeta(name, max_id);

      const newFile = {
        name,
        max_id,
        docId: metaResponse.$id,
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
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
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.post(`${server}/delete`, {
        name,
        max_id: parseInt(max_id),
      });

      const fileToDelete = uploadedFiles.find(
        (f) => f.name === name || f.NAME === name
      );

      if (fileToDelete?.docId) {
        await deleteFileMeta(fileToDelete.docId);
      }

      setUploadedFiles((prev) => prev.filter((f) => f.name !== name && f.NAME !== name));
      setStatus("🗑️ File deleted from backend and database.");
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("❌ Delete failed.");
    }
  };

  useEffect(() => {
    const loadFiles = async () => {
      setLoadingFiles(true);
      try {
        const files = await fetchAllFiles(collection_id);
        const normalized = files.map((f) => ({
          name: f.name || f.NAME || "Unnamed",
          max_id: f.max_id || f.MAX_SIZE || 0,
          docId: f.$id || f.docId || null,
        }));
        setUploadedFiles(normalized);
      } catch (error) {
        console.error("Fetch files error:", error);
      } finally {
        setLoadingFiles(false);
      }
    };
    loadFiles();
  }, [collection_id]);

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
        {loadingFiles ? (
          <p>Loading files...</p>
        ) : uploadedFiles.length === 0 ? (
          <p>No files found.</p>
        ) : (
          uploadedFiles.map((file, idx) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default PDFManager;

import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchDocument } from "../../../appwrite/admin/fetchDocument.js";
import "../../styles/admin/folderPage.css";

// Use server constant
const server = "https://bckd.onrender.com";
// const server = "http://localhost:8000";



const FolderPage = () => {
  const { folder_id: collection_id } = useParams();
  const location = useLocation();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState(null);

  const loadFolders = async () => {
    setLoading(true);
    try {
      const data = await fetchDocument(collection_id);
      setFolders(data || []);
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const baseName = prompt("Enter base folder name:");
    if (!baseName) return;

    setCreating(true);
    try {
      const res = await fetch(`${server}/admin/create-document-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_collection_id: collection_id,
          folder_name: baseName,
        }),
      });

      if (!res.ok) throw new Error("Folder creation failed");
      await loadFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    setDeletingFolderId(folder.$id);
    try {
      const res = await fetch(`${server}/admin/delete-document-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_collection_id: folder.$collectionId,
          folder_collection_id: folder.sub_folder_id,
        }),
      });

      if (!res.ok) throw new Error("Folder deletion failed");
      await loadFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
    } finally {
      setDeletingFolderId(null);
    }
  };

  const getRoutePath = (folder) => {
    const id = folder.sub_folder_id || folder.$id;
    const path = location.pathname.toLowerCase();
    if (path.includes("/raw/")) return `/admin/raw/subfolder/${id}`;
    if (path.includes("/pdf/")) return `/admin/pdf/subfolder/${id}`;
    if (path.includes("/qna/")) return `/admin/qna/subfolder/${id}`;
    return `/admin/subfolder/${id}`;
  };

  useEffect(() => {
    if (collection_id) loadFolders();
  }, [collection_id]);

  return (
    <div className="folder-container">
      <h2>📁 Folder Manager: {collection_id}</h2>

      <button
        className="btn-create"
        onClick={handleCreateFolder}
        disabled={creating}
      >
        {creating ? "⏳ Creating..." : "➕ Create topic wise folder"}
      </button>

      {loading ? (
        <p className="info-text">Loading folders...</p>
      ) : folders.length === 0 ? (
        <p className="info-text">No folders found.</p>
      ) : (
        <ul className="folder-list">
          {folders.map((folder) => (
            <li key={folder.$id} className="folder-item">
              <Link to={getRoutePath(folder)} className="folder-link">
                📂 {folder.folder_name}
              </Link>
              <button
                className="btn-delete"
                onClick={() => handleDeleteFolder(folder)}
                disabled={deletingFolderId === folder.$id}
              >
                {deletingFolderId === folder.$id ? "Deleting..." : "❌ Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderPage;

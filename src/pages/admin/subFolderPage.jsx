import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchDocument } from "../../../appwrite/admin/fetchDocument.js";

const FolderPage = () => {
  const { folder_id: collection_id } = useParams();
  const location = useLocation();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

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


    const finalName = `${baseName}`;

    try {
      const res = await fetch("http://localhost:8000/admin/create-document-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_collection_id: collection_id,
          folder_name: finalName,
        }),
      });

      if (!res.ok) throw new Error("Folder creation failed");

      await loadFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    try {
      const res = await fetch("http://localhost:8000/admin/delete-document-folder", {
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
    <div style={{ padding: "20px" }}>
      <h2>📁 Folder Manager: {collection_id}</h2>
      <button onClick={handleCreateFolder}>➕ Create topic wise folder</button>

      {loading ? (
        <p>Loading folders...</p>
      ) : folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.$id}>
              <Link
                to={getRoutePath(folder)}
                style={{ textDecoration: "none", color: "blue" }}
              >
                {folder.folder_name}
              </Link>
              <button
                style={{ marginLeft: "10px", color: "red" }}
                onClick={() => handleDeleteFolder(folder)}
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderPage;

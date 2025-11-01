import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./components/UserForm";

export default function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  const API_URL = "http://localhost:5000/api/users";

  const getUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    getUsers();
  };

  const startEdit = (user) => setEditingUser(user);
  const cancelEdit = () => setEditingUser(null);

  // This is triggered when a new user is added
  const handleRefreshWithHighlight = async () => {
    const res = await axios.get(API_URL);
    // find the newly added user (assuming new user is last)
    const newUser = res.data[res.data.length - 1];
    setUsers(res.data);

    if (newUser) {
      setHighlightId(newUser._id);
      setTimeout(() => setHighlightId(null), 2000); // remove highlight after 2s
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // 💅 Inline styles for each user item
  const styles = {
    listItem: (isHighlighted) => ({
      background: isHighlighted ? "#d4edda" : "#f8f9fa",
      border: isHighlighted
        ? "2px solid #28a745"
        : "1px solid #ddd",
      borderRadius: "8px",
      margin: "10px 0",
      padding: "10px 15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.4s ease",
      boxShadow: isHighlighted
        ? "0 0 8px rgba(40, 167, 69, 0.4)"
        : "0 1px 3px rgba(0,0,0,0.1)",
    }),
    button: {
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      cursor: "pointer",
      fontSize: "13px",
      marginLeft: "6px",
      transition: "0.3s",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    editButton: {
      backgroundColor: "#28a745",
      color: "#fff",
    },
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto" }}>
      <h2 style={{ textAlign: "center" }}>Simple CRUD App</h2>

      <UserForm
        refresh={handleRefreshWithHighlight}
        editingUser={editingUser}
        cancelEdit={cancelEdit}
      />

      <h3>Users</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li
            key={u._id}
            style={styles.listItem(u._id === highlightId)}
          >
            <div>
              <strong>{u.name}</strong> — {u.email} — {u.address}
            </div>
            <div>
              <button
                style={{ ...styles.button, ...styles.deleteButton }}
                onClick={() => deleteUser(u._id)}
              >
                Delete
              </button>
              <button
                style={{ ...styles.button, ...styles.editButton }}
                onClick={() => startEdit(u)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

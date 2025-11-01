import { useState, useEffect } from "react";
import axios from "axios";

// 🎨 Modern inline CSS styles
const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    maxWidth: "700px",
    margin: "20px auto",
  },
  title: {
    textAlign: "center",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
  form: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "12px 15px",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    width: "180px",
    fontSize: "15px",
    background: "rgba(255,255,255,0.9)",
    color: "#333",
    transition: "0.2s ease",
    outline: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 8px rgba(0,123,255,0.4)",
  },
  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "0.3s",
    fontWeight: "500",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
  addButton: {
    background: "linear-gradient(135deg, #007bff, #00c6ff)",
    color: "white",
  },
  addHover: {
    background: "linear-gradient(135deg, #0056b3, #007bff)",
  },
  cancelButton: {
    background: "linear-gradient(135deg, #6c757d, #868e96)",
    color: "white",
  },
  cancelHover: {
    background: "linear-gradient(135deg, #5a6268, #6c757d)",
  },
};

export default function UserForm({ refresh, editingUser, cancelEdit }) {
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [hoverBtn, setHoverBtn] = useState("");
  const API_URL = "http://localhost:5000/api/users";

  // Fill form automatically when editing
  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        address: editingUser.address || "",
      });
    } else {
      setForm({ name: "", email: "", address: "" });
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      await axios.put(`${API_URL}/${editingUser._id}`, form);
      cancelEdit();
    } else {
      await axios.post(API_URL, form);
    }

    setForm({ name: "", email: "", address: "" });
    refresh();
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>
        {editingUser ? "Update User" : "Add New User"}
      </h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Name"
          style={styles.input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          style={styles.input}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Address"
          style={styles.input}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* Add / Update Button */}
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(hoverBtn === "add"
              ? styles.addHover
              : styles.addButton),
          }}
          onMouseEnter={() => setHoverBtn("add")}
          onMouseLeave={() => setHoverBtn("")}
        >
          {editingUser ? "Update" : "Add"}
        </button>

        {/* Cancel Button */}
        {editingUser && (
          <button
            type="button"
            style={{
              ...styles.button,
              ...(hoverBtn === "cancel"
                ? styles.cancelHover
                : styles.cancelButton),
            }}
            onMouseEnter={() => setHoverBtn("cancel")}
            onMouseLeave={() => setHoverBtn("")}
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

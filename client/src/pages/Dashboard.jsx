import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    } else {
      fetchExpenses();
    }
  }, []);

  const fetchExpenses = async () => {
    const res = await API.get("/expenses", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setExpenses(res.data);
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
        }
      });
      fetchExpenses();
    };

  const addExpense = async (e) => {
    e.preventDefault();
    await API.post(
      "/expenses",
      {
        amount,
        category,
        description,
        date: new Date()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setAmount("");
    setDescription("");
    fetchExpenses();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button
      onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/";
        }}
      >
        Logout
      </button>

      <form onSubmit={addExpense}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />

        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Others</option>
        </select>

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button type="submit">Add Expense</button>
      </form>

      <hr />

      <h3>Your Expenses</h3>
      <ul>
        {expenses.map(exp => (
          <li key={exp._id}>
            ₹{exp.amount} - {exp.category} - {exp.description}
            <button onClick={() => deleteExpense(exp._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

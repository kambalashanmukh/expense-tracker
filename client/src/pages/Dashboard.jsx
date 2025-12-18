import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const token = localStorage.getItem("token");

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A855F7"
  ];

  useEffect(() => {
    if (!token) window.location.href = "/";
    else fetchExpenses();
  }, []);

  const calculateAnalytics = (data) => {
    setTotalExpense(
      data.reduce((sum, exp) => sum + Number(exp.amount), 0)
    );

    const catMap = {};
    const monthMap = {};

    data.forEach(exp => {
      catMap[exp.category] =
        (catMap[exp.category] || 0) + Number(exp.amount);

      const month = new Date(exp.date).toLocaleString("default", {
        month: "short"
      });
      monthMap[month] =
        (monthMap[month] || 0) + Number(exp.amount);
    });

    setCategoryData(
      Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }))
    );

    setMonthlyData(
      Object.keys(monthMap).map(k => ({ month: k, amount: monthMap[k] }))
    );
  };

  const fetchExpenses = async () => {
    const res = await API.get("/expenses", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setExpenses(res.data);
    calculateAnalytics(res.data);
  };

  const submitExpense = async (e) => {
    e.preventDefault();

    const payload = { amount, category, description, date };

    if (editId) {
      await API.put(`/expenses/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await API.post("/expenses", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    resetForm();
    fetchExpenses();
  };

  const startEdit = (exp) => {
    setEditId(exp._id);
    setAmount(exp.amount);
    setCategory(exp.category);
    setDescription(exp.description || "");
    setDate(exp.date.split("T")[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditId(null);
    setAmount("");
    setCategory("Food");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchExpenses();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const categoryColor = (cat) => {
    switch (cat) {
      case "Food": return "bg-green-100 text-green-700";
      case "Transport": return "bg-blue-100 text-blue-700";
      case "Shopping": return "bg-purple-100 text-purple-700";
      case "Bills": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

      const openEditModal = (exp) => {
      setEditId(exp._id);
      setAmount(exp.amount);
      setCategory(exp.category);
      setDescription(exp.description || "");
      setDate(exp.date.split("T")[0]);
      setShowEditModal(true);
    };

    const closeModal = () => {
      setShowEditModal(false);
      setEditId(null);
    };

    const updateExpense = async () => {
      await API.put(
        `/expenses/${editId}`,
        { amount, category, description, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      fetchExpenses();
    };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">Expense Tracker</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar*/}
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-5 space-y-6 h-fit">
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <h2 className="text-3xl font-bold text-blue-600">
              ₹{totalExpense}
            </h2>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <h2 className="text-xl font-semibold">
              {expenses.length}
            </h2>
          </div>

          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <h2 className="text-xl font-semibold">
              {categoryData.length}
            </h2>
          </div>
        </div>

        {/* Add / Edit Expense */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">
            {editId ? "Edit Expense" : "Add Expense"}
          </h2>

          <form onSubmit={submitExpense} className="grid sm:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />

            <select
              className="border p-2 rounded"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Others</option>
            </select>

            <input
              type="date"
              className="border p-2 rounded"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />

            <input
              placeholder="Description"
              className="border p-2 rounded"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="sm:col-span-4 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {editId ? "Update Expense" : "Add Expense"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <PieChart width={280} height={280}>
            <Pie data={categoryData} dataKey="value" outerRadius={100} label>
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-1">Your Expenses</h2>
          <p className="text-sm text-gray-400 mb-4">
            Manage and review your spending
          </p>

          <ul className="space-y-3">
            {expenses.map(exp => (
              <li
                key={exp._id}
                className="flex justify-between border rounded-lg p-3"
              >
                <div>
                  <div className="flex gap-2 items-center">
                    <p className="font-semibold">₹{exp.amount}</p>
                    <span className={`text-xs px-2 rounded-full ${categoryColor(exp.category)}`}>
                      {exp.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(exp.date).toLocaleDateString()}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-500">{exp.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(exp)}
                  className="text-gray-400 group-hover:text-blue-500 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="text-gray-400 group-hover:text-red-500 transition"
                >
                  ❌
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Edit Expense Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 blur-backdrop">
            <div className="bg-white rounded-xl p-6 w-full max-w-md animate-scale-in">

              <h2 className="text-lg font-semibold mb-4">Edit Expense</h2>

              <div className="space-y-3">
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />

                <select
                  className="w-full border p-2 rounded"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Others</option>
                </select>

                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />

                <input
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={updateExpense}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Update
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;

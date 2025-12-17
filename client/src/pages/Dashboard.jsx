import { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend} from "recharts";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A855F7"
];

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    } else {
      fetchExpenses();
    }
  }, []);

  const calculateAnalytics = (expenses) => {
  // Total Expense
  const total = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  setTotalExpense(total);

  // Category-wise data
  const categoryMap = {};
  expenses.forEach(exp => {
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const categoryArray = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));
  setCategoryData(categoryArray);

  // Monthly data
  const monthMap = {};
  expenses.forEach(exp => {
    const month = new Date(exp.date).toLocaleString("default", {
      month: "short"
    });
    monthMap[month] = (monthMap[month] || 0) + Number(exp.amount);
  });

  const monthArray = Object.keys(monthMap).map(key => ({
    month: key,
    amount: monthMap[key]
  }));
  setMonthlyData(monthArray);
};


const fetchExpenses = async () => {
  const res = await API.get("/expenses", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setExpenses(res.data);
  calculateAnalytics(res.data);
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

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    fetchExpenses();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Expense Tracker</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        
        {/* Add Expense */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

          <form onSubmit={addExpense} className="space-y-3">
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 border rounded"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />

            <select
              className="w-full p-2 border rounded"
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
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Your Expenses</h2>

          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses yet</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map(exp => (
                <li
                  key={exp._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div className="pr-2">
                    <p className="font-medium">
                      ₹{exp.amount} – {exp.category}
                    </p>
                    <p className="text-sm text-gray-500 break-words whitespace-normal max-w-xs">
                    {exp.description}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteExpense(exp._id)}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Category Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Category-wise Spending
        </h2>

        {categoryData.length === 0 ? (
          <p className="text-gray-500">No data</p>
        ) : (
          <PieChart width={300} height={300}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
      </div>
    </div>
  );
}

export default Dashboard;

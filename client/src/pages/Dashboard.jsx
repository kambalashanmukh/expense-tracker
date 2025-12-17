import { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts";

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
  const expenseCount = expenses.length;
  const categoryCount = categoryData.length;

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

  const categoryColor = (category) => {
    switch (category) {
      case "Food":
        return "bg-green-100 text-green-700";
      case "Transport":
        return "bg-blue-100 text-blue-700";
      case "Shopping":
        return "bg-purple-100 text-purple-700";
      case "Bills":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Expense Tracker</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 active:scale-95 transition"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Spent</p>
          <h2 className="text-2xl font-bold text-blue-600">
            ₹{totalExpense}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h2 className="text-2xl font-bold">
            {expenseCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Categories</p>
          <h2 className="text-2xl font-bold text-green-600">
            {categoryCount}
          </h2>
        </div>

      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
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
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
            >
              + Add Expense
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
                  className="flex justify-between items-start border rounded-lg p-3 hover:bg-gray-50 transition"
                >
                 <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">
                      ₹{exp.amount}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(
                        exp.category
                      )}`}
                    >
                      {exp.category}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-gray-500 break-words whitespace-normal max-w-xs mt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
 
                  <button
                    onClick={() => deleteExpense(exp._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Delete expense"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
          {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">
            Category-wise Spending
          </h2>

          {categoryData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <div className="flex justify-center">
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
            </div>
          )}
        </div>
            {/* Monthly Expense Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Spending
          </h2>

          {monthlyData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

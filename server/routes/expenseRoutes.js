const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense
} = require("../controllers/expenseController");

router.post("/", auth, addExpense);
router.get("/", auth, getExpenses);
router.put("/:id", auth, updateExpense);   // 👈 ADD THIS
router.delete("/:id", auth, deleteExpense);

module.exports = router;

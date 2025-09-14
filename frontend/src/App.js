import React, { useState, useEffect } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import ChartSummary from "./ChartSummary";
import GroupManager from "./GroupManager";
import BudgetManager from "./BudgetManager";
import Auth from "./Auth";

function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // Data state
  const [transactions, setTransactions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [budgets, setBudgets] = useState({ user: 0, groups: {} });

  useEffect(() => {
    if (token) {
      fetch("/api/me", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(setUser);

      fetch("/api/groups", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(setGroups);

      fetch("/api/transactions", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(setTransactions);

      fetch("/api/budgets", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(setBudgets);
    }
  }, [token]);

  if (!token) return <Auth setToken={setToken} />;

  const addTransaction = (tx) => {
    fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(tx)
    })
      .then(res => res.json())
      .then(newTx => setTransactions([...transactions, newTx]));
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <button onClick={() => { setToken(""); localStorage.removeItem("token"); }}>Logout</button>
      <BudgetManager token={token} budgets={budgets} setBudgets={setBudgets} user={user} groups={groups} />
      <GroupManager token={token} groups={groups} setGroups={setGroups} user={user} />
      <TransactionForm onAdd={addTransaction} groups={groups} />
      <TransactionList transactions={transactions} groups={groups} />
      <ChartSummary transactions={transactions} groups={groups} budgets={budgets} />
    </div>
  );
}

export default App;
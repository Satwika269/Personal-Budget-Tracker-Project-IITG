import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";

function ChartSummary({ transactions, groups, budgets }) {
  // Per group total
  const groupTotals = {};
  transactions.forEach(tx => {
    const gid = tx.groupId || "personal";
    groupTotals[gid] = (groupTotals[gid] || 0) + tx.amount;
  });

  const groupLabels = ["Personal", ...groups.map(g => g.name)];
  const groupData = [groupTotals["personal"] || 0, ...groups.map(g => groupTotals[g.id] || 0)];

  // Budget vs spent
  const userBudget = budgets.user || 0;
  const userSpent = transactions.filter(tx => !tx.groupId).reduce((a, tx) => a + tx.amount, 0);

  const groupBudgetData = groups.map(g => ({
    name: g.name,
    budget: budgets.groups?.[g.id] || 0,
    spent: groupTotals[g.id] || 0
  }));

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Group Balances</h2>
      <Bar data={{
        labels: groupLabels,
        datasets: [{
          label: "Spent",
          data: groupData,
          backgroundColor: "rgba(75,192,192,0.6)",
        }]
      }} />
      <h2>User Budget Usage</h2>
      <Doughnut data={{
        labels: ["Spent", "Remaining"],
        datasets: [{
          data: [userSpent, Math.max(userBudget - userSpent, 0)],
          backgroundColor: ["#f00", "#0f0"]
        }]
      }} />
      <h2>Group Budgets</h2>
      <ul>
        {groupBudgetData.map(gb => (
          <li key={gb.name}>{gb.name}: Spent ${gb.spent} / Budget ${gb.budget}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChartSummary;
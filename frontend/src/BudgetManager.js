import React, { useState } from "react";

function BudgetManager({ token, budgets, setBudgets, user, groups }) {
  const [userBudget, setUserBudget] = useState(budgets.user);
  const [groupBudgets, setGroupBudgets] = useState(budgets.groups || {});

  const updateUserBudget = () => {
    fetch("/api/budgets/user", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ amount: userBudget })
    })
      .then(res => res.json())
      .then(b => setBudgets(b));
  };

  const updateGroupBudget = (groupId, amount) => {
    fetch("/api/budgets/group", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ groupId, amount })
    })
      .then(res => res.json())
      .then(b => setBudgets(b));
  };

  return (
    <div>
      <h2>Budgets</h2>
      <div>
        <strong>Your budget:</strong>
        <input type="number" value={userBudget} onChange={e => setUserBudget(e.target.value)} />
        <button onClick={updateUserBudget}>Set</button>
      </div>
      <div>
        <strong>Group budgets:</strong>
        {groups.map(group => (
          <div key={group.id}>
            {group.name}: <input type="number" value={groupBudgets[group.id] || 0} onChange={e => {
              setGroupBudgets({ ...groupBudgets, [group.id]: e.target.value });
            }} />
            <button onClick={() => updateGroupBudget(group.id, groupBudgets[group.id] || 0)}>Set</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;
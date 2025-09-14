import React, { useState } from "react";

function TransactionForm({ onAdd, groups }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);
  const [groupId, setGroupId] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ description: desc, amount: parseFloat(amount), groupId: groupId || null });
    setDesc("");
    setAmount(0);
    setGroupId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <select value={groupId} onChange={e => setGroupId(e.target.value)}>
        <option value="">Personal</option>
        {groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default TransactionForm;
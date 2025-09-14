import React from "react";

function TransactionList({ transactions, groups }) {
  const groupMap = Object.fromEntries(groups.map(g => [g.id, g.name]));
  return (
    <ul>
      {transactions.map(tx => (
        <li key={tx.id}>
          {tx.description}: ${tx.amount} {tx.groupId ? `(Group: ${groupMap[tx.groupId]})` : "(Personal)"}
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;
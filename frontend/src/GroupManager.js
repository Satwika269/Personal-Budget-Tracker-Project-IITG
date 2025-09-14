import React, { useState } from "react";

function GroupManager({ token, groups, setGroups, user }) {
  const [groupName, setGroupName] = useState("");

  const createGroup = e => {
    e.preventDefault();
    fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ name: groupName })
    })
      .then(res => res.json())
      .then(newGroup => setGroups([...groups, newGroup]));
    setGroupName("");
  };

  return (
    <div>
      <h2>Groups</h2>
      <form onSubmit={createGroup}>
        <input placeholder="Group Name" value={groupName} onChange={e => setGroupName(e.target.value)} />
        <button type="submit">Create Group</button>
      </form>
      <ul>
        {groups.map(g => (
          <li key={g.id}>
            {g.name}
            {g.members && (
              <span> ({g.members.map(m => m.email).join(", ")})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupManager;
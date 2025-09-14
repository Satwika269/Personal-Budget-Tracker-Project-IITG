import React, { useState } from "react";

function Auth({ setToken }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = e => {
    e.preventDefault();
    fetch(`/api/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        }
      });
  };

  return (
    <form onSubmit={submit}>
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
      <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        Switch to {mode === "login" ? "Sign Up" : "Login"}
      </button>
    </form>
  );
}

export default Auth;
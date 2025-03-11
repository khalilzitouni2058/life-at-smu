import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validUser = {
    username: "a",
    password: "a",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (username === validUser.username && password === validUser.password) {
        setIsAuthenticated(true);
        navigate("/dashboard"); 
      } else {
        setError("Invalid username or password");
      }
    }, 1500);
  };

  return (
    <div className="container">
      <h1 className="welcome-text">WELCOME TO LIFE@SMU ADMIN DASHBOARD</h1>
      <div className="login-box">
      
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

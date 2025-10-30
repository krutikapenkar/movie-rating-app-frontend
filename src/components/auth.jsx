import React, { useState, useEffect } from "react";
import API from "../services/api-services";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [cookies, setCookie] = useCookies(["mr-token"]);

  const navigate = useNavigate();

  useEffect(() => {
    if (cookies["mr-token"]) {
      navigate("/movies");
    }
  }, [cookies, navigate]);

  // --- LOGIN FUNCTION ---
  const loginUser = async () => {
    try {
      const resp = await API.loginUser({ username, password });
      if (resp && resp.token) {
        setCookie("mr-token", resp.token, { path: "/" });
      } else {
        alert("Invalid credentials! Try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // --- REGISTER FUNCTION ---
  const registerUser = async () => {
    try {
      const resp = await API.registerUser({ username, password });
     
      // if (resp && resp.token) {
      //   setCookie("mr-token", resp.token, { path: "/" });
      // } else {
      //   alert("Registration failed! Try again.");
      // }
      if (resp) loginUser();
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  // --- FORM SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();
    isLoginView ? loginUser() : registerUser();
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')",
        }}
      ></div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login/Register Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/90 border border-yellow-500 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">
          🎬 Movie Rater
        </h2>
        <p className="text-center text-gray-400 mb-6">
          {isLoginView
            ? "Lights. Camera. Login. 🍿"
            : "Join the Movieverse. 🎥"}
        </p>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 text-black font-semibold bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
          >
            {isLoginView ? "🎥 Login" : "🍿 Register"}
          </button>
        </form>

        {/* Toggle View */}
        <div className="mt-6 text-sm text-center text-gray-400">
          {isLoginView ? (
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLoginView(false)}
                className="text-yellow-400 font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLoginView(true)}
                className="text-green-400 font-semibold hover:underline"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

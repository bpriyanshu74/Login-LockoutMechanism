import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import Layout from "../components/Layout";
import PasswordInput from "../components/PasswordInput";
import ErrorAlert from "../components/ErrorAlert";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signupUser(email, password);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 max-w-lg mx-auto border border-white/40">
        <h2 className="text-3xl font-bold text-[#0A2A43] text-center mb-8">
          Create Account
        </h2>

        <ErrorAlert message={error} />

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="text-[#0A2A43] font-medium text-sm">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-1 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#0093D0] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              required
            />
          </div>

          <div>
            <label className="text-[#0A2A43] font-medium text-sm">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0093D0] hover:bg-[#00A9E0] text-white py-3 rounded-xl font-semibold transition shadow-lg disabled:bg-blue-300 cursor-pointer"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/80 backdrop-blur-xl shadow-md border-b border-white/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/loginradius_logo.png"
            alt="Logo"
            className="w-32 object-contain"
          />
        </div>

        <div className="flex items-center gap-6">
          {!token ? (
            <>
              <Link
                to="/"
                className="text-[#0A2A43] hover:text-[#0093D0] transition font-medium cursor-pointer"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-[#0093D0] text-white px-5 py-2 rounded-lg shadow hover:bg-[#00A9E0] transition cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

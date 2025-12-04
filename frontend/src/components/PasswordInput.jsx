import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // install lucide

export default function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#0093D0] transition"
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        required
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 text-gray-500 hover:text-[#0093D0] transition"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

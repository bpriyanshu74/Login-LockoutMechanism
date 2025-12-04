import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#E8F7FF] via-[#F7FBFF] to-white">
      <Navbar />

      <div className="pt-28 pb-10 px-4 flex justify-center">
        <div className="w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
}

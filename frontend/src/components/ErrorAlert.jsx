export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg shadow-sm text-sm mb-4 animate-fade-in">
      <strong className="font-semibold">Error:</strong> {message}
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center mb-6 text-center">
      <Link to="/">
        <img 
          src="/salt.svg" 
          alt="Saltium" 
          className="h-16 w-16 object-contain mb-2 hover:animate-wiggle cursor-pointer"
        />
      </Link>
      <Link to="/" className="hover:opacity-80">
        <h1 className="text-4xl font-bold">Saltium</h1>
      </Link>
      <p className="text-gray-600 text-base mt-2 max-w-md">
        Saltium let&apos;s you share files securely, ensuring privacy and integrity.
      </p>
    </div>
  );
}

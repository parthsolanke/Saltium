export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center mb-6 text-center">
      <div className="flex items-center justify-center mb-2">
        <img src="./salt.svg" alt="Saltium" className="h-12 w-12 object-contain"/>
        <h1 className="text-4xl font-bold">Saltium</h1>
      </div>
      <p className="text-gray-600 text-base mt-2 max-w-md">
        Saltium let&apos;s you share files securely, ensuring privacy and integrity.
      </p>
    </div>
  );
}

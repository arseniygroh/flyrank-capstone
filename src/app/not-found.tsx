import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-neutral-400">The page you requested does not exist.</p>
      <Link
        href="/"
        className="rounded-full bg-green-500 px-6 py-2 font-bold text-black hover:bg-green-400"
      >
        Go home
      </Link>
    </div>
  );
}

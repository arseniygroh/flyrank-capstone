import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col justify-center p-6 xl:p-10">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Your music, your playlists
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-400">
        Pick a playlist from the sidebar, or create a new one and search iTunes
        to add tracks.
      </p>
      <Link
        href="/playlist/new"
        className="mt-8 inline-flex w-fit rounded-full bg-green-500 px-8 py-3 font-bold text-black transition-colors hover:bg-green-400"
      >
        Create playlist
      </Link>
    </div>
  );
}

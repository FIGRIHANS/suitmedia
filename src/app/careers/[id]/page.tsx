import { notFound } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default async function CareerDetailPage({ params }: { params: { id: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/ideas/${params.id}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const data = await res.json();

  return (
    <main className="bg-white min-h-screen px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/careers">
          <button
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2 rounded-full shadow transition text-lg"
            aria-label="Kembali"
          >
            <IoArrowBack size={20} />
            Kembali
          </button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-4">{data.title}</h1>
      <span className="text-xs text-gray-400 font-semibold mb-4 block">
        {data.published_at
          ? new Date(data.published_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : ""}
      </span>
      {data.medium_image && (
        <img
          src={data.medium_image.url}
          alt={data.title}
          className="w-full max-h-64 object-cover rounded mb-4"
        />
      )}
      <div
        className="text-gray-700 text-base space-y-4"
        dangerouslySetInnerHTML={{
          __html: data.content
            ? data.content.replace(/<p/g, '<p style="margin-bottom:1rem"')
            : "Tidak ada konten.",
        }}
      />
    </main>
  );
}
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "@/app/components/navbar/navbar";
import Hero from "@/app/components/hero/hero";
import Footer from "@/app/components/footer/footer";

type WorkItem = {
  id: number;
  title: string;
  published_at?: string;
  small_image?: any;
  medium_image?: any;
  content?: string;
};

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16];
const SORT_OPTIONS = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

function getImageUrl(item: WorkItem | null, type: 'small_image' | 'medium_image'): string | null {
  if (!item || !item[type]) return null;
  try {
    if (Array.isArray(item[type]) && item[type][0]?.url) {
      return item[type][0].url;
    }
    if (typeof item[type] === 'object' && item[type].url) {
      return item[type].url;
    }
    if (typeof item[type] === 'string') {
      return item[type];
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default function ServicesPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const sortParam = sort === "desc" ? "-published_at" : "published_at";
        const res = await fetch(`/api/ideas?page=${page}&size=${pageSize}&sort=${sortParam}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const dataArr = Array.isArray(data.data) ? data.data : [];
        setItems(dataArr);
        setTotalItems(data.meta?.total || 0);
        setTotalPages(data.meta?.last_page || 1);
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [page, pageSize, sort]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // Modal otomatis terbuka jika ada id di query
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && items.length > 0) {
      const found = items.find((item) => String(item.id) === id);
      if (found) setSelected(found);
      else setSelected(null);
    } else {
      setSelected(null);
    }
  }, [searchParams, items]);

  // Open modal and update URL (tidak pindah halaman)
  const handleOpenDetail = (item: WorkItem) => {
    setSelected(item);
    router.replace(`/services?id=${item.id}`);
  };

  // Close modal and revert URL (tidak pindah halaman)
  const handleCloseDetail = () => {
    setSelected(null);
    router.replace("/services");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        <Hero title="Services" subtitle="Where all our great things begin" bgImage="/grey.jpeg" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="text-black text-sm mb-2 md:mb-0">
              <span className="font-semibold">Showing</span>{" "}
              {items.length === 0 ? 0 : (page - 1) * pageSize + 1} -{" "}
              {items.length === 0 ? 0 : Math.min((page - 1) * pageSize + items.length, totalItems)} of {totalItems}
            </div>
            <div className="flex gap-4 items-center">
              <label className="font-semibold text-sm flex items-center gap-2 text-black">
                <span className="font-semibold text-black">Show per page:</span>
                <select
                  className="border rounded-full px-4 py-2 text-sm font-semibold text-black"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
              <label className="font-semibold text-sm flex items-center gap-2 text-black">
                <span className="font-semibold text-black">Sort by:</span>
                <select
                  className="border rounded-full px-4 py-2 text-sm font-semibold text-black"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && items.length === 0 && <p>Tidak ada data.</p>}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition"
                onClick={() => handleOpenDetail(item)}
              >
                {getImageUrl(item, 'small_image') ? (
                  <img
                    src={getImageUrl(item, 'small_image')!}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.no-image-fallback')?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 hidden no-image-fallback">No Image</div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  </span>
                  <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mb-12">
            <button className={`w-8 h-8 rounded font-bold ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 text-gray-700"}`} disabled={page === 1} onClick={() => handlePageChange(1)}>{"<<"}</button>
            <button className={`w-8 h-8 rounded font-bold ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 text-gray-700"}`} disabled={page === 1} onClick={() => handlePageChange(page - 1)}>{"<"}</button>
            
            {/* Dynamic Pagination */}
            {(() => {
              const pages = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (page > 3) {
                  pages.push(1);
                  if (page > 4) pages.push("...");
                }
                let start = Math.max(2, page - 2);
                let end = Math.min(totalPages - 1, page + 2);
                for (let i = start; i <= end; i++) pages.push(i);
                if (page < totalPages - 3) {
                  pages.push("...");
                  pages.push(totalPages);
                } else if (page < totalPages - 2) {
                  pages.push(totalPages);
                }
              }
              return pages.map((p, idx) =>
                typeof p === "number" ? (
                  <button key={p} className={`w-8 h-8 rounded font-bold ${page === p ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => handlePageChange(p)}>{p}</button>
                ) : (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                )
              );
            })()}

            <button className={`w-8 h-8 rounded font-bold ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 text-gray-700"}`} disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>{">"}</button>
            <button className={`w-8 h-8 rounded font-bold ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 text-gray-700"}`} disabled={page === totalPages} onClick={() => handlePageChange(totalPages)}>{">>"}</button>
          </div>
        </div>

          {selected && (
          <div className="fixed inset-0 z-50 w-screen h-screen bg-white flex flex-col">
            {/* Sticky header for title and back button */}
            <div className="sticky top-0 left-0 w-full bg-white z-20 flex items-center border-b px-6 py-4">
              <button
                className="flex items-center gap-2 mr-4 text-white bg-orange-500 hover:bg-orange-600 rounded-full px-6 py-3 text-2xl font-bold shadow transition"
                style={{ minWidth: "36px" }}
                onClick={handleCloseDetail}
                aria-label="Kembali"
              >
                <IoArrowBack size={20} />
              </button>
              <h2 className="text-2xl font-bold text-black">{selected.title}</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-4 py-8">
              <div className="w-full max-w-3xl mx-auto">
                <span className="text-xs text-gray-400 font-semibold mb-4 block">
                  {selected.published_at
                    ? new Date(selected.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
                {(getImageUrl(selected, "medium_image") ||
                  getImageUrl(selected, "small_image")) ? (
                  <img
                    src={
                      getImageUrl(selected, "medium_image") ||
                      getImageUrl(selected, "small_image")!
                    }
                    alt={selected.title}
                    className="w-full max-h-64 object-cover rounded mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : (
                  <div className="w-full max-h-64 bg-gray-200 flex items-center justify-center text-gray-400 mb-4">
                    No Image
                  </div>
                )}
                <div
                  className="w-full max-h-64 bg-gray-200 flex items-center justify-center text-gray-400 mb-4 hidden"
                >
                  No Image
                </div>
                <div
                  className="text-gray-700 text-base space-y-4"
                  style={{ minHeight: "120px" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      selected.content
                        ? selected.content.replace(/<p/g, '<p style="margin-block-end:1rem"')
                        : "Tidak ada konten.",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </>
  );
}
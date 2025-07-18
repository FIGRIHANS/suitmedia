/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/navbar";

export default function Page() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIdeas() {
      setLoading(true);
      const res = await fetch("/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=-published_at");
      if (!res.ok) {
        setIdeas([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setIdeas(data.data || []);
      setLoading(false);
    }
    fetchIdeas();
  }, []);

  return (
    <main>
      <Navbar />
      <section className="p-8">
        <h2 className="text-xl font-bold mb-4">Ideas</h2>
        {loading ? (
          <div>Loading...</div>
        ) : ideas.length === 0 ? (
          <div>Tidak ada data.</div>
        ) : (
          <ul>
            {ideas.map((idea: any) => (
              <li key={idea.id} className="mb-4">
                <div className="font-semibold">{idea.attributes?.title}</div>
                {idea.attributes?.small_image && (
                  <img src={idea.attributes.small_image.url} alt={idea.attributes.title} className="w-32 h-32 object-cover mt-2" />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
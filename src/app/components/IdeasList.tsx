"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Idea {
  id: number;
  title: string;
  content: string;
  published_at: string;
  small_image: string;
  medium_image: string;
}

interface ApiResponse {
  data: Idea[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function IdeasList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchIdeas = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ideas?page=${pageNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }
      
      const result: ApiResponse = await response.json();
      setIdeas(prevIdeas => pageNumber === 1 ? result.data : [...prevIdeas, ...result.data]);
      setHasMore(result.meta.current_page < result.meta.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ideas</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ideas.map(idea => (
          <div key={idea.id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="relative h-48 w-full">
              {idea.medium_image && (
                <Image 
                  src={idea.medium_image}
                  alt={idea.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-2">{idea.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(idea.published_at).toLocaleDateString()}
              </p>
              <p className="text-sm line-clamp-3">{idea.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      {loading && <p className="text-center mt-4">Loading...</p>}
      
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button 
            onClick={loadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
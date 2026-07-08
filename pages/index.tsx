import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import NoticeCard from '@/components/NoticeCard';

interface Notice {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image?: string;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notices');
      setNotices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="Notice Board - Stay updated with latest announcements" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container-main flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notice Board</h1>
            <Link href="/create">
              <button className="button-primary">
                + New Notice
              </button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="container-main">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading notices...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              {error}
              <button
                onClick={fetchNotices}
                className="ml-4 underline font-semibold hover:no-underline"
              >
                Try again
              </button>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No notices yet</p>
              <Link href="/create">
                <button className="button-primary">Create first notice</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  {...notice}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

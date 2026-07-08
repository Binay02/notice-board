import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import NoticeForm from '@/components/NoticeForm';

interface Notice {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image?: string;
}

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchNotice();
    }
  }, [id]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/notices/${id}`);
      setNotice(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notice:', err);
      setError('Failed to load notice.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await axios.put(`/api/notices/${id}`, formData);
      router.push('/');
    } catch (error: any) {
      setIsSubmitting(false);
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Edit Notice - Notice Board</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading notice...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !notice) {
    return (
      <>
        <Head>
          <title>Error - Notice Board</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="container-main">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 py-6">Error</h1>
            </div>
          </header>
          <div className="container-main py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error || 'Notice not found.'}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Notice - Notice Board</title>
        <meta name="description" content="Edit notice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container-main">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 py-6">Edit Notice</h1>
          </div>
        </header>

        {/* Content */}
        <div className="container-main py-8">
          <NoticeForm
            initialData={notice}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </main>
    </>
  );
}

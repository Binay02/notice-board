import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import NoticeForm from '@/components/NoticeForm';

export default function Create() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      await axios.post('/api/notices', formData);
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <>
      <Head>
        <title>Create Notice - Notice Board</title>
        <meta name="description" content="Create a new notice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container-main">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 py-6">Create Notice</h1>
          </div>
        </header>

        {/* Content */}
        <div className="container-main py-8">
          <NoticeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
    </>
  );
}

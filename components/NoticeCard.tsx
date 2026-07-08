import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';

interface NoticeCardProps {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image?: string;
  onDelete: (id: number) => void;
}

export default function NoticeCard({
  id,
  title,
  body,
  category,
  priority,
  publishDate,
  image,
  onDelete,
}: NoticeCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/notices/${id}`);
      onDelete(id);
      setShowConfirm(false);
    } catch (error) {
      alert('Failed to delete notice');
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <div className="notice-card">
        <div className="flex flex-col sm:flex-row gap-4">
          {image && (
            <div className="sm:w-32 sm:h-32 w-full h-48 sm:h-auto flex-shrink-0">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                {title}
              </h3>
              {priority === 'Urgent' && (
                <span className="badge-urgent flex-shrink-0">Urgent</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded">
                {category}
              </span>
              <span className="inline-block text-gray-600 text-xs font-semibold px-3 py-1">
                {formattedDate}
              </span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base line-clamp-3 mb-4">
              {body}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href={`/edit/${id}`}>
                <button className="button-primary button-small">
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDeleteClick}
                className="button-danger button-small"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Notice"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        isLoading={isDeleting}
      />
    </>
  );
}

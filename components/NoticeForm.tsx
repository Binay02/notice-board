import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface NoticeFormProps {
  initialData?: {
    id: number;
    title: string;
    body: string;
    category: string;
    priority: string;
    publishDate: string;
    image?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function NoticeForm({
  initialData,
  onSubmit,
  isLoading,
}: NoticeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'General',
    priority: 'Normal',
    publishDate: '',
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        body: initialData.body,
        category: initialData.category,
        priority: initialData.priority,
        publishDate: initialData.publishDate.split('T')[0],
        image: initialData.image || '',
      });
      if (initialData.image) {
        setPreviewImage(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          image: base64,
        }));
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.body.trim()) newErrors.body = 'Body is required';
    if (!formData.publishDate) newErrors.publishDate = 'Publish date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notice title"
            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            maxLength={255}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Enter notice body"
            className={`input-field resize-none h-32 ${errors.body ? 'border-red-500' : ''}`}
            rows={6}
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="form-group m-0">
            <label htmlFor="category" className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div className="form-group m-0">
            <label htmlFor="priority" className="form-label">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="publishDate" className="form-label">
            Publish Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className={`input-field ${errors.publishDate ? 'border-red-500' : ''}`}
          />
          {errors.publishDate && (
            <p className="text-red-500 text-sm mt-1">{errors.publishDate}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="input-field"
          />
          <p className="text-gray-500 text-sm mt-1">
            Supported formats: JPG, PNG, GIF. Max size: 5MB
          </p>
        </div>

        {previewImage && (
          <div className="form-group">
            <p className="form-label">Image Preview</p>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-xs rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewImage(null);
                setFormData((prev) => ({ ...prev, image: '' }));
              }}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              Remove image
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="button-primary"
          >
            {isLoading
              ? initialData
                ? 'Updating...'
                : 'Creating...'
              : initialData
                ? 'Update Notice'
                : 'Create Notice'}
          </button>
          <Link href="/">
            <button type="button" className="button-secondary">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

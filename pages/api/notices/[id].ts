import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const noticeId = parseInt(id as string);

  if (isNaN(noticeId)) {
    return res.status(400).json({ message: 'Invalid notice ID' });
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });

      if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      return res.status(200).json(notice);
    } catch (error) {
      console.error('Error fetching notice:', error);
      return res.status(500).json({ message: 'Failed to fetch notice' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, body, category, priority, publishDate, image } = req.body;

      // Check if notice exists
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });

      if (!existingNotice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      // Server-side validation
      const errors: Record<string, string> = {};

      if (!title || title.trim() === '') {
        errors.title = 'Title is required';
      } else if (title.length > 255) {
        errors.title = 'Title must be less than 255 characters';
      }

      if (!body || body.trim() === '') {
        errors.body = 'Body is required';
      }

      if (!category || !['Exam', 'Event', 'General'].includes(category)) {
        errors.category = 'Valid category is required';
      }

      if (!priority || !['Normal', 'Urgent'].includes(priority)) {
        errors.priority = 'Valid priority is required';
      }

      if (!publishDate) {
        errors.publishDate = 'Publish date is required';
      } else {
        const date = new Date(publishDate);
        if (isNaN(date.getTime())) {
          errors.publishDate = 'Invalid date';
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || existingNotice.image,
        },
      });

      return res.status(200).json(updatedNotice);
    } catch (error) {
      console.error('Error updating notice:', error);
      return res.status(500).json({ message: 'Failed to update notice' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });

      if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      await prisma.notice.delete({
        where: { id: noticeId },
      });

      return res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
      console.error('Error deleting notice:', error);
      return res.status(500).json({ message: 'Failed to delete notice' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

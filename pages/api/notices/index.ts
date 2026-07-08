import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, // Urgent first
          { publishDate: 'desc' }, // Then by date
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      return res.status(500).json({ message: 'Failed to fetch notices' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, body, category, priority, publishDate, image } = req.body;

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

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });

      return res.status(201).json(notice);
    } catch (error) {
      console.error('Error creating notice:', error);
      return res.status(500).json({ message: 'Failed to create notice' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

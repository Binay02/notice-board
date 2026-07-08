# Notice Board Application

A full-featured Notice Board application with create, read, update, and delete functionality. Built with Next.js Pages Router, Prisma, and MySQL.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Database**: MySQL (via TiDB Cloud)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Features

✅ **Create Notices** - Add new notices with title, body, category, priority, and optional image
✅ **Read Notices** - View all notices in responsive cards
✅ **Update Notices** - Edit existing notices with pre-filled form
✅ **Delete Notices** - Remove notices with confirmation dialog
✅ **Priority Sorting** - Urgent notices appear first (database-level sorting)
✅ **Responsive Design** - Works seamlessly on mobile and desktop
✅ **Server-Side Validation** - All input validation happens on the backend
✅ **Error Handling** - Proper error messages and status codes

## Getting Started

### Prerequisites

- Node.js 16+
- MySQL database (TiDB Cloud recommended)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Binay02/notice-board.git
cd notice-board
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:
```
DATABASE_URL="mysql://username:password@host:port/database"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
notice-board/
├── prisma/
│   └── schema.prisma          # Database schema
├── pages/
│   ├── api/
│   │   └── notices/
│   │       ├── index.ts       # GET (list) and POST (create)
│   │       ├── [id].ts        # GET (single), PUT (update), DELETE
│   │       └── upload.ts      # Image upload handler
│   ├── index.tsx              # Notice list page
│   ├── create.tsx             # Create notice page
│   ├── edit/[id].tsx          # Edit notice page
│   └── _app.tsx               # Next.js app wrapper
├── components/
│   ├── NoticeCard.tsx         # Individual notice card
│   ├── NoticeForm.tsx         # Reusable form component
│   └── ConfirmDialog.tsx       # Confirmation modal
├── public/
│   └── uploads/               # Uploaded images
├── styles/
│   └── globals.css            # Global styles
├── .env.example               # Environment variable template
├── next.config.js             # Next.js config
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind CSS config
└── package.json               # Dependencies
```

## API Routes

### GET /api/notices
Fetch all notices sorted by priority (Urgent first) and date.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Exam Notice",
    "body": "...",
    "category": "Exam",
    "priority": "Urgent",
    "publishDate": "2026-07-10T00:00:00Z",
    "image": "base64-encoded-image",
    "createdAt": "2026-07-08T18:09:36Z",
    "updatedAt": "2026-07-08T18:09:36Z"
  }
]
```

### POST /api/notices
Create a new notice.

**Request Body:**
```json
{
  "title": "Notice Title",
  "body": "Notice body content",
  "category": "Exam",
  "priority": "Urgent",
  "publishDate": "2026-07-10",
  "image": "optional-base64-image"
}
```

**Response:** `201 Created` with notice object

### PUT /api/notices/[id]
Update an existing notice.

**Request Body:** Same as POST

**Response:** `200 OK` with updated notice

### DELETE /api/notices/[id]
Delete a notice by ID.

**Response:** `200 OK` with success message

## Validation

- **Title**: Required, max 255 characters
- **Body**: Required, any length
- **Category**: Required, must be one of: Exam, Event, General
- **Priority**: Required, must be one of: Normal, Urgent
- **Publish Date**: Required, must be a valid date
- **Image**: Optional, base64-encoded image data

All validation is performed server-side in API routes.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your MySQL connection string
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

## Improvements for Future

Given more time, I would:

1. **Add pagination** - Implement cursor-based pagination for better performance with many notices
2. **Image optimization** - Use next/image for automatic image optimization and multiple sizes
3. **Search and filters** - Add search by title/body and filter by category/priority
4. **User authentication** - Add user roles (admin/viewer) and authorization
5. **Rich text editor** - Implement a WYSIWYG editor for notice body
6. **Notifications** - Add email notifications for new notices
7. **Analytics** - Track view counts and engagement metrics
8. **Dark mode** - Add theme switcher
9. **Testing** - Add unit and integration tests
10. **Caching** - Implement Redis caching for frequently accessed notices

## AI Usage

AI was used to:
- Generate boilerplate code structure and configuration files
- Assist with Prisma schema design for optimal indexing
- Help optimize database queries and sorting logic
- Generate TypeScript type definitions
- Create responsive Tailwind CSS components
- Generate form validation logic
- Assist with API error handling patterns

All generated code was reviewed, tested, and customized to meet specific requirements. Core logic, database design, and API structure were designed with careful consideration of the assignment requirements.

## License

MIT

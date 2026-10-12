# Binary Blogs 📝

Binary Blogs is a blogging platform where users can sign up, write posts in a rich text editor, publish them or keep them as drafts, and edit or delete their own posts. It is built with React and TypeScript on top of Appwrite.

## 🚀 Technologies Used

- **Frontend**: React 19, TypeScript, Vite
- **UI**: shadcn/ui (Radix), Tailwind CSS v4, lucide icons
- **Forms**: React Hook Form with zod validation
- **Backend**: Appwrite (auth, database, storage)
- **Server state**: TanStack Query
- **Client state**: Redux Toolkit (auth session)
- **Routing**: React Router
- **Rich Text Editor**: Tiptap

---

## 📂 Features

- **User Authentication**: Login, Signup, and Logout, with protected routes that return you to the page you were heading to
- **CRUD Operations**: Create, Read, Update, and Delete blog posts
- **Drafts**: Keep a post as a draft; drafts are only visible to their author
- **Rich Text Editor**: Headings, lists, quotes, code blocks and links
- **Cover Images**: Drag-and-drop upload with preview
- **Search and Filters**: Search all posts and filter by published, drafts or your own
- **Form Validation**: Schema-based validation with inline error messages
- **Light and Dark Themes**: Follows the system theme, with a manual toggle
- **Responsive Design**: Works on mobile, tablet and desktop
- **Safe Rendering**: Post HTML is sanitised with DOMPurify before it is displayed

---

## ⚙️ Installation and Setup

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/milan-sh/binary-blogs.git
   cd binary-blogs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Appwrite**

   Copy `.env.sample` to `.env` and fill in the values from your Appwrite project:
   ```bash
   VITE_APPWRITE_URL=""
   VITE_APPWRITE_PROJECT_ID=""
   VITE_APPWRITE_DATABASE_ID=""
   VITE_APPWRITE_COLLECTION_ID=""
   VITE_APPWRITE_BUCKET_ID=""
   ```

   The posts collection needs these attributes: `title`, `content`, `featuredImage`, `status` and `userId` (all strings).

4. **Start the dev server**
   ```bash
   npm run dev
   ```

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build for production |
| `npm run typecheck` | Typecheck only |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

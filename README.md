# 🧠 Mini AI-Powered Notes App

## A sleek, modern note-taking app powered by AI ✨. Add, view, favorite, and summarize your notes with the help of an AI summarization API. Built with:

* Next.js 14 (App Router)
* TailwindCSS & shadcn/ui
* Supabase (auth + data storage)
* React Query for data fetching/caching
* Responsive & accessible UI
* Light/Dark mode toggle 🌗

## 🚀 Features

* 🔐 User Authentication via Supabase
* 📝 Create & Edit Rich Text Notes
* 🌟 Mark Notes as Favorites
* 🔍 Filter Notes by Tags
* ✨ Summarize Notes using Groq API 
* 🌙 Toggle Light/Dark Theme
* 📱 Responsive design (Mobile/Desktop)
* ⚡ Smooth page transitions & modern animations

## 📦 Installation

1. Clone the repo

```bash
git clone https://github.com/yourusername/ai-notes-app.git
cd ai-notes-app
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

Create a .env.local file and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
AI_API_URL=https://your-summarization-api-endpoint
AI_API_KEY=your_api_key
```

4. Run the dev server

```bash
npm run dev
```

App will be live at [http://localhost:3000](http://localhost:3000) 🚀

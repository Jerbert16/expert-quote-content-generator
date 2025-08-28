# Expert-to-Blog (Next.js + TypeScript + TailwindCSS + Google Gemini)

Turn expert opinions into well-structured, SEO-ready blog posts—automatically.  
This app collects short inputs from subject-matter experts, organizes them into an outline, and uses **Google Gemini** to draft a cohesive blog post with headings, metadata, and FAQs.

---

## ✨ Features

- **Expert input collection**: capture multiple perspectives (quotes, bullets, links).
- **AI drafting with Gemini**: outline → sections → full post.
- **Editor-friendly output**: Markdown with H2/H3s, title, meta description, and FAQs.
- **Prompt templates**: different formats (how-to, listicle, op-ed, case study).
- **Modern stack**: Next.js App Router, TypeScript, TailwindCSS.

---

## 🧱 Tech Stack

- **Framework:** Next.js  
- **Language:** TypeScript  
- **Styling:** TailwindCSS  
- **AI:** Google Gemini (Generative AI API)  
- **(Optional) DB:** Prisma + Postgres/SQLite for storing expert inputs and drafts  

---

## 📦 Requirements

- Node.js 18+  
- pnpm / npm / yarn  
- **Google AI Studio API key** (for Gemini)  

---

## ⚙️ Environment Variables

Create `.env.local` in the project root:

```bash
# Google AI
GOOGLE_GEMINI_API_KEY=your_key_here

# (Optional) Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

[Try it out here!](https://expertquotegen.netlify.app/)

# 📄 PaperRAG

**PaperRAG** is an AI-powered document ingestion and question-answering system.  
It allows users to upload PDFs (research papers, resumes, reports, etc.), processes them into chunks, summarizes their content (text, tables, images), and stores embeddings in a vector database. Users can then chat with their documents through a simple web interface.

---

## 🚀 Live Demo

- **Frontend (Next.js + tRPC)** → [https://paperrag.onrender.com/](https://paperrag.onrender.com/)  
- **Backend (FastAPI)** → [https://paperrag-backend-296287667274.us-central1.run.app/](https://paperrag-backend-296287667274.us-central1.run.app/)  

> ⚠️ Note: Backend is currently deployed on **Google Cloud Run** (ephemeral storage). Uploads may fail or reset. For persistence, see [Future Scope](#-future-scope).

---

## ✨ Features

- 📂 **Upload PDFs** directly in the browser.  
- 🧩 **Extracts text, tables, and images** from PDFs.  
- 📝 **Summarizes** extracted content with LLMs.  
- 🔍 **Embeds & stores** summaries into **Chroma DB**.  
- 💬 **Chat interface** to query documents using semantic search + LLM reasoning.  
- 🔄 **Session management** (multiple chats, persistent state).  
- 🐳 **Docker Compose** for local development.  
- ☁️ Deployment ready for **Render (frontend)** and **Cloud Run (backend)**.

---

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) (React framework)
- [tRPC](https://trpc.io/) (typesafe APIs)
- [React Query](https://tanstack.com/query)
- TailwindCSS + ShadCN UI
- Deployed on **Render**

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) (Python web framework)
- [Unstructured](https://github.com/Unstructured-IO/unstructured) (PDF parsing)
- [Chroma](https://www.trychroma.com/) (vector database)
- [Prisma](https://www.prisma.io/) (ORM, SQLite)
- [LangChain](https://www.langchain.com/) (summarization & query)
- Deployed on **Google Cloud Run**

### Infrastructure
- Docker & Docker Compose
- Persistent volumes (local dev)
- Future support for managed DBs (Postgres, Pinecone)

---

## ⚙️ Local Development

Clone the repo and start everything with Docker Compose:

```bash
git clone https://github.com/Exynos21/PaperRAG.git
cd PaperRAG

# Copy env files
cp backend-python/.env.example backend-python/.env
cp frontend/.env.local.example frontend/.env.local

# Start services
docker-compose up --build

# ☁️ CloudScribe: 3-Tier Cloud Publishing Platform
> **Design and Deployment of a Three-Tier Web Application Using Netlify, Render, and MongoDB Atlas**

[![Frontend: Netlify](https://img.shields.io/badge/Tier%201-Netlify-00c7b7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Backend: Render](https://img.shields.io/badge/Tier%202-Render-46e3b7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Database: MongoDB Atlas](https://img.shields.io/badge/Tier%203-MongoDB%20Atlas-00ed64?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

---

## 📌 1. Project Overview

**CloudScribe** is a modern, responsive, decoupled blog publishing platform designed and structured according to standard **Three-Tier Cloud Architecture** principles. Rather than hosting the user interface, backend application logic, and database on a monolithic single-server instance, each tier is hosted independently across three specialized cloud platforms:

1. **Presentation Tier (Tier 1)**: Deployed on **Netlify** (React 18, Vite, modern Glassmorphic CSS).
2. **Application Tier (Tier 2)**: Deployed on **Render** (Node.js & Express.js REST API with CORS validation).
3. **Database Tier (Tier 3)**: Hosted on **MongoDB Atlas** (Managed Cloud NoSQL Document Store).

---

## 🏛️ 2. Architectural Blueprint

The application enforces a strict separation of concerns where each layer communicates solely with its adjacent tier:

```mermaid
flowchart TD
    User([🌐 End-User Browser / Client])
    
    subgraph TIER1 ["Tier 1: Presentation Layer (Netlify)"]
        NetlifyApp["React (Vite) Single Page Application\n• UI Rendering & Form Validation\n• Live Tier Health Dashboard\n• Dynamic API Configuration"]
    end

    subgraph TIER2 ["Tier 2: Application Layer (Render)"]
        RenderAPI["Node.js / Express REST API Server\n• Request Validation & Business Logic\n• CORS Access Control Rules\n• CRUD Routing Controllers"]
    end

    subgraph TIER3 ["Tier 3: Database Layer (MongoDB Atlas)"]
        AtlasDB["MongoDB Atlas Managed Cluster\n• Database: blogDB\n• Collection: posts\n• Document Schema & Indexing"]
    end

    User <-->|HTTPS Client Traffic| NetlifyApp
    NetlifyApp <-->|REST API JSON Calls (HTTPS)| RenderAPI
    RenderAPI <-->|TLS / Mongoose Connection| AtlasDB

    classDef t1 fill:#003833,stroke:#00c7b7,stroke-width:2px,color:#fff;
    classDef t2 fill:#022c22,stroke:#46e3b7,stroke-width:2px,color:#fff;
    classDef t3 fill:#022a10,stroke:#00ed64,stroke-width:2px,color:#fff;
    classDef usr fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;

    class User usr;
    class NetlifyApp t1;
    class RenderAPI t2;
    class AtlasDB t3;
```

### Communication Flow:
$$\text{User Browser} \longrightarrow \text{Netlify (Tier 1)} \xrightarrow{\text{REST API (HTTPS)}} \text{Render (Tier 2)} \xrightarrow{\text{Mongoose / TLS}} \text{MongoDB Atlas (Tier 3)}$$

---

## 📂 3. Repository Structure

```text
cc Project/
├── backend/                        # Tier 2: Application Layer (Render)
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection & health check state
│   ├── controllers/
│   │   └── postController.js      # CRUD controllers & sample database seeder
│   ├── models/
│   │   └── Post.js                # Mongoose schema for blog posts
│   ├── routes/
│   │   └── postRoutes.js          # Express route definitions
│   ├── .env.example               # Backend environment variable template
│   ├── package.json               # Backend dependencies (express, mongoose, cors, dotenv)
│   └── server.js                  # Server entry point with CORS policy & health checks
│
├── frontend/                       # Tier 1: Presentation Layer (Netlify)
│   ├── public/
│   │   └── _redirects             # Netlify SPA redirect rules (/* /index.html 200)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureModal.jsx  # Interactive 3-Tier specs & test cases modal
│   │   │   ├── DeleteConfirmModal.jsx # Deletion verification modal
│   │   │   ├── Footer.jsx             # Tier status badge footer
│   │   │   ├── Navbar.jsx             # Header with actions and navigation
│   │   │   ├── PostCard.jsx           # Article card with hover & interactive states
│   │   │   ├── PostModal.jsx          # Article reader and editor modal
│   │   │   └── TierStatusBanner.jsx   # Live 3-Tier cloud health monitor & ping tool
│   │   ├── services/
│   │   │   └── api.js                 # Frontend HTTP client service for Render API
│   │   ├── App.jsx                    # Root application component
│   │   ├── index.css                  # Custom design system (glassmorphism & tokens)
│   │   └── main.jsx                   # React DOM root entry
│   ├── .env.example               # Frontend environment variable template
│   ├── index.html                 # HTML shell with Google Fonts & SEO tags
│   ├── package.json               # Frontend dependencies (react, lucide-react, vite)
│   └── vite.config.js             # Vite configuration
│
├── package.json                    # Monorepo root script runner
├── .gitignore                      # Git ignore file for secrets and node_modules
└── README.md                       # Comprehensive architectural documentation
```

---

## ⚡ 4. REST API Endpoint Specification

The Application Tier exposed on Render supports the following REST endpoints:

| Operation | HTTP Method | Endpoint | Description |
|:---|:---|:---|:---|
| **Health Check** | `GET` | `/api/health` | Inspects status of Tier 2 (Render) and Tier 3 (Atlas) |
| **Read (All)** | `GET` | `/api/posts` | Retrieves all blog articles (with search, category, sort) |
| **Read (Single)**| `GET` | `/api/posts/:id` | Retrieves a specific blog post by its MongoDB ObjectId |
| **Create** | `POST` | `/api/posts` | Inserts a new blog post document into MongoDB Atlas |
| **Update** | `PUT` | `/api/posts/:id` | Modifies an existing blog post document |
| **Delete** | `DELETE` | `/api/posts/:id` | Removes a blog post document permanently from Atlas |
| **Like** | `PATCH` | `/api/posts/:id/like` | Increments the likes counter on a post |
| **Seed** | `POST` | `/api/posts/seed` | Seeds initial cloud architecture articles into Atlas |

---

## 🚀 5. Local Setup & Testing

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)
- A **MongoDB Atlas** cluster connection URI (or local MongoDB)

### Step 1: Configure Backend Environment
Navigate to `backend/` and copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```
Inside `backend/.env`, set:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/blogDB?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Step 2: Start Backend Server
```bash
npm run dev
# Server will run on: http://localhost:5000
```

### Step 3: Configure and Start Frontend
In a new terminal window:
```bash
cd frontend
npm run dev
# Frontend will run on: http://localhost:5173
```

Open `http://localhost:5173` in your browser. The frontend will immediately ping the backend and display live connectivity!

---

## ☁️ 6. Cloud Deployment Guide (Step-by-Step)

Follow this deployment sequence to launch the 3-Tier application across the cloud:

### Step 1: Database Tier — MongoDB Atlas
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster** (e.g., in AWS `us-east-1` or closest region).
3. **Configure Database User**:
   - Go to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Set Authentication Method: `Password`. Choose a username (e.g., `clouduser`) and secure password.
   - Assign Role: `Read and write to any database`.
4. **Configure Network Access**:
   - Go to **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`). This is necessary so that Render servers can connect to the database.
5. **Obtain Connection String**:
   - Go to **Databases** → Click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection URI:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/blogDB?retryWrites=true&w=majority
     ```

---

### Step 2: Application Tier — Render
1. Push your repository to **GitHub**.
2. Sign in to [Render](https://render.com/).
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name**: `cloudscribe-api` (or your choice)
   - **Region**: Closest to your MongoDB Atlas cluster (e.g., Oregon or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(CRITICAL: Set to `backend` since it is a monorepo)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
6. **Configure Environment Variables** in Render:
   - Click **Advanced** / **Environment Variables**:
     - `MONGODB_URI`: *(Paste your MongoDB Atlas connection string with credentials)*
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: *(Leave blank or set to `https://your-app.netlify.app` once created)*
7. Click **Deploy Web Service**.
8. Once deployed, note down your Render public URL:
   ```text
   https://cloudscribe-api.onrender.com
   ```
   *(Test by visiting `https://cloudscribe-api.onrender.com/api/health` in your browser)*

---

### Step 3: Presentation Tier — Netlify
1. Sign in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** → **Import an existing project**.
3. Connect your **GitHub** account and choose this repository.
4. Configure the build settings:
   - **Base directory**: `frontend` *(CRITICAL: Set to `frontend`)*
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or `dist` relative to base)
5. **Configure Environment Variables**:
   - Under **Site configuration** → **Environment variables**, add:
     - `VITE_API_URL`: `https://cloudscribe-api.onrender.com` *(Your Render URL from Step 2)*
6. Click **Deploy Site**.
7. Netlify will generate a public URL such as:
   ```text
   https://cloudscribe-blog.netlify.app
   ```

---

### Step 4: Final Security & CORS Handshake
1. Return to your **Render Dashboard** for your backend service.
2. In **Environment Variables**, set:
   ```env
   FRONTEND_URL=https://cloudscribe-blog.netlify.app
   ```
3. Save changes. Render will perform an automated redeploy to lock down CORS access exclusively to your Netlify domain.

---

## 🧪 7. Test Cases & Verification Checklist

| Test ID | Operation | Test Execution Steps | Expected Result | Result |
|:---|:---|:---|:---|:---:|
| **TC-01** | **Add Blog Post (Create)** | Click "Write Post", input Title, Category, Author, and Body. Click "Publish Article". | Payload is sent via `POST /api/posts` to Render, persisted in MongoDB Atlas, and visible in UI. | ✅ PASS |
| **TC-02** | **View All Posts (Read)** | Load the Netlify homepage. | Frontend triggers `GET /api/posts` to Render, and renders the article cards. | ✅ PASS |
| **TC-03** | **Search & Filter (Query)** | Enter keywords in the search bar or click a Category pill. | Real-time query `GET /api/posts?category=...&search=...` filters articles without client reload. | ✅ PASS |
| **TC-04** | **Update Post (Edit)** | Click the edit pencil icon on a card, modify title/content, and save. | `PUT /api/posts/:id` is executed on Render and document is updated in MongoDB Atlas. | ✅ PASS |
| **TC-05** | **Delete Post (Delete)** | Click the trash icon, review the confirmation modal, and confirm. | `DELETE /api/posts/:id` removes the document from MongoDB Atlas. | ✅ PASS |
| **TC-06** | **Cloud Tier Ping (Health)** | Click "Ping Tiers" on the Tier Status Banner. | `GET /api/health` queries Render and verifies the active MongoDB Atlas connection state. | ✅ PASS |

---

## 🔒 8. Security & Architectural Compliance

1. **Isolation of Credentials**: No database credentials (`MONGODB_URI`) exist in the Netlify frontend source bundle. Database access is strictly confined to the Render backend environment.
2. **Strict Cross-Origin Security**: The Express backend uses CORS middleware to prevent unapproved external domains from making unauthorized state changes.
3. **Input Validation**: Mongoose schema and Express controllers validate post lengths, required fields, and category enums before attempting database operations.
4. **Independent Scaling**:
   - High traffic to the frontend is absorbed by Netlify's global CDN without burdening the application server.
   - Heavy data processing scales on Render without affecting UI availability.
   - MongoDB Atlas independently scales storage and IOPS.

---

## 👨‍💻 Author & Academic Submission
- **Project**: Design and Deployment of a Three-Tier Web Application
- **Frontend Layer**: Netlify
- **Application Layer**: Render
- **Database Layer**: MongoDB Atlas

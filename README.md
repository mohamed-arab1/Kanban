# Kanban ToDo Dashboard

A production-ready Kanban board built with **Next.js 14**, **TypeScript**, **React Query**, **Material UI**, and **dnd-kit**.

![Kanban Board](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![MUI](https://img.shields.io/badge/MUI-v7-007FFF) ![React Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154)

---

## Features

- **4 Kanban columns**: Backlog → In Progress → In Review → Done
- **Drag & drop** between columns with **optimistic updates**
- **Create / Edit / Delete** tasks via modal
- **Search** tasks by title or description
- **Pagination** per column (5 tasks per page)
- **Full loading & error states**
- **Responsive** layout (mobile scrolls horizontally)

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, file-based routing, React Server Components |
| Language | TypeScript 5 | Type safety across the entire codebase |
| Server State | TanStack Query v5 | Caching, optimistic updates, query invalidation |
| UI Library | Material UI v7 | Accessible, consistent, dense component set |
| Drag & Drop | dnd-kit | Modern, maintained, accessible, tree-shakeable |
| HTTP Client | Axios | Interceptors, typed responses |
| Mock API | json-server | Zero-config REST API from a JSON file |

---

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout: MUI theme + QueryProvider
│   ├── page.tsx            # Home page: AppBar + KanbanBoard
│   └── globals.css         # Global CSS reset
├── components/
│   ├── KanbanBoard.tsx     # DndContext orchestrator, task modal state
│   ├── KanbanColumn.tsx    # Droppable column + pagination
│   ├── TaskCard.tsx        # Sortable task card (drag handle, edit, delete)
│   ├── TaskModal.tsx       # Create / Edit dialog
│   └── SearchBar.tsx       # Debounced search input
├── features/tasks/
│   └── columnConfig.ts     # Column definitions & TASKS_PER_PAGE constant
├── hooks/
│   ├── useTasks.ts         # useQuery per column with search & pagination
│   └── useMutations.ts     # create / update / delete with optimistic updates
├── lib/
│   ├── api/
│   │   ├── client.ts       # Axios instance
│   │   └── tasks.api.ts    # Typed API functions (GET, POST, PATCH, DELETE)
│   ├── theme.ts            # MUI custom theme
│   └── EmotionRegistry.tsx # Emotion SSR registry for App Router
├── providers/
│   └── QueryProvider.tsx   # QueryClientProvider + DevTools
├── types/
│   └── task.types.ts       # Task, ColumnId, Priority, DTOs
├── db.json                 # json-server seed data (12 tasks)
└── .env.local              # NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install dependencies

```bash
cd task-manegment
npm install
```

### 2. Start the mock API (json-server)

```bash
npm run api
# → json-server running on http://localhost:4000
# → Tasks available at http://localhost:4000/tasks
```

### 3. Start the Next.js dev server

```bash
npm run dev
# → App running on http://localhost:3000
```

### 4. Run both simultaneously (recommended)

```bash
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints (json-server)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks?column=backlog&_page=1&_limit=5` | Fetch tasks (paginated, filterable) |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

### Full-text search
Append `q=<term>` to any GET request — json-server searches all string fields.

---

## Architecture Decisions

### React Query as the single source of truth
No Redux or Zustand. All server state lives in React Query's cache. Mutations use `onMutate` for optimistic updates with full rollback support on error.

### Query key strategy
```ts
taskKeys.list(column, page, search)
// → ["tasks", "list", { column, page, search }]
```
Each column × page × search combination is independently cached and invalidated.

### Optimistic drag & drop
`onDragEnd` calls `updateTask` which immediately mutates the cache before the API responds. If the request fails, `onError` restores the previous snapshot.

### dnd-kit design
- `DndContext` at board level with `closestCorners` collision
- Each column is a `useDroppable` zone
- Each task is `useSortable` with a dedicated drag handle
- `DragOverlay` renders a ghost card during drag

### Component memoization
`TaskCard`, `KanbanColumn`, `SearchBar`, and `TaskModal` are all wrapped with `React.memo`. Callbacks inside `KanbanBoard` use `useCallback` to prevent child re-renders.

---

## Deployment to Vercel

> **Note:** json-server is a dev-only mock. For production you'd replace it with a real backend. For this assessment, deploy json-server as a separate service or use Vercel's serverless API routes.

### Option A — Frontend only (json-server runs locally)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-api-server.com
```

### Option B — Full stack on Vercel (API routes)

Replace `lib/api/tasks.api.ts` calls with Next.js API routes (`/app/api/tasks/route.ts`) that proxy to a hosted database (e.g., PlanetScale, Supabase, Neon).

### Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the tasks API |

```markdown
# SRM Full Stack Engineering Challenge

A full-stack application that processes hierarchical node relationships and provides structured insights.

---

## 📁 Project Structure

```

srm-fullstack-challenge/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── utils/
│       └── processor.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md

````

---

## ⚙️ Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

---

## 🚀 Installation & Setup

### Backend Setup

```bash
cd backend
npm install
````

#### Run Backend

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

API runs at:

```
http://localhost:3000
```

---

### Frontend Setup

#### Option 1: Open directly

Open `frontend/index.html` in your browser

#### Option 2: Serve locally

```bash
cd frontend
npx serve .
```

#### Update API URL

In `frontend/script.js`:

```javascript
const API_URL = 'http://localhost:3000/bfhl'; // Replace with deployed backend URL if needed
```

---

## 📡 API Documentation

### Endpoint

```
POST /bfhl
```

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response

```json
{
  "user_id": "AdityaKumarSingh_09112005",
  "email_id": "aa5527@srmist.edu.in",
  "college_roll_number": "RA2311003010916",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {}
}
```

---

## ✅ Features

* REST API built with Express.js
* CORS enabled
* Strict input validation (`X->Y` format, uppercase only)
* Duplicate edge detection
* Cycle detection (DFS-based)
* Multi-tree support
* Depth calculation
* Multi-parent handling (first parent wins)
* Component grouping
* Optimized performance (<3 seconds for up to 50 nodes)
* Responsive frontend UI
* Error handling with clear messages
* Example data loading support

---

## 🌐 Deployment

### Backend (Render / Railway)

1. Create account on Render or Railway
2. Connect GitHub repository
3. Set build command:

   ```bash
   cd backend && npm install
   ```
4. Set start command:

   ```bash
   cd backend && npm start
   ```
5. Add environment variables if required
6. Deploy

---

### Frontend (Vercel / Netlify)

1. Create account on Vercel or Netlify
2. Connect GitHub repository
3. Set build directory:

   ```
   frontend
   ```
4. Deploy

---

## 🧪 Testing

### Using curl

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "A->C", "B->D"]}'
```

### Extended Test Case

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "A->C", "B->D", "C->E", "E->F", "X->Y", "Y->Z", "Z->X", "P->Q", "Q->R", "G->H", "G->H", "G->I", "hello", "1->2", "A->"]}'
```

---

## 🧠 Key Implementation Details

* **Input Validation:** Only accepts `X->Y` where X and Y are single uppercase letters
* **Duplicate Handling:** First occurrence kept, others stored in `duplicate_edges`
* **Cycle Detection:** DFS-based detection with proper tracking
* **Tree Construction:** Builds correct parent-child nested structures
* **Depth Calculation:** Longest root-to-leaf path
* **Multi-parent Handling:** First parent is retained
* **Component Grouping:** Identifies disconnected graph components
* **Performance:** Handles up to 50 nodes efficiently within time constraints

---

## 👤 Identity Information

* **User ID:** AdityaKumarSingh_09112005
* **Email:** [aa5527@srmist.edu.in](mailto:aa5527@srmist.edu.in)
* **Roll Number:** RA2311003010916

---

## 👨‍💻 Author

**Aditya Kumar Singh**
SRM University

```
```

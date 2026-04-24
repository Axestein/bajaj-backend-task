# SRM Full Stack Engineering Challenge

Hierarchy Node Relationship Analyzer - Full Stack Application

## Live Links

| Service | URL |
|---------|-----|
| **Frontend** | https://bajaj-backend-task.vercel.app/ |
| **Backend API** | https://bajaj-backend-task-w0my.onrender.com |
| **API Endpoint** | POST `/bfhl` |
| **GitHub Repo** | https://github.com/Axestein/bajaj-backend-task |

## Identity

```
User ID: AdityaKumarSingh_09112005
Email: aa5527@srmist.edu.in
Roll Number: RA2311003010916
```

## DEEP TESTING
1) Test Case 1: 50 Nodes Stress Test (Performance Test)
<img width="1920" height="1080" alt="Screenshot (989)" src="https://github.com/user-attachments/assets/ff2fa321-03fd-4d88-aff3-d6f2ef844b14" />
2) Test Case 2: Multiple Complex Trees
<img width="1920" height="1080" alt="Screenshot (990)" src="https://github.com/user-attachments/assets/eb4e738c-9dd6-4190-a542-c51cd689131b" />
3) Test Case 3: Diamond Patterns
<img width="1920" height="1080" alt="Screenshot (991)" src="https://github.com/user-attachments/assets/8a853470-5eec-437b-a027-aaf77b311dd3" />
4) Test Case 4: All Invalid Entries
<img width="1920" height="1080" alt="Screenshot (992)" src="https://github.com/user-attachments/assets/69d4aa53-c838-4f48-a7ff-a2c410d8bfa2" />
5) Test Case 5: Edge Cases - Duplicates and Self-loops
<img width="1920" height="1080" alt="Screenshot (993)" src="https://github.com/user-attachments/assets/8312edff-6650-40e7-a2e3-5ee9da7b1922" />


## Tech Stack

- **Backend:** Node.js, Express.js, CORS
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** Render (Backend), Vercel (Frontend)

## Project Structure

```
srm-fullstack/
├── backend/
│   ├── server.js              # Express server with /bfhl endpoint
│   ├── package.json           # Dependencies & scripts
│   └── utils/
│       └── processor.js       # Core logic for hierarchy processing
├── frontend/
│   ├── index.html             # Professional dark-theme UI
│   ├── style.css              # Enterprise-grade styling
│   └── script.js              # API integration & UI logic
└── README.md
```

## Quick Test

```bash
curl -X POST https://bajaj-backend-task-w0my.onrender.com/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data":["A->B","A->C","B->D","C->E","E->F","X->Y","Y->Z","Z->X","P->Q","Q->R","G->H","G->H","G->I","hello","1->2","A->"]}'
```

## API Specification

### Request
```
POST /bfhl
Content-Type: application/json

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
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": { "E": { "F": {} } } } },
      "depth": 4
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": ["hello", "1->2", "A->"],
  "duplicate_edges": ["G->H"],
  "summary": {
    "total_trees": 3,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## Features Implemented

- ✅ Input validation (X->Y format, uppercase A-Z only)
- ✅ Whitespace trimming before validation
- ✅ Self-loop detection (A->A marked invalid)
- ✅ Duplicate edge detection (keeps first, pushes rest)
- ✅ Cycle detection with DFS algorithm
- ✅ Multi-tree support with independent hierarchies
- ✅ Diamond/multi-parent handling (first parent wins)
- ✅ Depth calculation (longest root-to-leaf path)
- ✅ Lexicographic tiebreaker for largest tree root
- ✅ CORS enabled for cross-origin requests
- ✅ Response under 3 seconds for 50 nodes
- ✅ Professional dark-theme UI with code editor

## Processing Rules

| Rule | Description |
|------|-------------|
| **Valid Format** | `X->Y` where X,Y ∈ `[A-Z]` (single uppercase) |
| **Invalid Entries** | Multi-char, wrong separator, missing child, self-loop, empty |
| **Duplicate Edges** | First occurrence used, rest pushed to `duplicate_edges` |
| **Multi-Parent** | First parent edge wins, subsequent silently discarded |
| **Cycles** | Returns `has_cycle: true`, empty tree, no depth |
| **Root Detection** | Node never appearing as child in any valid edge |
| **Pure Cycle Root** | Lexicographically smallest node used as root |

## Run Locally

```bash
# Clone repo
git clone https://github.com/Axestein/bajaj-backend-task.git
cd bajaj-backend-task

# Backend
cd backend
npm install
npm start
# → http://localhost:3000

# Frontend (new terminal)
cd frontend
npx serve .
# → http://localhost:3000
```

## Test Cases

### Simple Tree
```json
{"data": ["A->B", "B->C", "C->D"]}
```

### Cycle Detection
```json
{"data": ["X->Y", "Y->Z", "Z->X"]}
```

### Diamond Pattern
```json
{"data": ["A->B", "A->C", "B->D", "C->D"]}
```

### 50 Nodes Stress Test
```json
{"data": ["A->B","B->C","C->D","D->E","E->F","F->G","G->H","H->I","I->J","J->K","K->L","L->M","M->N","N->O","O->P","P->Q","Q->R","R->S","S->T","T->U","U->V","V->W","W->X","X->Y","Y->Z","Z->A","M->Z","L->Y","K->X","J->W","I->V","H->U","G->T","F->S","E->R","D->Q","C->P","B->O","A->N","Z->M","A->B","C->D","E->F","G->H","I->J","K->L","M->N","O->P","Q->R","S->T","hello_world","123->456","","A->","AB->C"]}
```

**Built by:** Aditya Kumar Singh  
**Roll Number:** RA2311003010916  
**SRM Institute of Science and Technology**


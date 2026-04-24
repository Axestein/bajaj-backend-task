// ==================== Constants ====================
const API_URL = 'http://localhost:3000/bfhl';
let responseStartTime = 0;
let lastResponse = null;

// ==================== Examples ====================
const examples = {
    simple: {
        name: 'Simple Tree',
        data: '[\n  "A->B",\n  "A->C",\n  "B->D",\n  "C->E",\n  "E->F"\n]'
    },
    cycle: {
        name: 'Cycle Detection',
        data: '[\n  "X->Y",\n  "Y->Z",\n  "Z->X",\n  "A->B",\n  "B->C"\n]'
    },
    multiple: {
        name: 'Multiple Trees',
        data: '[\n  "A->B",\n  "B->C",\n  "X->Y",\n  "Y->Z",\n  "P->Q",\n  "Q->R"\n]'
    },
    complex: {
        name: 'Diamond Pattern',
        data: '[\n  "A->B",\n  "A->C",\n  "B->D",\n  "C->D",\n  "D->E",\n  "D->F"\n]'
    },
    stress: {
        name: '50 Nodes Test',
        data: '[\n  "A->B", "B->C", "C->D", "D->E", "E->F",\n  "F->G", "G->H", "H->I", "I->J", "J->K",\n  "K->L", "L->M", "M->N", "N->O", "O->P",\n  "P->Q", "Q->R", "R->S", "S->T", "T->U",\n  "U->V", "V->W", "W->X", "X->Y", "Y->Z",\n  "Z->A", "M->Z", "L->Y", "K->X", "J->W",\n  "I->V", "H->U", "G->T", "F->S", "E->R",\n  "D->Q", "C->P", "B->O", "A->N", "Z->M",\n  "A->B", "C->D", "E->F", "G->H", "I->J",\n  "K->L", "M->N", "O->P", "Q->R", "S->T",\n  "hello_world", "123->456", "", "A->", "AB->C"\n]'
    }
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('nodeInput');
    
    // Update line numbers
    updateLineNumbers();
    textarea.addEventListener('input', updateLineNumbers);
    textarea.addEventListener('scroll', syncScroll);
    
    // Keyboard shortcut
    textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            submitData();
        }
    });
    
    // Initial character count
    updateCharCount();
    textarea.addEventListener('input', updateCharCount);
});

function updateLineNumbers() {
    const textarea = document.getElementById('nodeInput');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = textarea.value.split('\n').length;
    let html = '';
    for (let i = 1; i <= lines; i++) {
        html += `${i}\n`;
    }
    lineNumbers.textContent = html;
}

function syncScroll() {
    const textarea = document.getElementById('nodeInput');
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.scrollTop = textarea.scrollTop;
}

function updateCharCount() {
    const textarea = document.getElementById('nodeInput');
    const charCount = textarea.value.length;
    document.getElementById('charCount').textContent = charCount.toLocaleString();
    
    // Count entries
    try {
        const parsed = JSON.parse(textarea.value);
        if (Array.isArray(parsed)) {
            document.getElementById('entryCount').textContent = parsed.length;
        }
    } catch {
        document.getElementById('entryCount').textContent = 'Invalid';
    }
}

// ==================== Format JSON ====================
function formatJSON() {
    const textarea = document.getElementById('nodeInput');
    try {
        const parsed = JSON.parse(textarea.value);
        textarea.value = JSON.stringify(parsed, null, 2);
        updateLineNumbers();
        updateCharCount();
    } catch {
        showError('Invalid JSON format. Cannot format.');
    }
}

// ==================== Load Example ====================
function loadExample(type) {
    const example = examples[type];
    if (!example) return;
    
    const textarea = document.getElementById('nodeInput');
    textarea.value = example.data;
    updateLineNumbers();
    updateCharCount();
    
    // Hide results
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    
    // Scroll to input
    document.getElementById('playground').scrollIntoView({ behavior: 'smooth' });
}

// ==================== Submit Data ====================
async function submitData() {
    const textarea = document.getElementById('nodeInput');
    const errorSection = document.getElementById('errorSection');
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    
    // Hide previous
    errorSection.style.display = 'none';
    resultSection.style.display = 'none';
    
    // Parse input
    let dataArray;
    try {
        dataArray = JSON.parse(textarea.value);
        if (!Array.isArray(dataArray)) {
            throw new Error('Input must be a JSON array');
        }
    } catch (e) {
        showError(`Invalid JSON: ${e.message}`);
        return;
    }
    
    // Show loading
    loadingSection.style.display = 'grid';
    
    // Disable button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Processing...
    `;
    
    responseStartTime = Date.now();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataArray })
        });
        
        const responseTime = Date.now() - responseStartTime;
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        lastResponse = result;
        
        loadingSection.style.display = 'none';
        displayResults(result, responseTime);
        resultSection.style.display = 'block';
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        loadingSection.style.display = 'none';
        showError(`Request failed: ${error.message}`);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send Request
        `;
    }
}

// ==================== Display Results ====================
function displayResults(result, responseTime) {
    // Summary
    document.getElementById('totalTrees').textContent = result.summary.total_trees;
    document.getElementById('totalCycles').textContent = result.summary.total_cycles;
    document.getElementById('largestRoot').textContent = result.summary.largest_tree_root || '—';
    document.getElementById('responseTime').textContent = `${responseTime}ms`;
    
    // Count badges
    document.getElementById('invalidCount').textContent = result.invalid_entries.length;
    document.getElementById('duplicateCount').textContent = result.duplicate_edges.length;
    
    // Hierarchies
    renderHierarchies(result.hierarchies);
    
    // Invalid entries
    renderEntries('invalidEntries', result.invalid_entries, 'invalid');
    
    // Duplicate edges
    renderEntries('duplicateEntries', result.duplicate_edges, 'duplicate');
    
    // Raw JSON
    document.getElementById('rawJson').textContent = JSON.stringify(result, null, 2);
    
    // Reset to first tab
    switchTab('hierarchies');
}

function renderHierarchies(hierarchies) {
    const container = document.getElementById('hierarchiesList');
    
    if (hierarchies.length === 0) {
        container.innerHTML = '<div class="no-entries">No hierarchies found</div>';
        return;
    }
    
    container.innerHTML = hierarchies.map((h, index) => {
        const isCycle = h['has_cycle'];
        const treeStr = JSON.stringify(h.tree, null, 2);
        
        return `
            <div class="hierarchy-card ${isCycle ? 'cycle' : ''}">
                <div class="card-header">
                    <div class="card-root">
                        <div class="root-icon">${h.root}</div>
                        <div class="root-info">
                            <span class="root-label">Root Node</span>
                            <span class="root-value">${h.root}</span>
                        </div>
                    </div>
                    <div class="badge-group">
                        ${isCycle ? '<span class="badge-cycle">⚠ Cycle</span>' : ''}
                        ${h.depth ? `<span class="badge-depth">Depth: ${h.depth}</span>` : ''}
                    </div>
                </div>
                <div class="tree-structure">${escapeHtml(treeStr)}</div>
            </div>
        `;
    }).join('');
}

function renderEntries(containerId, entries, type) {
    const container = document.getElementById(containerId);
    
    if (entries.length === 0) {
        container.innerHTML = '<div class="no-entries">Nothing to show</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="entries-container">
            ${entries.map(entry => `
                <span class="entry-tag ${type}">${escapeHtml(entry)}</span>
            `).join('')}
        </div>
    `;
}

// ==================== Tab Switching ====================
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activate selected tab
    const tabMap = {
        'hierarchies': 0,
        'invalid': 1,
        'duplicates': 2,
        'raw': 3
    };
    
    const tabs = document.querySelectorAll('.tab');
    if (tabs[tabMap[tabName]]) tabs[tabMap[tabName]].classList.add('active');
    
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) tabContent.classList.add('active');
}

// ==================== Error Handling ====================
function showError(message) {
    const errorSection = document.getElementById('errorSection');
    document.getElementById('errorMessage').textContent = message;
    errorSection.style.display = 'flex';
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

function closeError() {
    document.getElementById('errorSection').style.display = 'none';
}

// ==================== Clear Data ====================
function clearData() {
    document.getElementById('nodeInput').value = '';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    updateLineNumbers();
    updateCharCount();
}

// ==================== Utilities ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add spinning animation
const style = document.createElement('style');
style.textContent = `
    .spinning {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
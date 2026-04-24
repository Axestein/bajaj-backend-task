/**
 * Validates if a node string matches the format X->Y where X and Y are single uppercase letters
 */
function isValidNode(node) {
    // Trim whitespace
    const trimmed = node.trim();
    
    // Check format: single uppercase letter -> single uppercase letter
    const pattern = /^[A-Z]->[A-Z]$/;
    return pattern.test(trimmed);
}

/**
 * Processes the input data array and returns hierarchies, invalid entries, duplicates, and summary
 */
function processHierarchy(data) {
    // Step 1: Validate entries and separate invalid ones
    const validEntries = [];
    const invalidEntries = [];
    
    data.forEach(entry => {
        if (isValidNode(entry)) {
            validEntries.push(entry.trim());
        } else {
            invalidEntries.push(entry);
        }
    });

    // Step 2: Handle duplicates
    const seen = new Set();
    const uniqueEdges = [];
    const duplicateEdges = [];
    
    validEntries.forEach(edge => {
        if (seen.has(edge)) {
            duplicateEdges.push(edge);
        } else {
            seen.add(edge);
            uniqueEdges.push(edge);
        }
    });

    // Step 3: Build edge maps for tree construction
    const edges = uniqueEdges.map(edge => {
        const [parent, child] = edge.split('->');
        return { parent, child };
    });

    // Build parent->children and child->parents maps
    const parentToChildren = new Map();
    const childToParents = new Map();
    
    edges.forEach(({ parent, child }) => {
        // Add to parent->children map
        if (!parentToChildren.has(parent)) {
            parentToChildren.set(parent, []);
        }
        parentToChildren.get(parent).push(child);
        
        // Add to child->parents map (first parent wins)
        if (!childToParents.has(child)) {
            childToParents.set(child, parent);
        }
    });

    // Step 4: Find all nodes
    const allNodes = new Set();
    edges.forEach(({ parent, child }) => {
        allNodes.add(parent);
        allNodes.add(child);
    });

    // Step 5: Find roots (nodes that never appear as children)
    const roots = [];
    allNodes.forEach(node => {
        if (!childToParents.has(node)) {
            roots.push(node);
        }
    });

    // Step 6: Group nodes into connected components
    const visited = new Set();
    const components = [];
    
    // Build undirected graph for component finding
    const undirectedAdj = new Map();
    allNodes.forEach(node => {
        undirectedAdj.set(node, new Set());
    });
    
    edges.forEach(({ parent, child }) => {
        undirectedAdj.get(parent).add(child);
        undirectedAdj.get(child).add(parent);
    });
    
    function dfs(node, component) {
        visited.add(node);
        component.add(node);
        undirectedAdj.get(node).forEach(neighbor => {
            if (!visited.has(neighbor)) {
                dfs(neighbor, component);
            }
        });
    }
    
    allNodes.forEach(node => {
        if (!visited.has(node)) {
            const component = new Set();
            dfs(node, component);
            components.push(component);
        }
    });

    // Step 7: Process each component
    const hierarchies = [];
    
    components.forEach(componentNodes => {
        // Find root for this component
        let root = null;
        
        // Check if any node in component is a root
        const componentRoots = roots.filter(r => componentNodes.has(r));
        
        if (componentRoots.length > 0) {
            // Use lexicographically smallest root
            componentRoots.sort();
            root = componentRoots[0];
        } else {
            // Pure cycle - all nodes are children
            // Use lexicographically smallest node as root
            const sortedNodes = Array.from(componentNodes).sort();
            root = sortedNodes[0];
        }

        // Detect cycle using DFS
        const hasCycle = detectCycle(componentNodes, parentToChildren, root);
        
        if (hasCycle) {
            hierarchies.push({
                root: root,
                tree: {},
                "has_cycle": true
            });
        } else {
            // Build tree
            const tree = buildTree(root, parentToChildren);
            const depth = calculateDepth(root, parentToChildren);
            
            const hierarchy = {
                root: root,
                tree: tree,
                depth: depth
            };
            
            hierarchies.push(hierarchy);
        }
    });

    // Step 8: Calculate summary
    const nonCyclicHierarchies = hierarchies.filter(h => !h["has_cycle"]);
    const cyclicHierarchies = hierarchies.filter(h => h["has_cycle"]);
    
    let largestTreeRoot = null;
    if (nonCyclicHierarchies.length > 0) {
        const maxDepth = Math.max(...nonCyclicHierarchies.map(h => h.depth));
        const largestTrees = nonCyclicHierarchies
            .filter(h => h.depth === maxDepth)
            .map(h => h.root)
            .sort();
        largestTreeRoot = largestTrees[0];
    }

    const summary = {
        total_trees: nonCyclicHierarchies.length,
        total_cycles: cyclicHierarchies.length,
        largest_tree_root: largestTreeRoot
    };

    return {
        hierarchies: hierarchies,
        invalid_entries: invalidEntries,
        duplicate_edges: duplicateEdges,
        summary: summary
    };
}

/**
 * Detects if there's a cycle in the component starting from root
 */
function detectCycle(componentNodes, parentToChildren, root) {
    const visited = new Set();
    const recursionStack = new Set();
    
    function dfs(node) {
        if (!componentNodes.has(node)) return false;
        
        visited.add(node);
        recursionStack.add(node);
        
        const children = parentToChildren.get(node) || [];
        
        for (const child of children) {
            if (!visited.has(child)) {
                if (dfs(child)) return true;
            } else if (recursionStack.has(child)) {
                return true;
            }
        }
        
        recursionStack.delete(node);
        return false;
    }
    
    // Check all nodes in component
    for (const node of componentNodes) {
        if (!visited.has(node)) {
            if (dfs(node)) return true;
        }
    }
    
    return false;
}

/**
 * Builds a nested tree object
 */
function buildTree(root, parentToChildren) {
    const tree = {};
    
    function buildNode(node) {
        const children = parentToChildren.get(node) || [];
        const nodeObj = {};
        
        children.forEach(child => {
            nodeObj[child] = buildNode(child);
        });
        
        return nodeObj;
    }
    
    tree[root] = buildNode(root);
    return tree;
}

/**
 * Calculates the depth of the tree (number of nodes on longest path)
 */
function calculateDepth(root, parentToChildren) {
    function getDepth(node) {
        const children = parentToChildren.get(node) || [];
        
        if (children.length === 0) {
            return 1;
        }
        
        let maxChildDepth = 0;
        children.forEach(child => {
            const childDepth = getDepth(child);
            if (childDepth > maxChildDepth) {
                maxChildDepth = childDepth;
            }
        });
        
        return 1 + maxChildDepth;
    }
    
    return getDepth(root);
}

module.exports = { processHierarchy, isValidNode };
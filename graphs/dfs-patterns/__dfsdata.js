const P_DFS = [
{
  cat:'CORE', label:'Basic Graph DFS (recursive)', done:true,
  when:`Traverse one connected graph by going as DEEP as possible before backing up.`,
  insight:`<code>dfs(u)</code>: mark <code>u</code> on entry, recurse into each unvisited neighbour. <b>Returning from a call = backtracking.</b> The call stack remembers where to resume.`,
  analogy:`A maze where you always take the first unexplored door; when you hit a dead end you walk back to the last junction and try its next door. Recursion's call stack <i>is</i> that trail of junctions.`,
  bugs:[`Marking visited too late (not on entry) → revisits and stack overflow.`,
        `Huge grids → recursion depth blows the stack; switch to the iterative/explicit-stack version.`],
  problems:[['BFS of Graph / DFS of Graph (GFG)',1],['Clone Graph (LC 133)',0]],
  code:`class Solution {
    // ───── HELPER: dive as deep as possible ─────
    void dfs(int u, vector<vector<int>>& adj, vector<int>& vis, vector<int>& out){
        vis[u] = 1;                       // ★ mark on ENTRY
        out.push_back(u);                 // record visit order
        for(int v : adj[u])
            if(!vis[v]) dfs(v, adj, vis, out);  // ★ go deep first
    }                                     // return here = backtrack
public:
    // ───── DRIVER: LeetCode / GFG entry point ─────
    vector<int> dfsOfGraph(int V, vector<vector<int>>& adj){
        vector<int> vis(V, 0), out;
        dfs(0, adj, vis, out);            // launch DFS from source 0
        return out;
    }
};`
},
{
  cat:'CORE', label:'Iterative DFS (explicit stack)', done:true,
  when:`Same as recursive DFS but you control the stack yourself — avoids recursion-depth limits.`,
  insight:`Replace the call stack with a real <code>stack</code>. Pop a node, push its unvisited neighbours. Order differs slightly from recursion but it's still depth-first.`,
  analogy:`The recursion was hiding a stack the whole time — here you just hold it in your hand.`,
  bugs:[`Marking visited on <b>pop</b> instead of <b>push</b> → duplicates pile up on the stack.`],
  problems:[['Any DFS problem on a deep graph',0],['Number of Islands — iterative (LC 200)',0]],
  code:`class Solution {
public:
    // DRIVER + HELPER in one — no recursion, you hold the stack
    vector<int> dfsIterative(int V, vector<vector<int>>& adj, int src){
        vector<int> vis(V, 0), out;
        stack<int> st;
        st.push(src); vis[src] = 1;        // ★ mark when you PUSH
        while(!st.empty()){
            int u = st.top(); st.pop();
            out.push_back(u);              // process u
            for(int v : adj[u])
                if(!vis[v]){ vis[v] = 1; st.push(v); }
        }
        return out;
    }
};`
},
{
  cat:'CORE', label:'Connected Components (DFS)', done:true,
  when:`Count disconnected pieces of a graph.`,
  insight:`Outer loop over all V nodes; each unvisited node launches one DFS = one component. Never reset vis.`,
  analogy:`Number of Islands on an adjacency list — each fresh DFS drowns one whole component.`,
  bugs:[`Resetting vis between launches → recounts.`],
  problems:[['Number of Provinces (LC 547)',1],['Connected Components',1]],
  code:`class Solution {
    // ───── HELPER: drown one whole component ─────
    void dfs(int u, vector<vector<int>>& adj, vector<int>& vis){
        vis[u] = 1;
        for(int v : adj[u]) if(!vis[v]) dfs(v, adj, vis);
    }
public:
    // ───── DRIVER: one DFS launch per component ─────
    int countComponents(int V, vector<vector<int>>& adj){
        vector<int> vis(V, 0); int cnt = 0;
        for(int i = 0; i < V; i++)
            if(!vis[i]){ cnt++; dfs(i, adj, vis); }  // ★ one DFS per component
        return cnt;
    }
};`
},
{
  cat:'GRID', label:'Flood Fill (DFS)', done:true,
  when:`Recolour / visit one connected region from a start cell.`,
  insight:`Cell = node, 4 neighbours = edges. Recurse into each valid same-region neighbour. No queue — the recursion dives a tendril deep, then backtracks.`,
  analogy:`Paint spilling, but it runs all the way down one channel first, then comes back to fill the side channels.`,
  bugs:[`No bounds/condition check before recursing → out-of-range access.`,
        `Marking visited after the recursive call instead of before → infinite recursion.`],
  problems:[['Flood Fill (LC 733)',1]],
  code:`class Solution {
    int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    // ───── HELPER: recolour this region in place ─────
    void dfs(int r,int c, vector<vector<int>>& img, int oldC, int newC){
        img[r][c] = newC;                  // ★ recolour on ENTRY
        for(int d=0; d<4; d++){
            int nr=r+dr[d], nc=c+dc[d];
            if(nr>=0 && nr<img.size() && nc>=0 && nc<img[0].size()
               && img[nr][nc]==oldC)
                dfs(nr,nc,img,oldC,newC);  // ★ recurse into neighbour
        }
    }
public:
    // ───── DRIVER: LC 733 signature ─────
    vector<vector<int>> floodFill(vector<vector<int>>& img,int sr,int sc,int color){
        if(img[sr][sc]!=color) dfs(sr,sc,img,img[sr][sc],color);  // guard same-colour
        return img;
    }
};`
},
{
  cat:'GRID', label:'Number of Islands (DFS)', done:true,
  when:`Count connected regions in a grid.`,
  insight:`Double loop; each unvisited land cell → <code>cnt++</code> and a DFS that sinks the whole island.`,
  analogy:`Exactly your BFS Number of Islands — swap the queue-flood for a recursive sink. Same answer, different traversal order.`,
  bugs:[`<code>vis(m, vector(m,0))</code> — inner must be <b>n</b>.`,
        `cnt++ without the <code>!vis</code> guard → over-counts.`],
  problems:[['Number of Islands (LC 200)',1],['Connected Components (matrix)',1]],
  code:`class Solution {
    int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    // ───── HELPER: sink one island ('1' grid is char on LC 200) ─────
    void dfs(int r,int c, vector<vector<char>>& g, vector<vector<int>>& vis){
        vis[r][c] = 1;
        for(int d=0; d<4; d++){
            int nr=r+dr[d], nc=c+dc[d];
            if(nr>=0 && nr<g.size() && nc>=0 && nc<g[0].size()
               && g[nr][nc]=='1' && !vis[nr][nc])
                dfs(nr,nc,g,vis);          // sink the rest of the island
        }
    }
public:
    // ───── DRIVER: LC 200 signature ─────
    int numIslands(vector<vector<char>>& g){
        int m=g.size(), n=g[0].size(), cnt=0;
        vector<vector<int>> vis(m, vector<int>(n,0));
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            if(g[i][j]=='1' && !vis[i][j]){
                cnt++;               // ★ new island
                dfs(i,j,g,vis);      // sink the whole island
            }
        return cnt;
    }
};`
},
{
  cat:'GRID', label:'Max Area / Component Size (DFS)', done:true,
  when:`Size of a component (largest island, area).`,
  insight:`DFS <b>returns</b> the size: <code>1 + sum of children's areas</code>. Much cleaner than BFS here — recursion adds up naturally.`,
  analogy:`Each cell reports "me (1) plus everything my neighbours reported". The root gets the whole island's size.`,
  bugs:[`Forgetting the <code>+1</code> for the current cell.`,
        `Returning area before all 4 recursions finish.`],
  problems:[['Max Area of Island (LC 695)',0],['Count Sub Islands (LC 1905)',0]],
  code:`class Solution {
    int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    // ───── HELPER: returns the area of this island ─────
    int dfs(int r,int c, vector<vector<int>>& g, vector<vector<int>>& vis){
        vis[r][c] = 1;
        int area = 1;                    // ★ count THIS cell
        for(int d=0; d<4; d++){
            int nr=r+dr[d], nc=c+dc[d];
            if(nr>=0 && nr<g.size() && nc>=0 && nc<g[0].size()
               && g[nr][nc]==1 && !vis[nr][nc])
                area += dfs(nr,nc,g,vis);  // ★ sum children
        }
        return area;
    }
public:
    // ───── DRIVER: LC 695 signature ─────
    int maxAreaOfIsland(vector<vector<int>>& g){
        int m=g.size(), n=g[0].size(), best=0;
        vector<vector<int>> vis(m, vector<int>(n,0));
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            if(g[i][j]==1 && !vis[i][j])
                best = max(best, dfs(i,j,g,vis));  // ★ max over components
        return best;
    }
};`
},
{
  cat:'GRID', label:'Two-Grid Sub Islands (DFS)', done:true,
  when:`Validate each grid2 island against grid1.`,
  insight:`DFS returns <code>true</code> only if EVERY cell of the island is land in grid1. Combine children with <code>&amp;&amp;</code> — but DFS all of them, don't short-circuit.`,
  analogy:`Same as your BFS sub-islands: flood the whole island, remember if you ever stepped on grid1-water.`,
  bugs:[`Short-circuiting <code>&amp;&amp;</code> stops the DFS early → some cells never marked visited → recounted later. Recurse first, AND after.`],
  problems:[['Count Sub Islands (LC 1905)',0]],
  code:`class Solution {
    int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    // ───── HELPER: flood g2 island, returns true if fully inside g1 ─────
    bool dfs(int r,int c, vector<vector<int>>& g1, vector<vector<int>>& g2,
             vector<vector<int>>& vis){
        vis[r][c] = 1;
        bool ok = (g1[r][c] == 1);        // ★ this cell must be land in g1
        for(int d=0; d<4; d++){
            int nr=r+dr[d], nc=c+dc[d];
            if(nr>=0 && nr<g2.size() && nc>=0 && nc<g2[0].size()
               && g2[nr][nc]==1 && !vis[nr][nc])
                ok = dfs(nr,nc,g1,g2,vis) && ok;  // ★ AND, but DFS first
        }
        return ok;
    }
public:
    // ───── DRIVER: LC 1905 signature ─────
    int countSubIslands(vector<vector<int>>& g1, vector<vector<int>>& g2){
        int m=g2.size(), n=g2[0].size(), cnt=0;
        vector<vector<int>> vis(m, vector<int>(n,0));
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            if(g2[i][j]==1 && !vis[i][j] && dfs(i,j,g1,g2,vis))
                cnt++;                    // ★ whole island sat inside g1
        return cnt;
    }
};`
},
{
  cat:'GRID', label:'Grid DFS — 8-Directional', done:true,
  when:`Diagonal connectivity (king / X-shaped regions).`,
  insight:`Only dr/dc and the loop bound change (4 → 8). DFS body identical.`,
  analogy:`Same dive-and-backtrack, just more doors out of every room.`,
  bugs:[`Leaving the loop at <code>d &lt; 4</code> after expanding to 8 dirs.`],
  problems:[['Making A Large Island (diagonal variants)',0],['Max Area — 8-dir',0]],
  code:`class Solution {
    int dr[8]={-1,-1,-1,0,0,1,1,1};    // ★ 8 dirs = 4 straight + 4 diagonal
    int dc[8]={-1,0,1,-1,1,-1,0,1};
    // ───── HELPER: body identical to 4-dir, just loop d<8 ─────
    void dfs(int r,int c, vector<vector<int>>& g, vector<vector<int>>& vis){
        vis[r][c] = 1;
        for(int d=0; d<8; d++){        // ★ 0..8, NOT 0..4
            int nr=r+dr[d], nc=c+dc[d];
            if(nr>=0 && nr<g.size() && nc>=0 && nc<g[0].size()
               && g[nr][nc]==1 && !vis[nr][nc])
                dfs(nr,nc,g,vis);
        }
    }
public:
    // ───── DRIVER: count diagonally-connected regions ─────
    int countRegions8(vector<vector<int>>& g){
        int m=g.size(), n=g[0].size(), cnt=0;
        vector<vector<int>> vis(m, vector<int>(n,0));
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            if(g[i][j]==1 && !vis[i][j]){ cnt++; dfs(i,j,g,vis); }
        return cnt;
    }
};`
},
{
  cat:'BOUNDARY', label:'Boundary DFS (Surrounded / Enclaves)', done:true,
  when:`Keep / count whatever connects to the border; kill the rest.`,
  insight:`DFS from every border land/'O' cell → mark SAFE. Anything left unmarked is captured. Reverse thinking, same as the BFS version.`,
  analogy:`Find who can escape (touches an edge), not who's trapped. DFS dives along the escape route.`,
  bugs:[`Seeding from interior instead of the border.`,
        `Recursing through 'X' instead of 'O'.`],
  problems:[['Surrounded Regions (LC 130)',1],['Number of Enclaves (LC 1020)',1]],
  code:`class Solution {
    int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    // ───── HELPER: mark border-connected 'O' as SAFE ('#') ─────
    void dfs(int r,int c, vector<vector<char>>& b){
        b[r][c] = '#';                     // ★ SAFE: connected to border
        for(int d=0; d<4; d++){
            int nr=r+dr[d], nc=c+dc[d];
            if(nr>=0 && nr<b.size() && nc>=0 && nc<b[0].size()
               && b[nr][nc]=='O') dfs(nr,nc,b);
        }
    }
public:
    // ───── DRIVER: LC 130 signature ─────
    void solve(vector<vector<char>>& b){
        int m=b.size(), n=b[0].size();
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)          // ★ seed BORDER only
            if((i==0||i==m-1||j==0||j==n-1) && b[i][j]=='O') dfs(i,j,b);
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            b[i][j] = (b[i][j]=='#') ? 'O' : 'X';          // leftover 'O' = captured
    }
};`
},
{
  cat:'GRAPH', label:'Cycle Detection — Undirected (DFS)', done:true,
  when:`Detect a cycle in an undirected graph using recursion + parent.`,
  insight:`<code>dfs(u, parent)</code>. If a neighbour is visited AND is <b>not</b> your parent → back-edge → cycle.`,
  analogy:`The grid never needed a parent (vis stopped backtracking). A real graph can loop, so you must remember who you came from — bumping into anyone else already visited means a loop.`,
  bugs:[`Treating the parent as a cycle → false positive.`,
        `Parallel edges: a true duplicate edge to the parent IS a cycle — guard if needed.`],
  problems:[['Detect Cycle Undirected (GFG)',0],['Graph Valid Tree (LC 261)',0]],
  code:`class Solution {
    // ───── HELPER: dfs carries the parent ─────
    bool dfs(int u, int parent, vector<vector<int>>& adj, vector<int>& vis){
        vis[u] = 1;
        for(int v : adj[u]){
            if(!vis[v]){ if(dfs(v,u,adj,vis)) return true; }
            else if(v != parent) return true;   // ★ back-edge => cycle
        }
        return false;
    }
public:
    // ───── DRIVER: check every component (GFG isCycle) ─────
    bool isCycle(int V, vector<vector<int>>& adj){
        vector<int> vis(V, 0);
        for(int i=0;i<V;i++)
            if(!vis[i] && dfs(i,-1,adj,vis)) return true;  // parent = -1
        return false;
    }
};`
},
{
  cat:'GRAPH', label:'Cycle Detection — Directed (DFS, 3-colour)', done:true,
  when:`Detect a cycle in a DIRECTED graph.`,
  insight:`Colour nodes white (unseen) → gray (on the recursion stack) → black (done). An edge to a <b>gray</b> node is a back-edge → cycle. Visited (black) alone is NOT a cycle.`,
  analogy:`Gray = "still in the room I'm exploring". If I find a door back into a room I'm currently inside, I've gone in a circle.`,
  bugs:[`Using a plain <code>visited</code> instead of gray/black → false positives on cross/forward edges.`,
        `Forgetting to set black on the way out.`],
  problems:[['Course Schedule (LC 207)',0],['Find Eventual Safe States (LC 802)',0]],
  code:`class Solution {
    // 0=white(unseen) 1=gray(on stack) 2=black(done)
    // ───── HELPER: 3-colour DFS ─────
    bool dfs(int u, vector<vector<int>>& adj, vector<int>& col){
        col[u] = 1;                        // ★ gray: on recursion stack
        for(int v : adj[u]){
            if(col[v] == 1) return true;   // ★ edge to gray = cycle
            if(col[v] == 0 && dfs(v,adj,col)) return true;
        }
        col[u] = 2;                        // black: fully done
        return false;
    }
public:
    // ───── DRIVER: GFG isCyclic (directed) ─────
    bool isCyclic(int V, vector<vector<int>>& adj){
        vector<int> col(V, 0);
        for(int i=0;i<V;i++)
            if(col[i]==0 && dfs(i,adj,col)) return true;
        return false;
    }
};`
},
{
  cat:'GRAPH', label:'Bipartite Check (DFS colouring)', done:true,
  when:`Can the graph be 2-coloured so no edge joins same colours?`,
  insight:`DFS, give each neighbour the opposite colour. If a neighbour already has the SAME colour → not bipartite.`,
  analogy:`Two teams; every edge must cross teams. Forced to put teammates on one edge → impossible.`,
  bugs:[`Forgetting disconnected components (loop all nodes).`],
  problems:[['Is Graph Bipartite (LC 785)',0]],
  code:`class Solution {
    // ───── HELPER: paint u, give neighbours the opposite colour ─────
    bool dfs(int u, int c, vector<vector<int>>& adj, vector<int>& color){
        color[u] = c;
        for(int v : adj[u]){
            if(color[v]==-1){ if(!dfs(v, c^1, adj, color)) return false; }
            else if(color[v]==c) return false;   // ★ same-colour neighbour
        }
        return true;
    }
public:
    // ───── DRIVER: LC 785 signature ─────
    bool isBipartite(vector<vector<int>>& adj){
        int n = adj.size();
        vector<int> color(n, -1);              // -1 = uncoloured
        for(int i=0;i<n;i++)                    // ★ cover all components
            if(color[i]==-1 && !dfs(i,0,adj,color)) return false;
        return true;
    }
};`
},
{
  cat:'GRAPH', label:'Topological Sort (DFS post-order)', done:true,
  when:`Order a DAG by dependencies.`,
  insight:`DFS, and push a node to the order <b>after</b> all its children finish (post-order). Reverse that list = a valid topological order.`,
  analogy:`You can only "finish" a task once everything it points to is finished — so finished-order, reversed, respects every dependency.`,
  bugs:[`Pushing in pre-order (on entry) instead of post-order → wrong order.`,
        `Forgetting to reverse the post-order list.`],
  problems:[['Course Schedule II (LC 210)',0],['Alien Dictionary',0]],
  code:`class Solution {
    // ───── HELPER: push on the way OUT (post-order) ─────
    void dfs(int u, vector<vector<int>>& adj, vector<int>& vis, vector<int>& order){
        vis[u] = 1;
        for(int v : adj[u]) if(!vis[v]) dfs(v,adj,vis,order);
        order.push_back(u);          // ★ POST-order: after children
    }
public:
    // ───── DRIVER: GFG topoSort ─────
    vector<int> topoSort(int V, vector<vector<int>>& adj){
        vector<int> vis(V, 0), order;
        for(int i=0;i<V;i++) if(!vis[i]) dfs(i,adj,vis,order);
        reverse(order.begin(), order.end());   // ★ reverse post-order
        return order;
    }
};`
},
{
  cat:'PATHS', label:'All Paths source→target (Backtracking)', done:true,
  when:`Enumerate every path from a source to a target (DAG / small graph).`,
  insight:`DFS that <b>adds the node to the path, recurses, then removes it</b> (backtracks). On reaching the target, record a copy of the current path.`,
  analogy:`Try a branch fully, snapshot it if it reaches the goal, then undo your last step and try the next branch.`,
  bugs:[`Forgetting <code>path.pop_back()</code> → paths leak into each other.`,
        `Recording a reference instead of a COPY of the path.`],
  problems:[['All Paths From Source to Target (LC 797)',0],['Combination / subset backtracking',0]],
  code:`class Solution {
    // ───── HELPER: choose → recurse → un-choose ─────
    void dfs(int u, int target, vector<vector<int>>& adj,
             vector<int>& path, vector<vector<int>>& res){
        path.push_back(u);
        if(u == target) res.push_back(path);     // ★ found a full path (copy)
        else for(int v : adj[u]) dfs(v, target, adj, path, res);
        path.pop_back();             // ★ backtrack: undo the choice
    }
public:
    // ───── DRIVER: LC 797 signature (src=0, target=n-1) ─────
    vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph){
        vector<vector<int>> res; vector<int> path;
        dfs(0, graph.size()-1, graph, path, res);
        return res;
    }
};`
}
];
let TECH='dfs';
let P = P_DFS;

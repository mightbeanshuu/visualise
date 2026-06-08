/* ===== directed graph with a cycle (for directed cycle detection) ===== */
const G_DCYC={start:0,directed:true,nodes:[{pos:[-2,0.2,0]},{pos:[-0.5,1.1,0.3]},{pos:[1.1,0.3,-0.4]},{pos:[0.2,-1.1,0.5]},{pos:[-1.6,-1.2,-0.5]}],edges:[[0,1],[1,2],[2,3],[3,1],[0,4]]};
const DIR8F=[[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]];

/* ===== DFS traces ===== */
const T_DFS=["dfs(u):","  vis[u]=1;               // ENTER (push u)","  for(v : adj[u])","    if(!vis[v]) dfs(v);   // dive deeper","  // neighbours done -> POP u (backtrack)"];
const H_DFS={seed:[1],enter:[2,3],back:[4],done:[4]};
const T_ITER=["st.push(src); vis[src]=1;","while(!st.empty()){","  u=st.top(); st.pop();","  for(v:adj[u]) if(!vis[v]){","    vis[v]=1; st.push(v); }","}"];
const H_ITER={seed:[0],enter:[3,4],back:[2],done:[5]};
const T_DCMP=["for(i=0;i<V;i++)","  if(!vis[i]){ cnt++;   // new component","    dfs(i); }"];
const H_DCMP={seed:[0,1],enter:[2],back:[2],done:[]};
const T_GFLOOD=["void dfs(int r,int c){","  vis[r][c]=1;            // enter","  for(d:4){ nr,nc;","    if(valid && g==1 && !vis)","      dfs(nr,nc); }       // dive","}                          // backtrack on return"];
const H_GFLOOD={seed:[0,1],enter:[3,4],back:[5],done:[]};
const T_GAREA=["int dfs(int r,int c){","  vis[r][c]=1; int area=1;   // count me","  for(d:4) if(valid&&g==1&&!vis)","    area += dfs(nr,nc);      // sum children","  return area; }             // backtrack"];
const H_GAREA={seed:[0,1],enter:[2,3],back:[4],done:[]};
const T_GBND=["// DFS from every border 'O'","void dfs(int r,int c){ vis[r][c]=1;","  for(d:4) if(b[nr][nc]=='O' && !vis)","    dfs(nr,nc); }   // mark SAFE","// leftover 'O' = captured"];
const H_GBND={seed:[0,1],enter:[2,3],back:[3],trap:[4],done:[4]};
const T_GSUB=["bool dfs(int r,int c){ vis=1;","  bool ok=(g1[r][c]==1);   // on g1 land?","  for(d:4) if(g2==1 && !vis)","    ok = dfs(nr,nc) && ok; // DFS FIRST","  return ok; }"];
const H_GSUB={seed:[0,1],enter:[2,3],back:[4],judge:[4],done:[]};
const T_CYU=["dfs(u,parent): vis[u]=1;","  for(v:adj[u]){","    if(!vis[v]) dfs(v,u);","    else if(v!=parent) CYCLE; }"];
const H_CYU={seed:[0],enter:[1,2],cycle:[3],back:[0],done:[]};
const T_CYD=["dfs(u): col[u]=GRAY;","  for(v:adj[u]){","    if(col[v]==GRAY) CYCLE;","    if(col[v]==WHITE) dfs(v); }","  col[u]=BLACK;   // done"];
const H_CYD={seed:[0],enter:[1,3],cycle:[2],back:[4],done:[4]};
const T_DBIP=["dfs(u,c): color[u]=c;","  for(v:adj[u]){","    if(color[v]==-1) dfs(v,c^1);","    else if(color[v]==c) FAIL; }"];
const H_DBIP={seed:[0],enter:[1,2],cycle:[3],back:[1],done:[]};
const T_DTOPO=["dfs(u): vis[u]=1;","  for(v:adj[u]) if(!vis[v]) dfs(v);","  order.push_front(u);   // POST-order"];
const H_DTOPO={seed:[0],enter:[1],back:[2],done:[2]};
const T_DPATH=["dfs(u): path.push(u);","  if(u==target) record(path);","  else for(v:adj[u]) dfs(v);","  path.pop();            // backtrack"];
const H_DPATH={seed:[0],enter:[2],found:[1],back:[3],done:[]};

/* ===== which technique actually solves a pattern ===== */
function bestTool(p){
  const L=p.label, c=p.cat;
  if(c==='MULTI'||c==='LEVEL'||c==='SHORTEST') return {tag:'BFS only', color:'#00e5ff', why:'shortest distance / level counting needs BFS’s ring-by-ring order — DFS cannot guarantee the shortest path.'};
  if(L.indexOf('Bidirectional')===0||L.indexOf('State-Space')===0) return {tag:'BFS only', color:'#00e5ff', why:'finding the SHORTEST transformation / meeting point needs BFS layers.'};
  if(L.indexOf('Topological')>=0) return {tag:'BFS or DFS', color:'#bf5af2', why:'Kahn’s (BFS indegree) OR DFS post-order — both produce a valid order.'};
  if(L.indexOf('Cycle Detection — Directed')===0) return {tag:'DFS-natural', color:'#f78fb3', why:'the gray / on-stack colour IS the recursion stack — far cleaner with DFS.'};
  if(L.indexOf('All Paths')===0) return {tag:'DFS only', color:'#f78fb3', why:'enumerating every path = backtracking, which is inherently DFS.'};
  if(L.indexOf('Iterative DFS')===0) return {tag:'DFS', color:'#f78fb3', why:'depth-first by construction (an explicit stack).'};
  return {tag:'BFS or DFS', color:'#69ff47', why:'pure connectivity / region work — both traverse the same cells; pick whichever reads cleaner.'};
}

/* ===== DFS demo routing ===== */
function gdfs(mode,base,extra){return Object.assign({kind:'graph',dfs:true,mode},base,extra||{});}
function animForDFS(p){
  const L=p.label;
  if(L.indexOf('Flood Fill')===0) return {kind:'grid',dfs:true,mode:'flood',grid:FLOOD_G,trace:T_GFLOOD,hot:H_GFLOOD,title:'flood one region (deep-first)'};
  if(L.indexOf('Number of Islands')===0) return {kind:'grid',dfs:true,mode:'islands',grid:ISL_G,trace:T_GFLOOD,hot:H_GFLOOD,title:'count islands (DFS sink)'};
  if(L.indexOf('Max Area')===0) return {kind:'grid',dfs:true,mode:'area',grid:ISL_G,trace:T_GAREA,hot:H_GAREA,title:'island size = 1 + children'};
  if(L.indexOf('Two-Grid')===0) return {kind:'grid',dfs:true,mode:'twogrid',grid:SUB_G2,g1:SUB_G1,trace:T_GSUB,hot:H_GSUB,title:'sub-islands'};
  if(L.indexOf('8-Directional')>=0) return {kind:'grid',dfs:true,mode:'flood',dirs:8,grid:DIR8F,trace:T_GFLOOD,hot:H_GFLOOD,title:'one X-shaped region via diagonals'};
  if(p.cat==='BOUNDARY') return {kind:'grid',dfs:true,mode:'boundary',grid:BND_G,trace:T_GBND,hot:H_GBND,title:'escape from the border'};
  if(L.indexOf('Basic Graph DFS')===0) return gdfs('dfs',G_GEN,{trace:T_DFS,hot:H_DFS,caption:'dive deep, then backtrack — the call stack is the path'});
  if(L.indexOf('Iterative DFS')===0) return gdfs('dfs',G_GEN,{trace:T_ITER,hot:H_ITER,caption:'same DFS, but YOU hold the stack'});
  if(L.indexOf('Connected Components')===0) return gdfs('components',G_COMP,{trace:T_DCMP,hot:H_DCMP,caption:'one DFS per component'});
  if(L.indexOf('Cycle Detection — Undirected')===0) return gdfs('cycleU',G_GEN,{trace:T_CYU,hot:H_CYU,caption:'visited non-parent neighbour = back-edge = cycle'});
  if(L.indexOf('Cycle Detection — Directed')===0) return gdfs('cycleD',G_DCYC,{trace:T_CYD,hot:H_CYD,caption:'edge into a GRAY (on-stack) node = cycle'});
  if(L.indexOf('Bipartite')===0) return gdfs('bipartite',G_BIP,{trace:T_DBIP,hot:H_DBIP,caption:'colour opposite; same-colour neighbour fails'});
  if(L.indexOf('Topological')>=0) return gdfs('topo',G_DAG,{directed:true,trace:T_DTOPO,hot:H_DTOPO,caption:'finish a node, prepend it — post-order'});
  if(L.indexOf('All Paths')===0) return gdfs('paths',G_DAG,{directed:true,start:0,end:5,trace:T_DPATH,hot:H_DPATH,caption:'push, recurse, pop — record paths that reach the target'});
  return null;
}

/* ===== 3D graph DFS frame generator (call-stack shaped like the queue panel) ===== */
function genGraphDFS(cfg){
  const N=cfg.nodes.length,E=cfg.edges,mode=cfg.mode,directed=!!cfg.directed;
  const adj=Array.from({length:N},()=>[]);
  E.forEach(e=>{adj[e[0]].push(e[1]); if(!directed)adj[e[1]].push(e[0]);});
  const labels=cfg.nodes.map((nd,i)=>nd.label!=null?String(nd.label):String(i));
  const LP=['#00e5ff','#39c0f0','#7c93ff','#bf5af2','#f78fb3','#ff9f0a','#69ff47'];
  const IDLE={c:'#2a3340',ei:0.08},CUR={c:'#ffffff',ei:1.0},STK={c:'#f0a500',ei:0.6},RED={c:'#ff4d5e',ei:0.95},DONE={c:'#2f8fae',ei:0.42};
  const frames=[];
  const state=Array(N).fill('idle'), onstk=Array(N).fill(false), stkE=[];
  const parent=Array(N).fill(-1), color=Array(N).fill(-1), comp=Array(N).fill(-1), order=[];
  let cyc=false, pathsFound=0, curComp=0;
  const topNode=()=>stkE.length?stkE[stkE.length-1].node:-1;
  function nodeArr(red){const t=topNode();return Array.from({length:N},(_,i)=>{
    if(red&&(i===red[0]||i===red[1]))return RED;
    if(i===t)return CUR;
    if(onstk[i])return STK;
    if(state[i]==='done'){
      if(mode==='components')return {c:LP[((comp[i]-1)%LP.length+LP.length)%LP.length],ei:0.42};
      if(mode==='bipartite')return {c:color[i]===0?'#00e5ff':'#ff9f0a',ei:0.5};
      if(mode==='topo'){const oi=order.indexOf(i);return {c:LP[(oi<0?0:oi)%LP.length],ei:0.45};}
      return DONE;
    }
    return IDLE;
  });}
  const eArr=()=>E.map(e=>(state[e[0]]!=='idle'||onstk[e[0]])&&(state[e[1]]!=='idle'||onstk[e[1]]));
  function cnt(){
    if(mode==='components')return `components: ${Math.max(0,...comp)}`;
    if(mode==='topo')return `finished: ${order.map(x=>labels[x]).join(' ')||'—'}`;
    if(mode==='paths')return `paths found: ${pathsFound}`;
    if(mode==='bipartite')return cyc?'bipartite: NO':'bipartite: ok';
    if(mode==='cycleU'||mode==='cycleD')return cyc?'CYCLE found':'scanning…';
    return `visited: ${state.filter(s=>s!=='idle').length}/${N}`;
  }
  function snap(info,phase,red){frames.push({node:nodeArr(red),edge:eArr(),queue:stkE.map(e=>labels[e.node]),info,count:cnt(),phase,edgeRed:red?E.findIndex(e=>(e[0]===red[0]&&e[1]===red[1])||(!directed&&e[0]===red[1]&&e[1]===red[0])):undefined});}
  function enter(u,par){state[u]='stack';onstk[u]=true;parent[u]=par;if(mode==='components')comp[u]=curComp;if(mode==='cycleD')color[u]=1;if(mode==='bipartite'&&color[u]===-1)color[u]=(par<0?0:(color[par]^1));stkE.push({node:u,k:0});}
  function runFrom(s){
    enter(s,-1);
    snap(mode==='paths'?`Start backtracking DFS at ${labels[s]}.`:`Enter ${labels[s]} — push it onto the call stack.`,'seed');
    let guard=0;
    while(stkE.length&&!cyc&&guard++<400){
      const top=stkE[stkE.length-1];
      if(mode==='paths'&&top.node===cfg.end){
        pathsFound++;
        snap(`Reached target ${labels[cfg.end]} → <b>path #${pathsFound}</b>: ${stkE.map(e=>labels[e.node]).join(' → ')}.`,'found');
        onstk[top.node]=false;state[top.node]='done';stkE.pop();
        if(stkE.length)snap(`Backtrack from ${labels[cfg.end]} to look for more paths.`,'back');
        continue;
      }
      let moved=false; const nb=adj[top.node];
      while(top.k<nb.length){
        const v=nb[top.k++];
        if(mode==='cycleU'){
          if(state[v]==='idle'){enter(v,top.node);snap(`Dive ${labels[top.node]} → ${labels[v]}.`,'enter');moved=true;break;}
          else if(v!==parent[top.node]){cyc=true;snap(`${labels[top.node]} → visited non-parent ${labels[v]} → <b>back-edge = CYCLE</b>.`,'cycle',[top.node,v]);moved=true;break;}
        } else if(mode==='cycleD'){
          if(color[v]===1){cyc=true;snap(`${labels[top.node]} → <b>GRAY</b> node ${labels[v]} (still on the stack) → <b>CYCLE</b>.`,'cycle',[top.node,v]);moved=true;break;}
          else if(color[v]!==2){enter(v,top.node);snap(`Dive ${labels[top.node]} → ${labels[v]} (mark GRAY).`,'enter');moved=true;break;}
        } else if(mode==='bipartite'){
          if(color[v]===-1){color[v]=color[top.node]^1;enter(v,top.node);snap(`Colour ${labels[v]} the opposite (${color[v]}).`,'enter');moved=true;break;}
          else if(color[v]===color[top.node]){cyc=true;snap(`${labels[v]} has the SAME colour as ${labels[top.node]} → <b>not bipartite</b>.`,'cycle',[top.node,v]);moved=true;break;}
        } else if(mode==='paths'){
          if(!onstk[v]){enter(v,top.node);snap(`Extend path ${labels[top.node]} → ${labels[v]}.`,'enter');moved=true;break;}
        } else {
          if(state[v]==='idle'){enter(v,top.node);snap(`Dive ${labels[top.node]} → ${labels[v]}.`,'enter');moved=true;break;}
        }
      }
      if(cyc)break;
      if(!moved){
        onstk[top.node]=false;
        if(mode==='cycleD')color[top.node]=2;
        if(mode==='topo')order.push(top.node);
        state[top.node]='done';stkE.pop();
        snap(`No more neighbours — <b>pop ${labels[top.node]}</b> (backtrack).${mode==='topo'?' Added to finish order.':''}`,'back');
      }
    }
  }
  if(mode==='components'){ for(let s=0;s<N;s++) if(state[s]==='idle'){curComp++;runFrom(s);} }
  else if(mode==='topo'){ for(let s=0;s<N;s++) if(state[s]==='idle') runFrom(s); }
  else runFrom(cfg.start||0);
  snap(cyc?`Done — <b>cycle detected</b>.`:(mode==='paths'?`Done — found <b>${pathsFound}</b> path(s) to the target.`:(mode==='topo'?`Done — topological order = reverse finish order: <b>${order.slice().reverse().map(x=>labels[x]).join(' ')}</b>.`:`Done — DFS complete.`)),'done');
  return frames;
}

/* ===== 2D grid DFS (deep-dive + backtrack) with a call-stack panel ===== */
function mountGridDFS(host, cfg, col){
  const g=cfg.grid, m=g.length, n=g[0].length, g1=cfg.g1||null;
  const rd=cfg.dirs===8?DR8:DR, cd=cfg.dirs===8?DC8:DC;
  const inb=(r,c)=>r>=0&&r<m&&c>=0&&c<n;
  const vis=g.map(r=>r.map(_=>0));
  const cs=g.map((row,i)=>row.map((v,j)=> v===0?{cls:'wall'} : (g1&&g1[i][j]===1?{cls:'idle',g1:1}:{cls:'idle'})));
  const frames=[]; const stack=[]; let countText='';
  const clone=()=>cs.map(r=>r.map(c=>({...c})));
  function rec(info,phase){ frames.push({state:clone(), stack:stack.map(e=>`(${e.r},${e.c})`), info, count:countText, phase}); }
  function runComp(sr,sc,color,doneCls){
    const cells=[]; let ok=true;
    vis[sr][sc]=1; stack.push({r:sr,c:sc,k:0}); cells.push([sr,sc]); if(g1&&g1[sr][sc]===0)ok=false;
    cs[sr][sc]={cls:'cur',color}; rec(`Enter (${sr},${sc}) — push onto the call stack.`,'seed');
    while(stack.length){
      const top=stack[stack.length-1]; let moved=false;
      while(top.k<rd.length){
        const d=top.k++, nr=top.r+rd[d], nc=top.c+cd[d];
        if(inb(nr,nc)&&g[nr][nc]===1&&!vis[nr][nc]){
          vis[nr][nc]=1; cells.push([nr,nc]); if(g1&&g1[nr][nc]===0)ok=false;
          cs[top.r][top.c]={cls:'path',color}; cs[nr][nc]={cls:'cur',color};
          stack.push({r:nr,c:nc,k:0});
          if(cfg.mode==='area')countText=`size so far: ${cells.length}`;
          rec(`Dive deeper to (${nr},${nc}).`,'enter'); moved=true; break;
        }
      }
      if(!moved){
        cs[top.r][top.c]={cls:doneCls||'comp',color}; stack.pop();
        if(stack.length){const nt=stack[stack.length-1]; cs[nt.r][nt.c]={cls:'cur',color};}
        rec(`Dead end — backtrack from (${top.r},${top.c}).`,'back');
      }
    }
    return {cells,ok};
  }
  if(cfg.mode==='flood'){
    let sr=-1,sc=-1; for(let i=0;i<m&&sr<0;i++)for(let j=0;j<n;j++)if(g[i][j]===1){sr=i;sc=j;break;}
    runComp(sr,sc,'#00e5ff','comp');
    rec(`Region fully explored (one connected blob).`,'done');
  } else if(cfg.mode==='islands'||cfg.mode==='area'){
    let cnt=0,maxA=0;
    for(let i=0;i<m;i++)for(let j=0;j<n;j++) if(g[i][j]===1&&!vis[i][j]){
      cnt++; const colr=ISLAND_COLORS[(cnt-1)%ISLAND_COLORS.length];
      if(cfg.mode==='islands')countText=`islands: ${cnt}`;
      const {cells}=runComp(i,j,colr,'comp');
      if(cfg.mode==='area'){maxA=Math.max(maxA,cells.length);countText=`max area: ${maxA}`;}
    }
    rec(cfg.mode==='area'?`Done — largest island = <b>${maxA}</b> cells.`:`Done — <b>${cnt}</b> islands.`,'done');
  } else if(cfg.mode==='boundary'){
    let safe=0;
    for(let i=0;i<m;i++)for(let j=0;j<n;j++) if((i===0||i===m-1||j===0||j===n-1)&&g[i][j]===1&&!vis[i][j]){
      const {cells}=runComp(i,j,'#1f8f5f','safe'); safe+=cells.length; countText=`safe: ${safe}`;
    }
    let trapped=0; for(let i=0;i<m;i++)for(let j=0;j<n;j++) if(g[i][j]===1&&!vis[i][j]){cs[i][j]={cls:'trapped'};trapped++;}
    countText=`trapped: ${trapped}`; rec(`Unmarked land can't reach the border → <b>trapped</b> (${trapped} cells).`,'trap');
  } else if(cfg.mode==='twogrid'){
    let sub=0;
    for(let i=0;i<m;i++)for(let j=0;j<n;j++) if(g[i][j]===1&&!vis[i][j]){
      countText=`sub-islands: ${sub}`;
      const {cells,ok}=runComp(i,j,'#00e5ff','comp');
      if(ok)sub++;
      cells.forEach(a=>cs[a[0]][a[1]]={cls:ok?'accept':'reject'});
      countText=`sub-islands: ${sub}`;
      rec(ok?`Whole island sits on grid1 land → <b>sub-island ✓</b>`:`A cell was grid1-water → <b>rejected ✗</b>`,'judge');
    }
    rec(`Done — <b>${sub}</b> sub-islands.`,'done');
  }

  const wrap=document.createElement('div');
  wrap.innerHTML=`<div class="h">◈ DFS DRY-RUN — ${cfg.title||'depth-first'} (dive then backtrack)</div>
    <div class="demowrap">
      <div class="gd" id="gdGrid"></div>
      <div class="demoside">
        <div class="counter" id="gdCount"></div>
        <div class="demoinfo" id="gdInfo"></div>
        <div class="qrow" id="gdQrow"><span class="qlabel">CALL&nbsp;STACK&nbsp;↓</span><span id="gdQ" class="qpills"></span></div>
        <div class="dctrl"><button class="play" id="gdPlay">▶ play</button><button id="gdStep">step ›</button><button id="gdReset">⟲ reset</button></div>
        <div class="hint">deepest cell = top of the stack; backtrack pops it</div>
      </div>
    </div>
    <div class="trace"><div class="th">CODE BEING TRAVERSED — <b>active line highlights live</b></div><pre id="gdTrace"></pre></div>`;
  host.appendChild(wrap);
  const cells=[],gridEl=wrap.querySelector('#gdGrid');
  for(let r=0;r<m;r++){const row=document.createElement('div');row.className='gdrow';cells[r]=[];for(let c=0;c<n;c++){const el=document.createElement('div');el.className='gc';row.appendChild(el);cells[r][c]=el;}gridEl.appendChild(row);}
  const infoEl=wrap.querySelector('#gdInfo'),countEl=wrap.querySelector('#gdCount'),Qel=wrap.querySelector('#gdQ');
  const traceLines=cfg.trace||[],traceEl=wrap.querySelector('#gdTrace'),tEls=[];
  traceLines.forEach(ln=>{const x=document.createElement('span');x.className='tln';x.innerHTML=hl(ln)||'&nbsp;';traceEl.appendChild(x);tEls.push(x);});
  let idx=0,timer=null;
  function draw(){const f=frames[idx];
    for(let r=0;r<m;r++)for(let c=0;c<n;c++){const s=f.state[r][c],el=cells[r][c];el.textContent='';el.style.borderColor='transparent';el.style.transform='';
      if(s.cls==='wall'){el.style.background='#11161d';el.style.color='#2a323d';}
      else if(s.cls==='cur'){el.style.background='#eaf6ff';el.style.color='#06121a';el.style.borderColor='#ffffff';el.style.transform='scale(1.08)';}
      else if(s.cls==='path'){el.style.background='#a87400';el.style.color='#fff4dd';el.style.borderColor='#f0a500';}
      else if(s.cls==='comp'){el.style.background=s.color+'cc';el.style.color='#06121a';el.style.borderColor=s.color;}
      else if(s.cls==='safe'){el.style.background='#1f8f5f';el.style.color='#eafff3';el.style.borderColor='#3ecf8e';}
      else if(s.cls==='trapped'){el.style.background='#3a1f27';el.style.color='#ff8aa0';el.style.borderColor='#ff6b6b';}
      else if(s.cls==='accept'){el.style.background='#1f8f5f';el.style.color='#eafff3';el.style.borderColor='#3ecf8e';}
      else if(s.cls==='reject'){el.style.background='#3a1f27';el.style.color='#ff8aa0';el.style.borderColor='#ff6b6b';}
      else {el.style.background=s.g1?'#16241c':'#1a212b';el.style.color='#3a4452';}
    }
    infoEl.innerHTML=f.info;countEl.textContent=f.count||'';
    Qel.innerHTML=''; const arr=f.stack||[]; if(!arr.length){const s=document.createElement('span');s.className='qp empty';s.textContent='empty';Qel.appendChild(s);} else arr.forEach(t=>{const s=document.createElement('span');s.className='qp';s.textContent=t;Qel.appendChild(s);});
    const hot=(cfg.hot&&cfg.hot[f.phase])||[];tEls.forEach((e,i)=>e.classList.toggle('hot',hot.indexOf(i)>=0));
  }
  function stop(){if(timer){clearInterval(timer);timer=null;}wrap.querySelector('#gdPlay').textContent='▶ play';}
  function play(){if(timer){stop();return;}if(idx>=frames.length-1)idx=0;wrap.querySelector('#gdPlay').textContent='❚❚ pause';timer=setInterval(()=>{if(idx>=frames.length-1){stop();return;}idx++;draw();},620);}
  wrap.querySelector('#gdPlay').onclick=play;
  wrap.querySelector('#gdStep').onclick=()=>{stop();if(idx<frames.length-1){idx++;draw();}};
  wrap.querySelector('#gdReset').onclick=()=>{stop();idx=0;draw();};
  draw();
}

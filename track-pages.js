(function(){
  const A='viewBox="0 0 430 360" fill="none"';
  const tracks={
    dsa:{
      title:'DSA', path:'/dsa/', status:'Live now', accent:'#00e5ff', rgb:'0,229,255',
      docTitle:'Visualise · DSA Roadmap',
      description:'Interactive DSA landing page with live visual pattern hubs for graphs, arrays, DP, trees, heaps, tries, backtracking, greedy, intervals and more.',
      eyebrow:'DSA roadmap · live',
      h1:'Data Structures & <b>Algorithms</b>',
      sub:'The DSA track is live: pattern-first hubs with vector dry-runs, synced code traces, Striver-style C++ and practice links. Pick a topic and go straight into the interactive visualizer.',
      primary:['Start with Graphs','/graphs/'],
      secondary:['All learning tracks','/'],
      visual:`<svg ${A}>
        <path class="stroke" opacity=".45" d="M72 80h110v64h105v76h76"/>
        <path class="stroke" opacity=".35" d="M182 144H92v116h196"/>
        <g class="float"><circle class="soft" cx="72" cy="80" r="30"/><text class="label" x="72" y="76">BFS</text><text class="small" x="72" y="96">GRAPH</text></g>
        <g class="float"><circle class="soft" cx="182" cy="144" r="30"/><text class="label" x="182" y="140">DP</text><text class="small" x="182" y="160">TABLE</text></g>
        <g class="float"><circle class="soft" cx="287" cy="220" r="30"/><text class="label" x="287" y="216">TRIE</text><text class="small" x="287" y="236">PREFIX</text></g>
        <g class="float"><circle class="soft" cx="363" cy="220" r="30"/><text class="label" x="363" y="216">BITS</text><text class="small" x="363" y="236">MASK</text></g>
        <rect class="soft" x="58" y="238" width="70" height="44" rx="12"/><text class="label" x="93" y="262">STACK</text>
        <rect class="soft" x="178" y="238" width="70" height="44" rx="12"/><text class="label" x="213" y="262">HEAP</text>
      </svg>`,
      cards:[
        ['/graphs/','Graphs','BFS, DFS, weighted shortest paths.','0,229,255'],
        ['/arrays/','Arrays & Hashing','Hashing, two pointers, windows, binary search.','0,229,255'],
        ['/arrays/#two-pointers','Two Pointers','Sorted pairs, container, 3Sum.','255,159,10'],
        ['/arrays/#sliding-window','Sliding Window','Fixed and variable windows.','93,255,143'],
        ['/arrays/#binary-search','Binary Search','Classic, rotated, answer search.','191,90,242'],
        ['/stack-queue/','Stack & Queue','Parsing, monotonic stack, queues.','56,189,248'],
        ['/linked-list/','Linked List','Reverse, cycle, middle, palindrome.','255,90,205'],
        ['/trees/','Trees','Traversals, LCA, BST validation.','93,255,143'],
        ['/dp/','Dynamic Programming','1-D, 2-D and grid DP tables.','124,147,255'],
        ['/heap/','Heap / Priority Queue','Heapify, push/pop, top-K.','255,209,102'],
        ['/tries/','Tries','Prefix trees, wildcard DFS, bit trie.','0,229,255'],
        ['/backtracking/','Backtracking','Subsets, permutations, N-Queens.','255,90,205'],
        ['/greedy/','Greedy','Scheduling, jumps, gas station.','93,255,143'],
        ['/intervals/','Intervals','Merge, insert, sweep overlaps.','255,159,10'],
        ['/bit-manipulation/','Bit Manipulation','XOR, masks, set bits.','191,90,242'],
        ['/math-geometry/','Math & Geometry','GCD, sieve, matrices, geometry.','124,147,255']
      ]
    },
    web:{
      title:'Web Development', path:'/web-development/', status:'Building now', accent:'#ff9f0a', rgb:'255,159,10',
      docTitle:'Visualise · Web Development',
      description:'Web development track landing page for frontend, backend, languages, databases, auth, deployment, and project-based backend teaching.',
      eyebrow:'Web development · frontend + backend',
      h1:'Build full-stack <b>web systems</b>.',
      sub:'This track starts from first principles: browser, server, database, APIs, auth and deployment. Frontend and backend get separate paths, then lessons teach through real projects instead of memorized snippets.',
      primary:['Start Backend Lesson','#backend-lesson'], secondary:['Frontend path','#frontend-path'],
      visual:`<svg ${A}>
        <rect class="soft" x="42" y="76" width="112" height="84" rx="16"/><text class="label" x="98" y="106">CLIENT</text><text class="small" x="98" y="126">HTML CSS JS</text>
        <rect class="soft" x="176" y="54" width="112" height="84" rx="16"/><text class="label" x="232" y="84">SERVER</text><text class="small" x="232" y="104">API AUTH</text>
        <rect class="soft" x="292" y="194" width="96" height="76" rx="16"/><text class="label" x="340" y="224">DB</text><text class="small" x="340" y="244">SQL DOCS</text>
        <path class="stroke" d="M154 118h22M232 138v46M288 96c58 10 78 42 62 96M154 134c66 54 126 76 176 72"/>
        <g class="float"><circle class="soft" cx="78" cy="238" r="28"/><text class="small" x="78" y="235">REACT</text><text class="small" x="78" y="250">NEXT</text></g>
        <g class="float"><circle class="soft" cx="216" cy="246" r="28"/><text class="small" x="216" y="243">NODE</text><text class="small" x="216" y="258">JAVA</text></g>
        <text class="small" x="214" y="322">FRONTEND · BACKEND · DATABASE · DEPLOY</text>
      </svg>`,
      frontend:[
        ['HTML','Page structure and semantic meaning.'],
        ['CSS','Layout, responsive UI, motion and visual systems.'],
        ['JavaScript','Browser behavior, events, DOM, async requests.'],
        ['TypeScript','Safer JavaScript for large codebases.'],
        ['React','Component-driven UI and state.'],
        ['Next.js','Routing, server rendering and production app structure.']
      ],
      backend:[
        ['JavaScript / TypeScript','Node.js, Express/Fastify, REST APIs.'],
        ['Python','FastAPI/Django for APIs, data and AI services.'],
        ['Java','Spring Boot for enterprise-grade backend systems.'],
        ['Go','Small, fast services and concurrent systems.'],
        ['SQL','PostgreSQL/MySQL schema, joins and transactions.'],
        ['NoSQL','MongoDB/Redis for document data and caching.']
      ],
      modules:['Internet and HTTP','Frontend foundations','Backend APIs','Databases','Authentication','Deployment'],
      project:'Smart Recommendation Engine'
    },
    aiml:{
      title:'AI / ML', path:'/ai-ml/', status:'Coming soon', accent:'#bf5af2', rgb:'191,90,242',
      docTitle:'Visualise · AI / ML',
      description:'Coming soon AI and ML track landing page for math intuition, model training, evaluation, embeddings and RAG workflows.',
      eyebrow:'AI / ML · coming soon',
      h1:'Make models <b>understandable</b>.',
      sub:'This track will turn ML concepts into diagrams: vectors, loss curves, embeddings, RAG pipelines, evaluation loops and applied model workflows.',
      primary:['Back to portal','/'], secondary:['Open DSA now','/dsa/'],
      visual:`<svg ${A}><path class="stroke" d="M44 255c48-138 98-138 152 0s102 138 156 0"/><path class="stroke" opacity=".45" d="M54 100h300M54 180h300M86 52v250M190 52v250M294 52v250"/><circle class="soft" cx="88" cy="254" r="14"/><circle class="soft" cx="196" cy="120" r="14"/><circle class="soft" cx="352" cy="254" r="14"/><text class="small" x="214" y="322">LOSS · EMBEDDINGS · RAG · EVAL</text></svg>`,
      modules:['Linear algebra intuition','Training loops','Model evaluation','Embeddings','RAG systems','Applied ML projects']
    },
    agents:{
      title:'AI Agents', path:'/ai-agents/', status:'Coming soon', accent:'#5dff8f', rgb:'93,255,143',
      docTitle:'Visualise · AI Agents',
      description:'Coming soon AI agents track landing page for tools, memory, planning loops, agentic workflows and evaluation.',
      eyebrow:'AI agents · coming soon',
      h1:'Design agents that <b>act</b>.',
      sub:'This track will map agent loops step by step: planning, tool calls, memory, browser actions, guardrails, evaluation and deployment patterns.',
      primary:['Back to portal','/'], secondary:['Open DSA now','/dsa/'],
      visual:`<svg ${A}><circle class="soft" cx="94" cy="172" r="36"/><circle class="soft" cx="214" cy="86" r="34"/><circle class="soft" cx="332" cy="172" r="36"/><circle class="soft" cx="214" cy="262" r="34"/><path class="stroke" d="M124 154l62-46M244 108l58 46M308 197l-68 46M188 244l-64-48M130 172h166"/><text class="label" x="94" y="176">PLAN</text><text class="label" x="214" y="90">TOOLS</text><text class="label" x="332" y="176">MEM</text><text class="label" x="214" y="266">EVAL</text></svg>`,
      modules:['Agent loop basics','Tool calling','Memory patterns','Browser workflows','Guardrails','Evaluation harnesses']
    },
    system:{
      title:'System Design', path:'/system-design/', status:'Coming soon', accent:'#7c93ff', rgb:'124,147,255',
      docTitle:'Visualise · System Design',
      description:'Coming soon system design track landing page for scalability, queues, caches, databases and reliability.',
      eyebrow:'System design · coming soon',
      h1:'See architecture <b>tradeoffs</b>.',
      sub:'This track will break large systems into visual components: load balancers, queues, caches, databases, consistency, scaling and reliability.',
      primary:['Back to portal','/'], secondary:['Open DSA now','/dsa/'],
      visual:`<svg ${A}><rect class="soft" x="52" y="74" width="82" height="54" rx="12"/><rect class="soft" x="176" y="48" width="82" height="54" rx="12"/><rect class="soft" x="296" y="74" width="82" height="54" rx="12"/><rect class="soft" x="112" y="216" width="82" height="54" rx="12"/><rect class="soft" x="238" y="216" width="82" height="54" rx="12"/><path class="stroke" d="M134 101h42M258 75h38M217 102v114M153 216l42-114M278 216l-42-114"/><text class="small" x="216" y="324">CACHE · QUEUE · DB · SCALE</text></svg>`,
      modules:['Capacity estimation','Load balancing','Caching','Queues and streams','Databases','Reliability tradeoffs']
    },
    cloud:{
      title:'Cloud & DevOps', path:'/cloud-devops/', status:'Coming soon', accent:'#ffd166', rgb:'255,209,102',
      docTitle:'Visualise · Cloud & DevOps',
      description:'Coming soon cloud and DevOps track landing page for Linux, Docker, CI/CD, observability and deployment workflows.',
      eyebrow:'Cloud & DevOps · coming soon',
      h1:'Ship software <b>cleanly</b>.',
      sub:'This track will connect local code to production: Linux basics, containers, CI/CD, infra, monitoring, logs and deploy-ready workflows.',
      primary:['Back to portal','/'], secondary:['Open DSA now','/dsa/'],
      visual:`<svg ${A}><path class="soft" d="M82 214h154a40 40 0 0 0 6-80 58 58 0 0 0-112-16 48 48 0 0 0-48 96Z"/><rect class="soft" x="280" y="88" width="72" height="48" rx="10"/><rect class="soft" x="280" y="164" width="72" height="48" rx="10"/><path class="stroke" d="M236 174h44M316 136v28M300 104h32M300 180h32M132 174h70M166 140v68"/><text class="small" x="214" y="292">LINUX · DOCKER · CI/CD · OBSERVE</text></svg>`,
      modules:['Linux basics','Docker','CI/CD pipelines','Cloud deploys','Monitoring','Incident workflows']
    }
  };

  const id=document.body.dataset.track;
  const t=tracks[id];
  if(!t) return;
  document.documentElement.style.setProperty('--track',t.accent);
  document.documentElement.style.setProperty('--track-rgb',t.rgb);
  document.title=t.docTitle;
  const desc=document.querySelector('meta[name="description"]');
  if(desc) desc.content=t.description;
  const set=(id,html)=>{const el=document.getElementById(id); if(el) el.innerHTML=html;};
  set('eyebrow',`<span class="pulse"></span>${t.eyebrow}`);
  set('heroTitle',t.h1);
  set('heroSub',t.sub);
  set('visual',t.visual);
  const p=document.getElementById('primaryCta'); if(p){p.href=t.primary[1];p.innerHTML=t.primary[0]+arrow();}
  const s=document.getElementById('secondaryCta'); if(s){s.href=t.secondary[1];s.textContent=t.secondary[0];}
  const status=document.getElementById('statusPill'); if(status) status.textContent=t.status;
  const title=document.getElementById('trackTitle'); if(title) title.textContent=t.title;
  const nav=document.getElementById('navTrack'); if(nav){nav.href=t.path;nav.textContent=t.title;}
  if(id==='dsa') renderDsa(t);
  else if(id==='web') renderWeb(t);
  else renderSoon(t);

  function renderDsa(t){
    set('mainSectionTitle','DSA hubs');
    set('mainSectionCopy','Each hub opens into a detailed interactive visualizer with explanations, vector dry-runs and code traces.');
    const grid=document.getElementById('contentGrid');
    if(grid) grid.innerHTML=`
      <div class="flowBand" style="grid-column:1/-1">
        <div class="flowPanel">
          <h3>How DSA is meant to be learned here</h3>
          <p>Every topic moves from pattern recognition to a dry-run, then to code. The landing page should feel alive because the route is a map, not a flat index.</p>
          <div class="flowSvg">
            <svg viewBox="0 0 720 210" fill="none">
              <rect class="soft" x="34" y="72" width="120" height="58" rx="14"/><text class="label" x="94" y="97">PATTERN</text><text class="small" x="94" y="116">recognize</text>
              <rect class="soft" x="204" y="72" width="120" height="58" rx="14"/><text class="label" x="264" y="97">DRY RUN</text><text class="small" x="264" y="116">visualize</text>
              <rect class="soft" x="374" y="72" width="120" height="58" rx="14"/><text class="label" x="434" y="97">CODE</text><text class="small" x="434" y="116">derive</text>
              <rect class="soft" x="544" y="72" width="120" height="58" rx="14"/><text class="label" x="604" y="97">PRACTICE</text><text class="small" x="604" y="116">repeat</text>
              <path class="stroke" d="M154 101h50M324 101h50M494 101h50"/>
              <circle class="soft flowDot" cx="179" cy="101" r="7"/><circle class="soft flowDot" cx="349" cy="101" r="7"/><circle class="soft flowDot" cx="519" cy="101" r="7"/>
            </svg>
          </div>
        </div>
        <div class="flowPanel">
          <h3>Current live coverage</h3>
          <div class="routeList">
            <div class="routeItem"><i class="dot"></i><div><b>Graphs + weighted graphs</b><br><span>BFS, DFS, Dijkstra, MST</span></div></div>
            <div class="routeItem"><i class="dot"></i><div><b>Core structures</b><br><span>Arrays, stacks, linked lists, trees, heaps</span></div></div>
            <div class="routeItem"><i class="dot"></i><div><b>Advanced patterns</b><br><span>DP, tries, backtracking, greedy, bits</span></div></div>
          </div>
        </div>
      </div>` + t.cards.map(([href,name,copy,a])=>`<a class="card" style="--a:${a}" href="${href}"><b>${name}</b><span>${copy}</span><em class="tag">OPEN HUB</em></a>`).join('');
  }

  function renderWeb(t){
    set('mainSectionTitle','Web Development paths');
    set('mainSectionCopy','Frontend and backend are separate learning lanes. Each lane starts from first principles, then moves into industrial tools and project-based lessons.');
    const grid=document.getElementById('contentGrid');
    if(!grid) return;
    const soon=document.getElementById('soonBox');
    if(soon) soon.style.display='none';
    grid.className='grid';
    grid.innerHTML=`
      <div class="pathGrid" style="grid-column:1/-1">
        <section class="pathCard" id="frontend-path">
          <div class="pathTop"><div><h3>Frontend path</h3><p>The browser side: what users see, click, type and feel.</p></div><span class="pathPill">UI LANE</span></div>
          <div class="flowSvg">
            <svg viewBox="0 0 520 170" fill="none">
              <rect class="soft" x="28" y="52" width="96" height="54" rx="12"/><text class="label" x="76" y="76">HTML</text><text class="small" x="76" y="94">structure</text>
              <rect class="soft" x="154" y="52" width="96" height="54" rx="12"/><text class="label" x="202" y="76">CSS</text><text class="small" x="202" y="94">layout</text>
              <rect class="soft" x="280" y="52" width="96" height="54" rx="12"/><text class="label" x="328" y="76">JS/TS</text><text class="small" x="328" y="94">behavior</text>
              <rect class="soft" x="406" y="52" width="86" height="54" rx="12"/><text class="label" x="449" y="76">REACT</text><text class="small" x="449" y="94">app</text>
              <path class="stroke" d="M124 79h30M250 79h30M376 79h30"/>
            </svg>
          </div>
        </section>
        <section class="pathCard">
          <div class="pathTop"><div><h3>Backend path</h3><p>The server side: APIs, data, authentication, queues and deployment.</p></div><span class="pathPill">SERVER LANE</span></div>
          <div class="flowSvg">
            <svg viewBox="0 0 520 170" fill="none">
              <rect class="soft" x="30" y="54" width="92" height="52" rx="12"/><text class="label" x="76" y="78">CLIENT</text>
              <rect class="soft" x="152" y="54" width="92" height="52" rx="12"/><text class="label" x="198" y="78">API</text>
              <rect class="soft" x="274" y="54" width="92" height="52" rx="12"/><text class="label" x="320" y="78">LOGIC</text>
              <rect class="soft" x="396" y="54" width="92" height="52" rx="12"/><text class="label" x="442" y="78">DB</text>
              <path class="stroke" d="M122 80h30M244 80h30M366 80h30"/>
            </svg>
          </div>
        </section>
      </div>
      <div class="stackGrid" style="grid-column:1/-1">
        ${t.frontend.map(([name,copy])=>`<div class="stackCard"><span class="mono">FRONTEND</span><h3>${name}</h3><p>${copy}</p></div>`).join('')}
        ${t.backend.map(([name,copy])=>`<div class="stackCard"><span class="mono">BACKEND</span><h3>${name}</h3><p>${copy}</p></div>`).join('')}
      </div>
      ${backendLesson(t)}
    `;
  }

  function backendLesson(t){
    return `
      <section class="lesson" id="backend-lesson" style="grid-column:1/-1">
        <div class="lessonHeader">
          <div>
            <h2>Backend Lesson 01: JavaScript API for a ${t.project}</h2>
            <p>Senior mentor mode: derive the backend from the problem, not from memorized Express snippets.</p>
          </div>
          <span class="pathPill">PROJECT-BASED</span>
        </div>
        <div class="lessonGrid">
          <div>
            <section class="lessonSection">
              <h3>1. Big Picture</h3>
              <p>A backend exists because the browser should not own secrets, databases or business rules. For a Smart Recommendation Engine, the frontend sends user context, the backend validates it, reads product data, runs recommendation logic, stores feedback later, and returns clean JSON.</p>
            </section>
            <section class="lessonSection">
              <h3>2. Visualization</h3>
              <pre class="diagram">Browser UI
   │  GET /recommendations?interest=backend
   ▼
Express Server
   │
   ▼
Router
   │
   ▼
Controller
   │
   ▼
Recommendation Service
   │
   ▼
Database / Cache
   │
   ▼
JSON Response</pre>
            </section>
            <section class="lessonSection">
              <h3>3. Real World Analogy</h3>
              <p>Restaurant: the customer does not enter the kitchen. The waiter receives the order, checks it, sends it to the kitchen, and returns the prepared dish. The backend is the waiter plus kitchen workflow.</p>
            </section>
            <section class="lessonSection">
              <h3>4. Thinking Process</h3>
              <ol>
                <li>I need to receive requests from the frontend.</li>
                <li>I should not put all logic in one file.</li>
                <li>I need a route for recommendation requests.</li>
                <li>I need a controller to translate HTTP into application logic.</li>
                <li>I need a service where recommendation thinking lives.</li>
                <li>I need a database later, but first I can use sample data.</li>
              </ol>
            </section>
            <section class="lessonSection">
              <h3>5. English Algorithm</h3>
              <pre class="diagram">Receive request
↓
Read interest
↓
Validate interest exists
↓
Fetch candidate products
↓
Score or filter products
↓
Return top recommendations as JSON</pre>
            </section>
            <section class="lessonSection">
              <h3>6. Code</h3>
              <pre class="codeBlock">import express from "express";

const app = express();
const PORT = 3000;

const products = [
  { id: 1, name: "React Mastery", tags: ["frontend", "react"] },
  { id: 2, name: "Node API Builder", tags: ["backend", "node"] },
  { id: 3, name: "System Design Basics", tags: ["backend", "architecture"] }
];

app.get("/recommendations", (req, res) => {
  const userInterest = req.query.interest;

  if (!userInterest) {
    return res.status(400).json({ error: "interest is required" });
  }

  const recommendations = products.filter(product =>
    product.tags.includes(userInterest)
  );

  return res.json({ recommendations });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});</pre>
              <table class="explainTable">
                <tr><th>Line</th><th>Why it exists</th></tr>
                <tr><td><code>import express</code></td><td>Imports the server library. Raw Node HTTP is lower-level; Express gives clean routing.</td></tr>
                <tr><td><code>app.get</code></td><td>Creates one route: browser asks, backend responds.</td></tr>
                <tr><td><code>req.query</code></td><td>Reads small URL inputs like <code>interest=backend</code>.</td></tr>
                <tr><td><code>res.status(400)</code></td><td>Sends a client-error response when input is missing.</td></tr>
                <tr><td><code>res.json</code></td><td>Returns structured data that frontend code can consume.</td></tr>
              </table>
            </section>
            <section class="lessonSection">
              <h3>7. How Could I Write This Myself?</h3>
              <p>Start from: “When the browser asks for recommendations, I return matching products.” Nouns become data: products, tags, recommendations. Verbs become routes/functions: ask, filter, return. Express only connects HTTP to that thinking.</p>
            </section>
            <section class="lessonSection mistake">
              <h3>8. Common Beginner Mistakes</h3>
              <ul>
                <li>Putting database logic, route logic and scoring logic in one file forever.</li>
                <li>Returning HTML instead of JSON for an API route.</li>
                <li>Not validating query/body inputs.</li>
                <li>Thinking Express is the backend; Express is only the HTTP layer.</li>
                <li>Skipping project thinking and memorizing syntax first.</li>
              </ul>
            </section>
            <section class="lessonSection">
              <h3>9. Interview Questions</h3>
              <ol>
                <li>What is the job of a backend server?</li>
                <li>What is the difference between route, controller and service?</li>
                <li>Why should recommendation scoring not live directly inside a route handler in a large app?</li>
              </ol>
            </section>
            <section class="lessonSection assignment">
              <h3>10. Mini Assignment</h3>
              <p>Add support for <code>GET /recommendations?interest=frontend</code> and return only frontend-related products. Do not add a database yet. First make the in-memory version correct.</p>
            </section>
            <section class="lessonSection">
              <h3>11. If I Get Stuck</h3>
              <ol>
                <li>Hint 1: Where does the request input live?</li>
                <li>Hint 2: Which array method keeps matching items?</li>
                <li>Hint 3: What should happen if interest is missing?</li>
                <li>Answer comes only after you try.</li>
              </ol>
            </section>
            <section class="lessonSection">
              <h3>12. Visual Code Flow</h3>
              <pre class="diagram">GET /recommendations?interest=backend
↓
Route handler
↓
Validate interest
↓
Filter products by tag
↓
Return JSON</pre>
            </section>
          </div>
          <aside class="lessonSide">
            <div class="projectCard">
              <b>Project path: Smart Recommendation Engine</b>
              <p style="margin-top:8px">You will learn backend by gradually turning this endpoint into a real system.</p>
              <div class="projectSteps">
                <span>1. In-memory recommendations</span>
                <span>2. Routes and controllers</span>
                <span>3. PostgreSQL product storage</span>
                <span>4. Authenticated users</span>
                <span>5. Feedback events</span>
                <span>6. Scoring service</span>
                <span>7. Redis cache</span>
                <span>8. Deploy and observe</span>
              </div>
            </div>
            <div class="lessonSection" style="margin-top:12px"><h3>13. Code Rules</h3><ul><li>Modern JavaScript.</li><li>ES Modules.</li><li>Professional names.</li><li>No unnecessary code.</li><li>Explain every new keyword.</li></ul></div>
            <div class="lessonSection" style="margin-top:12px"><h3>14. Response Style</h3><p>Short explanations, direct flow, visual diagrams, and no moving forward until the current concept is clear.</p></div>
            <div class="lessonSection" style="margin-top:12px"><h3>15. First-principles rule</h3><p>Whenever a keyword appears, ask: what problem forced engineers to invent this idea?</p></div>
          </aside>
        </div>
      </section>
    `;
  }

  function renderSoon(t){
    set('mainSectionTitle','Track landing page');
    set('mainSectionCopy','This track is not open yet, but its landing page is ready and the roadmap modules are staged below.');
    const grid=document.getElementById('contentGrid');
    if(grid){
      grid.className='preview';
      grid.innerHTML=t.modules.map((m,i)=>`<div class="card"><b>${m}</b><span>Coming soon module ${String(i+1).padStart(2,'0')} for the ${t.title} track.</span><em class="tag">QUEUED</em></div>`).join('');
    }
    const soon=document.getElementById('soonBox');
    if(soon) soon.innerHTML=`<div><h2>${t.title} is queued</h2><p>The page is in place now, so this track can grow into full lessons later without changing the navigation. DSA remains the active track today.</p></div><div class="miniArt">${t.visual}</div>`;
  }
  function arrow(){return ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';}
})();

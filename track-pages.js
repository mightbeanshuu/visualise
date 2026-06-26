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
      title:'Web Development', path:'/web-development/', status:'Coming soon', accent:'#ff9f0a', rgb:'255,159,10',
      docTitle:'Visualise · Web Development',
      description:'Coming soon web development track landing page for frontend, backend, databases, auth, deployment and production UI workflows.',
      eyebrow:'Web development · coming soon',
      h1:'Build for the <b>web</b>, visually.',
      sub:'This track will cover frontend fundamentals, APIs, databases, authentication, deployment and production UI patterns with the same visual-first approach as DSA.',
      primary:['Back to portal','/'], secondary:['Open DSA now','/dsa/'],
      visual:`<svg ${A}><rect class="soft" x="52" y="62" width="146" height="102" rx="16"/><rect class="soft" x="232" y="70" width="126" height="30" rx="8"/><rect class="soft" x="232" y="118" width="92" height="18" rx="6"/><rect class="soft" x="232" y="150" width="116" height="18" rx="6"/><path class="stroke" d="M75 92h80M75 118h58M75 144h72M198 112h34"/><text class="small" x="124" y="205">HTML · CSS · JS · APIs · DEPLOY</text></svg>`,
      modules:['Frontend foundations','React and state','APIs and backend','Databases and auth','Deployment workflow','Production UI systems']
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
  if(id==='dsa') renderDsa(t); else renderSoon(t);

  function renderDsa(t){
    set('mainSectionTitle','DSA hubs');
    set('mainSectionCopy','Each hub opens into a detailed interactive visualizer with explanations, vector dry-runs and code traces.');
    const grid=document.getElementById('contentGrid');
    if(grid) grid.innerHTML=t.cards.map(([href,name,copy,a])=>`<a class="card" style="--a:${a}" href="${href}"><b>${name}</b><span>${copy}</span><em class="tag">OPEN HUB</em></a>`).join('');
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

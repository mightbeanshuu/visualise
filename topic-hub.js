(function(){
  const SOURCE='Pattern framing · <b>AlgoMaster</b> &nbsp;|&nbsp; Code · <b>Striver / takeUforward style</b>';
  const topicId=document.body.dataset.topic;
  const DATA=window.VX_TOPIC_DATA||{};
  const T=DATA[topicId];
  if(!T) return;

  document.documentElement.style.setProperty('--accent',T.accent);
  document.documentElement.style.setProperty('--accent-rgb',T.rgb);
  document.title=T.pageTitle;
  const meta=document.querySelector('meta[name="description"]');
  if(meta) meta.content=T.description;

  const $=id=>document.getElementById(id);
  let idx=0, step=0, timer=null, allComments=false;

  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function html(s){return String(s==null?'':s);}
  function splitCode(code){
    return code.trim().split('\n').map((line,i)=>`<span class="cl" data-line="${i}">${esc(line)}</span>`).join('');
  }
  function copyText(text){
    if(navigator.clipboard) navigator.clipboard.writeText(text);
  }

  function initStatic(){
    $('badge').textContent=T.badge;
    $('topTitle').textContent=T.title;
    $('topMeta').textContent=`${T.patterns.length} patterns · C++ · visual dry-runs`;
    $('topDesc').innerHTML=T.topDesc;
    $('eyebrow').innerHTML=`<span class="pulse"></span> ${esc(T.eyebrow)}`;
    $('heroTitle').innerHTML=T.heroTitle;
    $('heroSub').innerHTML=T.heroSub;
    $('heroPrimary').textContent=T.primaryCta;
    $('heroGhost').textContent='Watch a dry-run';
    $('featGrid').innerHTML=T.patterns.map((p,i)=>`
      <button class="feat" type="button" data-goto="${i}">
        <span class="k">${esc(p.cat)}</span>
        <span class="t">${esc(p.label)}</span>
        <span class="c">${esc(p.complexity)}</span>
      </button>`).join('');
    $('featGrid').addEventListener('click',e=>{
      const b=e.target.closest('[data-goto]');
      if(!b) return;
      idx=+b.dataset.goto; step=0; render();
      location.hash='tool';
    });
    const cats=[...new Set(T.patterns.map(p=>p.cat))];
    $('side').innerHTML=cats.map(cat=>{
      const ps=T.patterns.map((p,i)=>({p,i})).filter(x=>x.p.cat===cat);
      return `<div class="catlabel">${esc(cat)} <span class="catn">${ps.length}</span></div>`+
        ps.map(({p,i})=>`<div class="navitem" data-i="${i}"><div class="tag">${esc(p.complexity)}</div><div class="nm">${esc(p.label)}</div></div>`).join('');
    }).join('');
    $('side').addEventListener('click',e=>{
      const n=e.target.closest('.navitem');
      if(!n) return;
      idx=+n.dataset.i; step=0; stop(); render();
      if(innerWidth<860) $('side').classList.remove('open');
    });
    $('menuToggle').onclick=()=>$('side').classList.toggle('open');
  }

  function render(){
    stop();
    const p=T.patterns[idx], frames=p.frames||[];
    if(step>=frames.length) step=frames.length-1;
    const f=frames[step]||{};
    document.querySelectorAll('.navitem').forEach(n=>n.classList.toggle('on',+n.dataset.i===idx));
    $('main').innerHTML=`
      <div class="fade">
        <div class="phead">
          <div>
            <span class="ptag">${esc(p.cat)}</span><span class="pcount">${idx+1} / ${T.patterns.length}</span>
            <h2>${esc(p.label)}</h2>
            <div class="srcline">${p.source||SOURCE}</div>
          </div>
          <div class="pheadbtns">
            <button class="copy" id="copyBtn">Copy code</button>
            <button class="copy" id="commentsBtn">${allComments?'Hide notes':'Show notes'}</button>
          </div>
        </div>
        <div class="cards">
          <div class="ic"><div class="h">WHEN TO USE</div><p>${html(p.when)}</p></div>
          <div class="ic"><div class="h">CORE IDEA</div><p>${html(p.insight)}</p></div>
          <div class="ic analogy"><div class="h">MENTAL MODEL</div><p>${html(p.analogy)}</p></div>
          <div class="ic bugs"><div class="h">BUGS TO WATCH</div><ul>${(p.bugs||[]).map(b=>`<li>${html(b)}</li>`).join('')}</ul></div>
        </div>
        <div class="probs"><div class="h">PRACTICE SET</div>${(p.problems||[]).map(q=>`<span class="chip">${esc(q)}</span>`).join('')}</div>
        <div class="split">
          <div class="demo">
            <div class="h">VECTOR DRY-RUN</div>
            <div class="stage">${scene(f)}</div>
            <div class="vmsg">${html(f.msg||'Step through the pattern.')}</div>
            <div class="ctrl">
              <button id="prevStep" ${step===0?'disabled':''}>Prev</button>
              <button class="play" id="playBtn">Play</button>
              <button id="nextStep" ${step===frames.length-1?'disabled':''}>Next</button>
              <span class="pos">${step+1} / ${frames.length}</span>
            </div>
            <div class="trace"><div class="th">TRACE · <b>active line</b></div><pre>${trace(p.trace||[],f.line)}</pre></div>
          </div>
          <div class="cb">
            <div class="cbbar"><span class="dots"><i style="background:#ff5f57"></i><i style="background:#ffbd2e"></i><i style="background:#28c840"></i></span><span class="cbtitle">solution.cpp</span></div>
            <pre id="codeBlock">${splitCode(p.code)}</pre>
          </div>
        </div>
        <div class="pnav">
          <button id="prevPat" ${idx===0?'disabled':''}>← Previous pattern</button>
          <span class="pos">${idx+1} of ${T.patterns.length}</span>
          <button id="nextPat" ${idx===T.patterns.length-1?'disabled':''}>Next pattern →</button>
        </div>
      </div>`;
    markCode(f.line);
    $('copyBtn').onclick=e=>{copyText(p.code);e.currentTarget.textContent='Copied';e.currentTarget.classList.add('done');setTimeout(()=>{e.currentTarget.textContent='Copy code';e.currentTarget.classList.remove('done');},1000);};
    $('commentsBtn').onclick=()=>{allComments=!allComments;render();};
    $('prevStep').onclick=()=>{step=Math.max(0,step-1);render();};
    $('nextStep').onclick=()=>{step=Math.min(frames.length-1,step+1);render();};
    $('playBtn').onclick=play;
    $('prevPat').onclick=()=>{idx=Math.max(0,idx-1);step=0;render();};
    $('nextPat').onclick=()=>{idx=Math.min(T.patterns.length-1,idx+1);step=0;render();};
  }

  function markCode(line){
    document.querySelectorAll('#codeBlock .cl').forEach(el=>el.classList.toggle('hot',+el.dataset.line===line));
  }
  function trace(lines,line){
    return lines.map((l,i)=>`<span class="tln ${i===line?'hot':''}">${esc(l)}</span>`).join('');
  }
  function play(){
    const p=T.patterns[idx], frames=p.frames||[];
    stop();
    timer=setInterval(()=>{
      if(step>=frames.length-1){ stop(); return; }
      step++; render();
    },850);
  }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }

  function scene(f){
    if(f.tree) return treeSvg(f);
    if(f.matrix) return matrixSvg(f);
    return tapeSvg(f);
  }
  function tapeSvg(f){
    const items=f.items||[];
    const n=Math.max(items.length,1), w=Math.max(360,n*62+36), h=150;
    let s=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="pattern state">`;
    items.forEach((it,i)=>{
      const x=28+i*62, y=58, cls=stateClass(f,i);
      s+=`<rect class="vnode ${cls}" x="${x}" y="${y}" width="46" height="38" rx="9"/>`;
      s+=`<text class="vtext" x="${x+23}" y="${y+19}">${esc(it)}</text>`;
      if(f.labels&&f.labels[i]) s+=`<text class="vlabel" x="${x+23}" y="${y+52}">${esc(f.labels[i])}</text>`;
    });
    (f.arrows||[]).forEach(a=>{
      const x=51+a.i*62;
      s+=`<text class="varrow" x="${x}" y="33">${esc(a.t)}</text><path class="vedge hot" d="M${x} 39 L${x} 54"/>`;
    });
    return s+'</svg>';
  }
  function matrixSvg(f){
    const m=f.matrix||[], rows=m.length, cols=(m[0]||[]).length;
    const cell=42,gap=7,w=Math.max(320,cols*cell+(cols-1)*gap+36),h=rows*cell+(rows-1)*gap+42;
    let s=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="matrix state">`;
    m.forEach((row,r)=>row.forEach((v,c)=>{
      const x=18+c*(cell+gap), y=18+r*(cell+gap), k=`${r},${c}`;
      const cls=(f.hot||[]).includes(k)?'hot':(f.done||[]).includes(k)?'done':(f.bad||[]).includes(k)?'bad':'';
      s+=`<rect class="vnode ${cls}" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="8"/>`;
      s+=`<text class="vtext" x="${x+cell/2}" y="${y+cell/2}">${esc(v)}</text>`;
    }));
    return s+'</svg>';
  }
  function treeSvg(f){
    const nodes=f.tree.nodes||[], edges=f.tree.edges||[], w=f.tree.w||520, h=f.tree.h||260;
    let s=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="tree state">`;
    edges.forEach(e=>{
      const a=nodes[e[0]], b=nodes[e[1]];
      s+=`<path class="vedge ${edgeHot(f,e)?'hot':''}" d="M${a.x} ${a.y} L${b.x} ${b.y}"/>`;
    });
    nodes.forEach((n,i)=>{
      const cls=stateClass(f,i);
      s+=`<circle class="vnode ${cls}" cx="${n.x}" cy="${n.y}" r="${n.r||20}"/>`;
      s+=`<text class="vtext" x="${n.x}" y="${n.y}">${esc(n.t)}</text>`;
      if(n.l) s+=`<text class="vlabel" x="${n.x}" y="${n.y+(n.r||20)+17}">${esc(n.l)}</text>`;
    });
    return s+'</svg>';
  }
  function edgeHot(f,e){return (f.edgeHot||[]).some(x=>x[0]===e[0]&&x[1]===e[1]);}
  function stateClass(f,i){
    if((f.hot||[]).includes(i)) return 'hot';
    if((f.done||[]).includes(i)) return 'done';
    if((f.bad||[]).includes(i)) return 'bad';
    return '';
  }

  initStatic();
  render();
})();

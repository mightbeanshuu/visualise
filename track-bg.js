(async function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas=document.getElementById('bgfx');
  if(reduce||!canvas) return;
  try{
    const THREE=await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,100);
    camera.position.z=12;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.setSize(innerWidth,innerHeight,false);
    const COUNT=115, SPREAD=11, LINK=2.65, LINK2=LINK*LINK;
    const positions=new Float32Array(COUNT*3), colors=new Float32Array(COUNT*3), vel=[];
    const palette=[[0,0.9,1],[0.37,1,0.56],[0.49,0.58,1],[1,0.35,0.8],[1,0.82,0.4]];
    for(let i=0;i<COUNT;i++){
      positions[i*3]=(Math.random()-.5)*SPREAD;
      positions[i*3+1]=(Math.random()-.5)*SPREAD*.62;
      positions[i*3+2]=(Math.random()-.5)*SPREAD*.48;
      colors.set(palette[i%palette.length],i*3);
      vel.push((Math.random()-.5)*.006,(Math.random()-.5)*.006,(Math.random()-.5)*.006);
    }
    const nodeGeo=new THREE.BufferGeometry();
    nodeGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    nodeGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const points=new THREE.Points(nodeGeo,new THREE.PointsMaterial({size:.115,vertexColors:true,transparent:true,opacity:.82,depthWrite:false,blending:THREE.AdditiveBlending}));
    const maxLinks=COUNT*7, linePos=new Float32Array(maxLinks*6);
    const lineGeo=new THREE.BufferGeometry();
    lineGeo.setAttribute('position',new THREE.BufferAttribute(linePos,3));
    const lines=new THREE.LineSegments(lineGeo,new THREE.LineBasicMaterial({color:0x7c93ff,transparent:true,opacity:.11,depthWrite:false,blending:THREE.AdditiveBlending}));
    const group=new THREE.Group(); group.add(points); group.add(lines); scene.add(group);
    let mx=0,my=0,run=true;
    addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
    addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)});
    document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run)requestAnimationFrame(loop)});
    function loop(){
      if(!run) return;
      const pos=nodeGeo.attributes.position.array;
      for(let i=0;i<COUNT;i++){
        for(let k=0;k<3;k++){
          const idx=i*3+k; pos[idx]+=vel[idx];
          const lim=k===0?SPREAD/2:k===1?SPREAD*.31:SPREAD*.24;
          if(pos[idx]>lim||pos[idx]<-lim) vel[idx]*=-1;
        }
      }
      nodeGeo.attributes.position.needsUpdate=true;
      let li=0;
      for(let i=0;i<COUNT&&li<maxLinks;i++){
        const ax=pos[i*3],ay=pos[i*3+1],az=pos[i*3+2];
        for(let j=i+1;j<COUNT&&li<maxLinks;j++){
          const dx=ax-pos[j*3],dy=ay-pos[j*3+1],dz=az-pos[j*3+2],d2=dx*dx+dy*dy+dz*dz;
          if(d2<LINK2){
            const o=li*6;
            linePos[o]=ax;linePos[o+1]=ay;linePos[o+2]=az;
            linePos[o+3]=pos[j*3];linePos[o+4]=pos[j*3+1];linePos[o+5]=pos[j*3+2];
            li++;
          }
        }
      }
      lineGeo.setDrawRange(0,li*2);
      lineGeo.attributes.position.needsUpdate=true;
      group.rotation.y+=.0009; group.rotation.x=my*.16;
      camera.position.x+=(mx*1.4-camera.position.x)*.04;
      camera.position.y+=(-my*.9-camera.position.y)*.04;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
      requestAnimationFrame(loop);
    }
    canvas.classList.add('on');
    requestAnimationFrame(loop);
  }catch(e){}
})();

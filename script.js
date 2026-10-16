(()=>{
const rain=document.querySelector('#rain'), c=rain.getContext('2d'), fx=document.querySelector('#fx'), f=fx.getContext('2d');
const word=document.querySelector('#word'), heart=document.querySelector('#heart'), dots=document.querySelector('#heartDots');
let w,h,dpr,fs,cols,ys,raf,particles=[],timers=[];
const chars='01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン♥♡';
const colors=['#ff268b','#ff4e9d','#c51e69','#ff83bb','#f8b9d6'];
function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;[rain,fx].forEach(el=>{el.width=w*dpr;el.height=h*dpr;el.style.width=w+'px';el.style.height=h+'px'});c.setTransform(dpr,0,0,dpr,0,0);f.setTransform(dpr,0,0,dpr,0,0);fs=w<600?13:16;cols=Math.ceil(w/fs);ys=Array.from({length:cols},()=>Math.random()*-80);c.fillStyle='#03040a';c.fillRect(0,0,w,h)}
function matrix(){c.fillStyle='rgba(3,4,10,.105)';c.fillRect(0,0,w,h);c.font='bold '+fs+'px monospace';for(let i=0;i<cols;i++){let y=ys[i]*fs;c.globalAlpha=.35+Math.random()*.65;c.fillStyle=colors[Math.floor(Math.random()*colors.length)];c.fillText(chars[Math.random()*chars.length|0],i*fs,y);c.globalAlpha=1;if(y>h&&Math.random()>.975)ys[i]=Math.random()*-30;ys[i]+=.45+Math.random()*.75}raf=requestAnimationFrame(matrix)}
function burst(x,y,n=100){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,s=Math.random()*3.5+.3;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:40+Math.random()*70,size:2+Math.random()*3,color:Math.random()>.5?'#ff8dbb':'#fff5d7'})}}
function animate(){f.clearRect(0,0,w,h);particles=particles.filter(p=>p.life>0);for(let p of particles){p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy*=.985;p.life--;f.globalAlpha=Math.min(1,p.life/20);f.fillStyle=p.color;f.beginPath();f.arc(p.x,p.y,p.size,0,Math.PI*2);f.fill()}f.globalAlpha=1;requestAnimationFrame(animate)}
function makeHeartDots(){dots.innerHTML='';let count=270;for(let i=0;i<count;i++){let t=Math.PI*2*i/count;let x=16*Math.pow(Math.sin(t),3);let y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));let el=document.createElement('span');el.className='dot';el.textContent=Math.random()>.35?'♥':'·';el.style.left=(50+x*1.43)+'%';el.style.top=(48+y*1.43)+'%';el.style.fontSize=(5+Math.random()*8)+'px';el.style.animationDelay=(Math.random()*2)+'s';dots.appendChild(el)}}
function after(ms,fn){timers.push(setTimeout(fn,ms))}
function play(){timers.forEach(clearTimeout);timers=[];word.className='word';word.textContent='';heart.className='heart-stage';makeHeartDots();
after(800,()=>{word.textContent='2';word.className='word show';burst(w/2,h/2,150)});
after(2600,()=>{word.className='word';burst(w/2,h/2,180)});
[['YOU',3400],['Are',6800],['MY',10100],['Love',13200]].forEach(([txt,t])=>after(t,()=>{word.textContent=txt;word.className='word show';burst(w/2,h/2,190)}));
after(16500,()=>{word.className='word';heart.classList.add('show');burst(w/2,h/2,250)});
}
addEventListener('resize',resize);resize();makeHeartDots();matrix();animate();play();
})();
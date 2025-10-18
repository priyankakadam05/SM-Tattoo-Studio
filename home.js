// Set footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Fade-up animation
const fades = document.querySelectorAll('.fade-up');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('show');
  });
}, {threshold:0.12});
fades.forEach(f => io.observe(f));

// Camera & AR
let stream = null;
const video = document.getElementById('camera-preview');
const overlay = document.getElementById('overlay');
const select = document.getElementById('tattoo-select');

select.addEventListener('change', ()=> {
  overlay.src = select.value;
  overlay.style.display = 'block';
});

async function toggleCamera(){
  if(stream){
    stream.getTracks().forEach(t=>t.stop());
    stream=null; video.srcObject=null;
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    video.srcObject = stream;
    video.play();
    overlay.style.display = 'block';
    makeOverlayDraggable();
  } catch(err){
    alert('Camera access denied or not available.');
    console.error(err);
  }
}
function openAR(){ toggleCamera(); window.location.hash='#ar'; }

// Draggable overlay
function makeOverlayDraggable(){
  let isDown=false, startX, startY, scale=1;
  overlay.addEventListener('pointerdown', e=>{
    isDown=true; overlay.setPointerCapture(e.pointerId);
    startX=e.clientX; startY=e.clientY;
  });
  window.addEventListener('pointermove', e=>{
    if(!isDown) return;
    const dx=e.clientX-startX, dy=e.clientY-startY;

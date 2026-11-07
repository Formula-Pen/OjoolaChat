function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}
function toggleDark(){
  document.body.classList.toggle('dark');
}
function filterChats(){
  let q = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('#chatList .chatCard').forEach(c=>{
    let name = c.getAttribute('data-name');
    c.style.display = name.includes(q) ? 'flex' : 'none';
  });
}
function toggleEmoji(){
  let box = document.getElementById('emojiBox');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}
document.addEventListener('click', function(e){
  if(e.target.parentElement && e.target.parentElement.id === 'emojiBox'){
    document.getElementById('msgInput').value += e.target.innerText;
  }
});
function sendMsg(){
  let input = document.getElementById('msgInput');
  let v = input.value.trim();
  if(!v) return;
  let d = document.createElement('div');
  d.className = 'bubble me';
  d.innerText = v;
  d.ondblclick = function(){ likeMsg(d); };
  document.getElementById('msgs').appendChild(d);
  input.value = '';
  document.getElementById('emojiBox').style.display = 'none';
  let typing = document.getElementById('typing');
  typing.style.display = 'block';
  setTimeout(()=>{
    typing.style.display = 'none';
    let r = document.createElement('div');
    r.className = 'bubble mum';
    r.innerText = 'Okay dear ❤️';
    r.ondblclick = function(){ likeMsg(r); };
    document.getElementById('msgs').appendChild(r);
  },1200);
}
function likeMsg(el){
  if(el.innerText.includes('❤️') && !el.innerText.includes('💙')){
    el.innerText += ' 💙';
  } else {
    el.innerText += ' ❤️';
  }
}
document.getElementById('msgInput').addEventListener('keypress', function(e){
  if(e.key === 'Enter') sendMsg();
});

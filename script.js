const $=s=>document.querySelector(s);
const nav=$('.nav'),menu=$('.menu');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
const sb=$('.search-button'),sp=$('.search'),close=$('.search-close');
sb?.addEventListener('click',()=>{sp.classList.toggle('open');if(sp.classList.contains('open'))$('.search input')?.focus()});
close?.addEventListener('click',()=>sp.classList.remove('open'));
let big=false;$('#text-size')?.addEventListener('click',e=>{big=!big;document.documentElement.style.setProperty('--base',big?'21px':'19px');e.currentTarget.textContent=big?'A−':'A+'});
const toast=$('.toast');function notify(t){if(!toast)return;toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',async()=>{const title=b.dataset.title||document.title,url=location.href;if(navigator.share){try{await navigator.share({title,text:title,url})}catch(e){}}else{await navigator.clipboard?.writeText(title+'\n'+url);notify('لینک مطلب کپی شد.')}}));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const target=$(b.dataset.copy);if(target){await navigator.clipboard?.writeText(target.value||target.textContent);notify('متن کپی شد.')}}));
const title=$('#post-title'),lead=$('#post-lead'),body=$('#post-body'),out=$('#social-output');
function makePack(){if(!out)return;const t=title?.value||'عنوان مطلب';const l=lead?.value||'خلاصه کوتاه مطلب';out.textContent=`نسخه تلگرام:\n${t}\n\n${l}\n\nمطالعه کامل در کافه بازنشستگی:\n${location.origin}\n\nکپشن اینستاگرام:\n${t}\n\n${l}\n\n#کافه_بازنشستگی #بازنشستگی #زندگی\n\nمتن ایکس:\n${t} — ${l.slice(0,180)}\n\nنسخه شبکه‌های اجتماعی داخلی:\n${t}\n${l}`;}
['post-title','post-lead','post-body'].forEach(id=>$('#'+id)?.addEventListener('input',makePack));makePack();

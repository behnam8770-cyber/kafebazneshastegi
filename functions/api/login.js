import {json,makeSession,sessionCookie} from "./_auth.js";
export async function onRequestPost({request,env}){
  const body=await request.json().catch(()=>({}));
  if(!env.ADMIN_PASSWORD||!env.SESSION_SECRET)return json({error:"تنظیمات امنیتی مدیر در Cloudflare کامل نشده است."},500);
  if(body.password!==env.ADMIN_PASSWORD)return json({error:"رمز عبور نادرست است."},401);
  const token=await makeSession(env.SESSION_SECRET);
  return json({ok:true},200,{"set-cookie":sessionCookie(token)});
}
export async function onRequestGet({request,env}){return json({authenticated:await import("./_auth.js").then(m=>m.validSession(request,env.SESSION_SECRET||""))});}

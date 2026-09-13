const COOKIE = "kb_session";
function b64u(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
async function hmac(secret, data){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return crypto.subtle.sign("HMAC",key,new TextEncoder().encode(data));
}
export async function makeSession(secret){
  const exp=Date.now()+1000*60*60*24*7;
  const payload=String(exp);
  const sig=b64u(await hmac(secret,payload));
  return `${payload}.${sig}`;
}
export async function validSession(request,secret){
  if(!secret)return false;
  const c=request.headers.get("Cookie")||"";
  const m=c.match(new RegExp(`${COOKIE}=([^;]+)`));
  if(!m)return false;
  const [exp,sig]=m[1].split(".");
  if(!exp||!sig||Number(exp)<Date.now())return false;
  const expected=b64u(await hmac(secret,exp));
  return sig===expected;
}
export function sessionCookie(value){return `${COOKIE}=${value}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`}
export function clearCookie(){return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`}
export function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8",...extra}})}
export function slugify(s){return String(s||"").trim().toLowerCase().replace(/[^\u0600-\u06FF\u200C\w\s-]/g,"").replace(/[\s_]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").slice(0,120)||`post-${Date.now()}`}
export async function init(db){
  await db.prepare(`CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL DEFAULT 'خبر',excerpt TEXT NOT NULL DEFAULT '',body TEXT NOT NULL DEFAULT '',image_url TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',published_at TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status,published_at DESC)`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)`).run();
}

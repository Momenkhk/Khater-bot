const express = require('express');
const store = require('../database/fileStore');

const SECTIONS = ['General', 'Anti Nuke', 'Beast Mode', 'Anti Raid', 'Verification', 'Moderation', 'Whitelist', 'Logs', 'Anti Spam'];

function deepMerge(base, patch) {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = deepMerge(out[k] || {}, v);
    else out[k] = v;
  }
  return out;
}

module.exports = function startDashboard(client, port) {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(`<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Khater Security Dashboard</title>
<style>
:root{--bg:#070f2a;--card:#111f4f;--card2:#0f1738;--txt:#e7ecff;--muted:#a7b1d6;--accent:#3f73ff}
*{box-sizing:border-box} body{margin:0;background:linear-gradient(160deg,#050b1f,#09143a 60%,#061033);color:var(--txt);font-family:Inter,Arial}
.wrap{max-width:1150px;margin:0 auto;padding:18px}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.title{font-size:38px;font-weight:800;letter-spacing:1px}
.small{color:var(--muted)}
.menu{display:grid;grid-template-columns:repeat(3,minmax(150px,1fr));gap:10px;margin:16px 0 24px}
.tab{background:#0f1a42;border:1px solid #1f356d;color:#c9d4ff;border-radius:14px;padding:14px 16px;text-align:center;cursor:pointer;font-weight:700}
.tab.active{outline:2px solid var(--accent);background:#15265e;color:#fff}
.panel{display:none}.panel.active{display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.card{background:var(--card);border:1px solid #254089;border-radius:16px;padding:14px}
.card h3{margin:0 0 10px}
label{display:block;margin:8px 0;color:#d4ddff}
input,select{width:100%;background:var(--card2);color:#fff;border:1px solid #2a4486;border-radius:10px;padding:10px}
button{background:var(--accent);color:white;border:0;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:700}
.row{display:flex;gap:8px;align-items:center}.row input[type='checkbox']{width:auto}
.command{display:flex;justify-content:space-between;align-items:center;background:#0f1a42;border:1px solid #243d81;border-radius:12px;padding:10px;margin:8px 0}
.command .meta{font-size:12px;color:var(--muted)}
</style></head><body><div class="wrap">
  <div class="top"><div><div class="small">You are managing</div><div class="title" id="guildName">SERVER</div></div><div class="small">Dashboard v2</div></div>
  <div><label>Guild ID</label><input id="guildId" placeholder="أدخل معرف السيرفر"/></div>
  <div class="menu" id="tabs">${SECTIONS.map((s,i)=>`<div class='tab ${i===0?'active':''}' data-tab='${s.replace(/ /g,'_')}'>${s}</div>`).join('')}</div>

  <section class="panel active" id="General"><h2>General</h2><div class="grid">
    <div class="card"><h3>إعدادات عامة</h3><label>البادئة</label><input id="prefix" value="$"/><label>أقصى منشن</label><input id="maxMentions" type="number" value="5"/><button onclick="saveGeneral()">حفظ</button></div>
    <div class="card"><h3>حالة الأنظمة</h3><div id="statusText" class="small">-</div></div>
  </div></section>

  <section class="panel" id="Anti_Nuke"><h2>Anti Nuke</h2><div class="grid" id="antiNukeCards"></div><button onclick="saveAntiNuke()">حفظ Anti Nuke</button></section>
  <section class="panel" id="Beast_Mode"><h2>Beast Mode</h2><div class="card"><div class="row"><input id="beastEnabled" type="checkbox"/><label>تفعيل Beast Mode</label></div><button onclick="saveBeast()">حفظ</button></div></section>
  <section class="panel" id="Anti_Raid"><h2>Anti Raid</h2><div class="card"><div class="row"><input id="antiRaidEnabled" type="checkbox"/><label>تفعيل Anti Raid</label></div><label>حد الانضمام السريع</label><input id="massJoinLimit" type="number" value="10"/><button onclick="saveRaid()">حفظ</button></div></section>
  <section class="panel" id="Verification"><h2>Verification</h2><div class="card"><div class="row"><input id="verifyEnabled" type="checkbox"/><label>تفعيل التحقق</label></div><label>نوع التحقق</label><select id="verifyType"><option value="button">Button</option><option value="captcha">Captcha</option></select><button onclick="saveVerification()">حفظ</button></div></section>
  <section class="panel" id="Moderation"><h2>Moderation Commands</h2><div id="commandsList"></div><button onclick="saveCommands()">حفظ حالة الأوامر</button></section>
  <section class="panel" id="Whitelist"><h2>Whitelist</h2><div class="card"><label>إضافة ID</label><input id="wlAdd"/><button onclick="wlAdd()">إضافة</button><label>حذف ID</label><input id="wlRemove"/><button onclick="wlRemove()">حذف</button><div id="wlList" class="small"></div></div></section>
  <section class="panel" id="Logs"><h2>Logs</h2><div class="card"><label>قناة message-logs</label><input id="messageLogs"/><label>قناة security-logs</label><input id="securityLogs"/><button onclick="saveLogs()">حفظ</button></div></section>
  <section class="panel" id="Anti_Spam"><h2>Anti Spam</h2><div class="card"><div class="row"><input id="antiSpamEnabled" type="checkbox"/><label>تفعيل مكافحة السبام</label></div><label>Limit</label><input id="spamLimit" type="number" value="6"/><label>Punishment</label><select id="spamPunishment"><option>timeout</option><option>kick</option><option>ban</option></select><button onclick="saveSpam()">حفظ</button></div></section>
</div>
<script>
const NUKES=['antiChannelDelete','antiChannelCreate','antiChannelRename','antiRoleCreate','antiRoleDelete','antiRoleRename','antiEmojiDelete','antiEmojiRename','antiServerRename','antiServerIconChange','antiVanityChange'];
const tabs=document.querySelectorAll('.tab');
for(const t of tabs){t.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(t.dataset.tab.replace(/_/g,'_')).classList.add('active')}}
function gid(){return document.getElementById('guildId').value.trim()}
async function api(path,method='GET',body){const r=await fetch(path,{method,headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined});return r.json()}
function cmdCatalog(){return ${JSON.stringify([])}}
NUKES.forEach(function(k){const d=document.createElement('div');d.className='card';d.innerHTML="<h3>"+k+"</h3><div class='row'><input id='"+k+"_en' type='checkbox'/><label>Enable</label></div><label>Limit</label><input id='"+k+"_limit' type='number' value='3'/><label>Punishment</label><select id='"+k+"_pun'><option>ban</option><option>kick</option><option>remove_roles</option><option>timeout</option></select>";document.getElementById('antiNukeCards').appendChild(d)});
async function load(){if(!gid())return;const sec=await api('/api/security/'+gid());const set=await api('/api/settings/'+gid());const wl=await api('/api/whitelist/'+gid());const logs=await api('/api/logs/'+gid());
 document.getElementById('beastEnabled').checked=!!sec.beastMode?.enabled;document.getElementById('antiRaidEnabled').checked=!!sec.antiRaid?.enabled;document.getElementById('massJoinLimit').value=sec.antiRaid?.massJoinLimit||10;document.getElementById('verifyEnabled').checked=!!sec.verification?.enabled;document.getElementById('verifyType').value=sec.verification?.type||'button';document.getElementById('antiSpamEnabled').checked=!!sec.antiSpam?.enabled;document.getElementById('spamLimit').value=sec.antiSpam?.limit||6;document.getElementById('spamPunishment').value=sec.antiSpam?.punishment||'timeout';document.getElementById('prefix').value=set.prefix||'$';document.getElementById('maxMentions').value=(sec.maxMentions||5);
 for(const k of NUKES){const v=sec[k]||{};document.getElementById(k+'_en').checked=!!v.enabled;document.getElementById(k+'_limit').value=v.limit||3;document.getElementById(k+'_pun').value=v.punishment||'ban';}
 document.getElementById('wlList').innerText=(wl.users||[]).join('\n')||'فارغ';
 document.getElementById('messageLogs').value=logs.channels?.['message-logs']||'';document.getElementById('securityLogs').value=logs.channels?.['security-logs']||'';
 const cat=await api('/api/commands');const holder=document.getElementById('commandsList');holder.innerHTML='';for(const c of cat.commands){const en=set.commands?.[c.name]?.enabled!==false;holder.innerHTML+="<div class='command'><div><b>/"+c.name+"</b><div class='meta'>"+(c.category||'عام')+"</div></div><div class='row'><input data-cmd='"+c.name+"' type='checkbox' "+(en?'checked':'')+"></div></div>"}
 document.getElementById('statusText').innerText='الأنظمة المفعلة: '+Object.values(sec).filter(v=>v&&v.enabled).length;
}
async function saveGeneral(){await api('/api/settings/'+gid(),'POST',{prefix:document.getElementById('prefix').value,commands:{}});await api('/api/security/'+gid(),'POST',{maxMentions:Number(document.getElementById('maxMentions').value)});alert('تم الحفظ')}
async function saveAntiNuke(){const p={};for(const k of NUKES){p[k]={enabled:document.getElementById(k+'_en').checked,limit:Number(document.getElementById(k+'_limit').value),punishment:document.getElementById(k+'_pun').value}}await api('/api/security/'+gid(),'POST',p);alert('تم الحفظ')}
async function saveBeast(){await api('/api/security/'+gid(),'POST',{beastMode:{enabled:document.getElementById('beastEnabled').checked}});alert('تم الحفظ')}
async function saveRaid(){await api('/api/security/'+gid(),'POST',{antiRaid:{enabled:document.getElementById('antiRaidEnabled').checked,massJoinLimit:Number(document.getElementById('massJoinLimit').value)}});alert('تم الحفظ')}
async function saveVerification(){await api('/api/security/'+gid(),'POST',{verification:{enabled:document.getElementById('verifyEnabled').checked,type:document.getElementById('verifyType').value}});alert('تم الحفظ')}
async function saveSpam(){await api('/api/security/'+gid(),'POST',{antiSpam:{enabled:document.getElementById('antiSpamEnabled').checked,limit:Number(document.getElementById('spamLimit').value),punishment:document.getElementById('spamPunishment').value}});alert('تم الحفظ')}
async function saveCommands(){const checks=[...document.querySelectorAll('[data-cmd]')];const commands={};checks.forEach(c=>commands[c.dataset.cmd]={enabled:c.checked});await api('/api/settings/'+gid(),'POST',{commands});alert('تم حفظ الأوامر')}
async function wlAdd(){const w=await api('/api/whitelist/'+gid());const users=[...(w.users||[])];if(wlAdd.value&&!users.includes(wlAdd.value))users.push(wlAdd.value);await api('/api/whitelist/'+gid(),'POST',{users});await load()}
async function wlRemove(){const w=await api('/api/whitelist/'+gid());const users=(w.users||[]).filter(x=>x!==wlRemove.value);await api('/api/whitelist/'+gid(),'POST',{users});await load()}
async function saveLogs(){const l=await api('/api/logs/'+gid());l.channels=l.channels||{};l.channels['message-logs']=messageLogs.value;l.channels['security-logs']=securityLogs.value;await api('/api/logs/'+gid(),'POST',l);alert('تم الحفظ')}
document.getElementById('guildId').addEventListener('change',load);
</script></body></html>`);
  });

  app.get('/api/commands', (req, res) => {
    const commands = [...client.prefixCommands.values()].map((c) => ({
      name: c.name,
      category: c.category || 'general'
    }));
    res.json({ commands });
  });

  app.get('/api/security/:guildId', (req, res) => res.json(store.get('security', req.params.guildId)));
  app.post('/api/security/:guildId', (req, res) => {
    const current = store.get('security', req.params.guildId);
    const next = deepMerge(current, req.body);
    store.set('security', req.params.guildId, next);
    res.json({ ok: true, data: next });
  });

  app.get('/api/settings/:guildId', (req, res) => res.json(store.get('settings', req.params.guildId)));
  app.post('/api/settings/:guildId', (req, res) => {
    const current = store.get('settings', req.params.guildId);
    const next = deepMerge(current, req.body);
    store.set('settings', req.params.guildId, next);
    res.json({ ok: true, data: next });
  });

  app.get('/api/whitelist/:guildId', (req, res) => res.json(store.get('whitelist', req.params.guildId)));
  app.post('/api/whitelist/:guildId', (req, res) => {
    const current = store.get('whitelist', req.params.guildId);
    const next = deepMerge(current, req.body);
    store.set('whitelist', req.params.guildId, next);
    res.json({ ok: true, data: next });
  });

  app.get('/api/logs/:guildId', (req, res) => res.json(store.get('logs', req.params.guildId)));
  app.post('/api/logs/:guildId', (req, res) => {
    const current = store.get('logs', req.params.guildId);
    const next = deepMerge(current, req.body);
    store.set('logs', req.params.guildId, next);
    res.json({ ok: true, data: next });
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`[DASHBOARD] running on :${port}`);
  });

  return app;
};

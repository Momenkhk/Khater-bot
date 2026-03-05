const express = require('express');
const store = require('../database/fileStore');
const commandDocs = require('../../utils/commandDocs');

const ANTI_NUKE_KEYS = ['antiChannelDelete', 'antiChannelCreate', 'antiRoleDelete', 'antiRoleCreate', 'antiServerRename'];
const ANTI_RAID_KEYS = ['massJoin', 'mentionSpam', 'linkSpam', 'messageSpam'];

function deepMerge(base, patch) {
  const out = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}

module.exports = function startDashboard(client, port) {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    const antiNukeCards = ANTI_NUKE_KEYS.map((k) => `<div class="card"><h3>${k}</h3><label>Enable</label><input id="${k}_enabled" type="checkbox"/><label>Limit</label><input id="${k}_limit" type="number" value="3"/><label>Punishment</label><select id="${k}_pun"><option>ban</option><option>kick</option><option>timeout</option><option>remove_roles</option></select></div>`).join('');
    const antiRaidCards = ANTI_RAID_KEYS.map((k) => `<div class="card"><h3>${k}</h3><label>Enable</label><input id="${k}_enabled" type="checkbox"/><label>Limit</label><input id="${k}_limit" type="number" value="6"/><label>Punishment</label><select id="${k}_pun"><option>timeout</option><option>kick</option><option>ban</option></select></div>`).join('');

    res.type('html').send(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Khater Dashboard</title>
<style>
:root{--bg:#101322;--panel:#181d33;--panel2:#202743;--line:#2b335a;--txt:#eef2ff;--muted:#b6bfdc;--accent:#4f78ff;--btn:#343a54}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font-family:Arial}.wrap{max-width:1280px;margin:0 auto;padding:16px}
.section{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px;margin-top:14px}.section h2{margin:0 0 10px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.card{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:10px}
.command{display:grid;grid-template-columns:auto auto 1fr;gap:10px;align-items:center;background:#131a37;border:1px solid #2d3766;border-radius:12px;padding:12px;margin:10px 0}
.command-info{text-align:right}.command-name{font-size:20px;font-weight:700}.command-desc{font-size:13px;color:var(--muted);margin-top:6px}
.edit-panel{display:none;background:#191f3c;border:1px solid #39457a;border-radius:10px;padding:10px;margin-top:10px}
input,select{width:100%;background:#0f1430;color:#fff;border:1px solid #364070;border-radius:10px;padding:9px}
button{background:var(--accent);color:#fff;border:0;border-radius:10px;padding:9px 12px;cursor:pointer}.btn-subtle{background:var(--btn)}
.toggle{appearance:none;width:52px;height:30px;border-radius:20px;background:#3a3f61;position:relative;cursor:pointer}.toggle:checked{background:#4f78ff}.toggle:before{content:'';position:absolute;top:3px;right:3px;width:24px;height:24px;background:#fff;border-radius:50%}.toggle:checked:before{right:25px}
.notice{padding:8px 10px;border-radius:8px;margin:8px 0;background:#1f2a52;color:#d9e1ff}
</style></head><body><div class="wrap">
<h1>Khater Security Dashboard</h1>
<div class="notice" id="notice">جاهز. أدخل Guild ID ثم اضغط تحميل.</div>
<div style="display:grid;grid-template-columns:1fr 180px;gap:8px"><input id="guildId" placeholder="Guild ID"/><button id="loadBtn">تحميل</button></div>

<section class="section"><h2>الإعدادات العامة</h2><div class="grid"><div class="card"><label>Prefix</label><input id="prefix" value="$"/><label>maxMentions</label><input id="maxMentions" type="number" value="5"/><button id="saveGeneral">حفظ عام</button></div><div class="card"><div id="status"></div></div></div></section>

<section class="section"><h2>الأوامر</h2><div id="commandList"></div><button id="saveCommands">حفظ كل الأوامر</button></section>

<section class="section"><h2>Anti Nuke</h2><div class="grid">${antiNukeCards}</div><button id="saveNuke">حفظ Anti Nuke</button></section>

<section class="section"><h2>Anti Raid</h2><div class="grid">${antiRaidCards}</div><button id="saveRaid">حفظ Anti Raid</button></section>

<section class="section"><h2>Whitelist</h2><div class="card"><label>إضافة ID</label><input id="wlAdd"/><label>حذف ID</label><input id="wlRemove"/><div style="display:flex;gap:8px;margin-top:8px"><button id="wlAddBtn">إضافة</button><button id="wlRemoveBtn" class="btn-subtle">حذف</button></div><pre id="wlView"></pre></div></section>

<section class="section"><h2>Logs</h2><div class="card"><label>message-logs</label><input id="messageLogs"/><label>security-logs</label><input id="securityLogs"/><button id="saveLogs">حفظ اللوج</button></div></section>

<script>
const NUKE_KEYS = ${JSON.stringify(ANTI_NUKE_KEYS)};
const RAID_KEYS = ${JSON.stringify(ANTI_RAID_KEYS)};
const COMMAND_DOCS = ${JSON.stringify(commandDocs)};
let settings={}, security={}, whitelist={}, logs={}, commands=[];
let guildId='';
const $=(id)=>document.getElementById(id);
const notice=(t)=>$('notice').textContent=t;
async function api(path,method='GET',body){const r=await fetch(path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});if(!r.ok) throw new Error(await r.text());return r.json();}

function normalizeCommandConfig(name){settings.commands=settings.commands||{};settings.commands[name]=Object.assign({enabled:true,aliases:[]},settings.commands[name]||{});return settings.commands[name];}

function renderCommands(){
  const wrap=$('commandList');
  wrap.innerHTML='';
  commands.forEach((c)=>{
    const cfg=normalizeCommandConfig(c.name);
    const docs=COMMAND_DOCS[c.name]||{};
    const row=document.createElement('div');
    row.className='command';
    row.innerHTML='\
      <input class="toggle" type="checkbox" data-cmd="'+c.name+'" '+(cfg.enabled!==false?'checked':'')+'/>\
      <button class="btn-subtle" data-edit="'+c.name+'">تعديل</button>\
      <div class="command-info">\
        <div class="command-name">/'+c.name+'</div>\
        <div class="command-desc">'+(docs.description||'بدون وصف حالياً')+'</div>\
        <div class="edit-panel" id="edit_'+c.name+'">\
          <label>الاختصارات (Alias)</label>\
          <input id="alias_'+c.name+'" value="'+(cfg.aliases||[]).join(', ')+'"/>\
          <div style="display:flex;gap:8px;margin-top:8px">\
            <button data-save-alias="'+c.name+'">حفظ التعديلات</button>\
            <button class="btn-subtle" data-close-edit="'+c.name+'">إغلاق</button>\
          </div>\
        </div>\
      </div>';
    wrap.appendChild(row);
  });

  document.querySelectorAll('[data-edit]').forEach((btn)=>{
    btn.onclick=()=>{const panel=$('edit_'+btn.dataset.edit);panel.style.display=panel.style.display==='block'?'none':'block';};
  });

  document.querySelectorAll('[data-close-edit]').forEach((btn)=>{btn.onclick=()=>{$('edit_'+btn.dataset.closeEdit).style.display='none';};});

  document.querySelectorAll('[data-save-alias]').forEach((btn)=>{
    btn.onclick=()=>{
      const name=btn.dataset.saveAlias;
      const val=$('alias_'+name).value;
      normalizeCommandConfig(name).aliases=val.split(',').map((x)=>x.trim()).filter(Boolean);
      notice('تم تحديث اختصارات /'+name+' (اضغط حفظ كل الأوامر)');
    };
  });
}

async function loadGuild(){guildId=$('guildId').value.trim();if(!guildId){notice('أدخل Guild ID');return;}try{[security,settings,whitelist,logs]=await Promise.all([api('/api/security/'+guildId),api('/api/settings/'+guildId),api('/api/whitelist/'+guildId),api('/api/logs/'+guildId)]);commands=(await api('/api/commands')).commands||[];$('prefix').value=settings.prefix||'$';$('maxMentions').value=security.maxMentions||5;$('wlView').textContent=(whitelist.users||[]).join('\n')||'فارغ';$('messageLogs').value=(logs.channels||{})['message-logs']||'';$('securityLogs').value=(logs.channels||{})['security-logs']||'';for(const k of NUKE_KEYS){const v=security[k]||{};$(k+'_enabled').checked=!!v.enabled;$(k+'_limit').value=v.limit||3;$(k+'_pun').value=v.punishment||'ban';}for(const k of RAID_KEYS){const v=security[k]||{};$(k+'_enabled').checked=!!v.enabled;$(k+'_limit').value=v.limit||6;$(k+'_pun').value=v.punishment||'timeout';}renderCommands();$('status').textContent='تم تحميل '+commands.length+' أمر.';notice('تم تحميل البيانات بنجاح');}catch(e){notice('فشل التحميل: '+e.message);}}

$('loadBtn').onclick=loadGuild;$('guildId').addEventListener('keydown',(e)=>{if(e.key==='Enter')loadGuild();});
$('saveGeneral').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');try{settings=await api('/api/settings/'+guildId,'POST',{prefix:$('prefix').value.trim()||'$'});security=await api('/api/security/'+guildId,'POST',{maxMentions:Number($('maxMentions').value||5)});notice('تم حفظ الإعدادات العامة');}catch(e){notice('خطأ: '+e.message)}};
$('saveNuke').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');const patch={};for(const k of NUKE_KEYS){patch[k]={enabled:$(k+'_enabled').checked,limit:Number($(k+'_limit').value||3),punishment:$(k+'_pun').value}};try{security=await api('/api/security/'+guildId,'POST',patch);notice('تم حفظ Anti Nuke');}catch(e){notice('خطأ: '+e.message)}};
$('saveRaid').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');const patch={};for(const k of RAID_KEYS){patch[k]={enabled:$(k+'_enabled').checked,limit:Number($(k+'_limit').value||6),punishment:$(k+'_pun').value}};try{security=await api('/api/security/'+guildId,'POST',patch);notice('تم حفظ Anti Raid');}catch(e){notice('خطأ: '+e.message)}};
$('saveCommands').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');settings.commands=settings.commands||{};document.querySelectorAll('[data-cmd]').forEach(i=>{const n=i.dataset.cmd;settings.commands[n]=Object.assign({enabled:true,aliases:[]},settings.commands[n]||{}, {enabled:i.checked});});try{settings=await api('/api/settings/'+guildId,'POST',{commands:settings.commands});notice('تم حفظ الأوامر بنجاح');}catch(e){notice('خطأ: '+e.message)}};
$('wlAddBtn').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');const id=$('wlAdd').value.trim();if(!id)return;const users=Array.from(new Set([...(whitelist.users||[]),id]));try{whitelist=await api('/api/whitelist/'+guildId,'POST',{users});$('wlView').textContent=users.join('\n');notice('تمت الإضافة');}catch(e){notice('خطأ: '+e.message)}};
$('wlRemoveBtn').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');const id=$('wlRemove').value.trim();if(!id)return;const users=(whitelist.users||[]).filter(x=>x!==id);try{whitelist=await api('/api/whitelist/'+guildId,'POST',{users});$('wlView').textContent=users.join('\n')||'فارغ';notice('تم الحذف');}catch(e){notice('خطأ: '+e.message)}};
$('saveLogs').onclick=async()=>{if(!guildId) return notice('حمّل السيرفر أولاً');const channels=Object.assign({},logs.channels||{}, {'message-logs':$('messageLogs').value.trim(),'security-logs':$('securityLogs').value.trim()});try{logs=await api('/api/logs/'+guildId,'POST',{channels});notice('تم حفظ اللوج');}catch(e){notice('خطأ: '+e.message)}};
</script>
</div></body></html>`);
  });

  app.get('/api/commands', (req, res) => {
    const commands = [...client.prefixCommands.values()].map((c) => ({ name: c.name, category: c.category || 'general' }));
    res.json({ commands });
  });

  app.get('/api/security/:guildId', (req, res) => res.json(store.get('security', req.params.guildId)));
  app.post('/api/security/:guildId', (req, res) => {
    const next = deepMerge(store.get('security', req.params.guildId), req.body);
    store.set('security', req.params.guildId, next);
    res.json(next);
  });

  app.get('/api/settings/:guildId', (req, res) => {
    const s = store.get('settings', req.params.guildId);
    if (!s.commands) s.commands = {};
    res.json(s);
  });
  app.post('/api/settings/:guildId', (req, res) => {
    const next = deepMerge(store.get('settings', req.params.guildId), req.body);
    if (!next.commands) next.commands = {};
    store.set('settings', req.params.guildId, next);
    res.json(next);
  });

  app.get('/api/whitelist/:guildId', (req, res) => res.json(store.get('whitelist', req.params.guildId)));
  app.post('/api/whitelist/:guildId', (req, res) => {
    const next = deepMerge(store.get('whitelist', req.params.guildId), req.body);
    if (!Array.isArray(next.users)) next.users = [];
    store.set('whitelist', req.params.guildId, next);
    res.json(next);
  });

  app.get('/api/logs/:guildId', (req, res) => res.json(store.get('logs', req.params.guildId)));
  app.post('/api/logs/:guildId', (req, res) => {
    const next = deepMerge(store.get('logs', req.params.guildId), req.body);
    store.set('logs', req.params.guildId, next);
    res.json(next);
  });

  app.listen(port, '0.0.0.0', () => console.log(`[DASHBOARD] running on :${port}`));
  return app;
};

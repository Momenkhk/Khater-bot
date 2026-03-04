const express = require('express');
const store = require('../database/fileStore');

const SECTIONS = [
  'نظرة عامة',
  'الإشراف',
  'مكافحة الغزو',
  'الحماية الخاصة',
  'القائمة البيضاء',
  'السجلات',
  'الرد التلقائي',
  'التذاكر'
];

function deepMerge(base, patch) {
  const out = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}

function getDefaultCommandConfig() {
  return {
    enabled: true,
    aliases: [],
    disabledRoles: [],
    deleteInvoker: false,
    deleteBotReplyAfterSec: 0
  };
}

module.exports = function startDashboard(client, port) {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    const sectionTabs = SECTIONS.map((s, i) => `<button class="tab ${i === 0 ? 'active' : ''}" data-target="sec-${i}">${s}</button>`).join('');

    res.type('html').send(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Khater Dashboard</title>
<style>
:root{--bg:#101322;--panel:#181d33;--panel2:#202743;--line:#2b335a;--txt:#eef2ff;--muted:#adb6d5;--accent:#4f78ff;--ok:#3ed68c}
*{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--txt);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
.wrapper{max-width:1280px;margin:0 auto;padding:16px}
.header{display:flex;justify-content:space-between;gap:12px;align-items:center}
.h-title{font-size:30px;font-weight:800}.muted{color:var(--muted)}
.layout{display:grid;grid-template-columns:260px 1fr;gap:16px;margin-top:16px}
.sidebar{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:12px;position:sticky;top:10px;height:fit-content}
.tab{display:block;width:100%;text-align:right;padding:12px;border-radius:12px;border:1px solid var(--line);background:#141a2f;color:#d8e0ff;cursor:pointer;margin-bottom:8px}
.tab.active{outline:2px solid var(--accent);background:#1b2550}
.main{display:flex;flex-direction:column;gap:16px}
.section{display:none;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px}
.section.active{display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.card{background:var(--panel2);border:1px solid var(--line);border-radius:14px;padding:12px}
.card h3{margin:0 0 10px;font-size:18px}
label{display:block;font-size:13px;color:#cdd6f6;margin:8px 0 4px}
input,select{width:100%;background:#0f1430;color:#fff;border:1px solid #364070;border-radius:10px;padding:9px}
button.primary{background:var(--accent);color:#fff;border:0;border-radius:10px;padding:9px 12px;cursor:pointer;font-weight:700}
button.secondary{background:#2a3156;color:#fff;border:1px solid #3b4478;border-radius:10px;padding:8px 10px;cursor:pointer}
.command-item{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;background:#131a37;border:1px solid #2d3766;border-radius:12px;padding:10px;margin-bottom:8px}
.badge{font-size:12px;color:var(--ok)}
.toggle{appearance:none;width:46px;height:26px;border-radius:20px;background:#3a3f61;position:relative;cursor:pointer}
.toggle:checked{background:#4f78ff}.toggle:before{content:'';position:absolute;top:3px;right:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:all .2s}.toggle:checked:before{right:23px}
.modal{position:fixed;inset:0;background:#0008;display:none;align-items:center;justify-content:center;padding:12px}
.modal.open{display:flex}.modal-card{width:min(640px,100%);background:#151b34;border:1px solid #33407a;border-radius:14px;padding:14px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:900px){.layout{grid-template-columns:1fr}}
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div>
        <div class="muted">لوحة التحكم</div>
        <div class="h-title">Khater Security Dashboard</div>
      </div>
      <div style="min-width:280px">
        <label>Guild ID</label>
        <input id="guildId" placeholder="أدخل معرف السيرفر" />
      </div>
    </div>

    <div class="layout">
      <aside class="sidebar">${sectionTabs}</aside>

      <main class="main">
        <section class="section active" id="sec-0">
          <h2>نظرة عامة</h2>
          <div class="grid">
            <div class="card">
              <h3>إعدادات السيرفر</h3>
              <label>البادئة</label><input id="prefix" value="$" />
              <label>أقصى منشن</label><input id="maxMentions" type="number" value="5" />
              <button class="primary" id="saveGeneral">حفظ</button>
            </div>
            <div class="card">
              <h3>الحالة</h3>
              <div id="statusText" class="muted">اختر Guild ID لتحميل البيانات.</div>
            </div>
          </div>
        </section>

        <section class="section" id="sec-1">
          <h2>الإشراف (الأوامر)</h2>
          <div id="commandsList"></div>
          <button class="primary" id="saveCommands">حفظ حالة الأوامر</button>
        </section>

        <section class="section" id="sec-2">
          <h2>مكافحة الغزو</h2>
          <div class="grid" id="antiRaidCards"></div>
          <button class="primary" id="saveRaid">حفظ إعدادات مكافحة الغزو</button>
        </section>

        <section class="section" id="sec-3">
          <h2>الحماية الخاصة (Anti Nuke + Beast)</h2>
          <div class="grid" id="antiNukeCards"></div>
          <div class="card"><h3>Beast Mode</h3><label><input id="beastEnabled" type="checkbox" /> تفعيل</label></div>
          <button class="primary" id="saveSecurity">حفظ إعدادات الحماية</button>
        </section>

        <section class="section" id="sec-4">
          <h2>القائمة البيضاء</h2>
          <div class="card">
            <div class="row">
              <div><label>إضافة ID</label><input id="wlAdd" /></div>
              <div><label>حذف ID</label><input id="wlRemove" /></div>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px">
              <button class="secondary" id="btnWlAdd">إضافة</button>
              <button class="secondary" id="btnWlRemove">حذف</button>
            </div>
            <pre id="wlList" class="muted"></pre>
          </div>
        </section>

        <section class="section" id="sec-5">
          <h2>السجلات</h2>
          <div class="card">
            <label>message-logs</label><input id="messageLogs" />
            <label>security-logs</label><input id="securityLogs" />
            <button class="primary" id="saveLogs">حفظ</button>
          </div>
        </section>

        <section class="section" id="sec-6">
          <h2>الرد التلقائي</h2>
          <div class="card"><p class="muted">استخدم /autoresponse-panel داخل الديسكورد للإدارة التفاعلية.</p></div>
        </section>

        <section class="section" id="sec-7">
          <h2>التذاكر</h2>
          <div class="card"><p class="muted">استخدم /ticket-builder أو /ticketpanel لإنشاء بنل التذاكر.</p></div>
        </section>
      </main>
    </div>
  </div>

  <div class="modal" id="commandModal">
    <div class="modal-card">
      <h3 id="modalTitle">تحرير الأمر</h3>
      <label>اختصارات الأمر (مفصولة بفاصلة)</label>
      <input id="modalAliases" placeholder="مثال: حظر,باند" />
      <label>الأدوار المعطلة (Role IDs بفاصلة)</label>
      <input id="modalRoles" placeholder="123,456" />
      <div class="row">
        <div>
          <label>حذف رسالة المستخدم تلقائيًا</label>
          <select id="modalDeleteInvoker"><option value="false">لا</option><option value="true">نعم</option></select>
        </div>
        <div>
          <label>حذف رد البوت بعد (ثواني)</label>
          <input id="modalDeleteBotAfter" type="number" min="0" value="0" />
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="primary" id="modalSave">حفظ</button>
        <button class="secondary" id="modalCancel">إلغاء</button>
      </div>
    </div>
  </div>

<script>
const antiNukeKeys = ['antiChannelDelete','antiChannelCreate','antiChannelRename','antiRoleCreate','antiRoleDelete','antiRoleRename','antiEmojiDelete','antiEmojiRename','antiServerRename','antiServerIconChange','antiVanityChange'];
const antiRaidKeys = ['massJoin','mentionSpam','linkSpam','messageSpam'];
let currentSettings = {}; let currentSecurity = {}; let currentWhitelist = {}; let currentLogs = {}; let commandCatalog = [];
let editingCommand = null;

function $(id){ return document.getElementById(id); }
function gid(){ return $('guildId').value.trim(); }

async function api(path, method='GET', body){
  const res = await fetch(path,{method,headers:{'Content-Type':'application/json'},body: body ? JSON.stringify(body): undefined});
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

function activateTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelector('.tab[data-target="'+id+'"]').classList.add('active');
  $(id).classList.add('active');
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.target)));

function renderAntiNuke(){
  const holder = $('antiNukeCards'); holder.innerHTML='';
  for(const k of antiNukeKeys){
    const v = currentSecurity[k] || {enabled:false, limit:3, punishment:'ban'};
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = '<h3>'+k+'</h3>'+
      '<label>Enable</label><input id="'+k+'_enabled" type="checkbox" '+(v.enabled?'checked':'')+' />'+
      '<label>Limit</label><input id="'+k+'_limit" type="number" value="'+(v.limit||3)+'" />'+
      '<label>Punishment</label><select id="'+k+'_pun">'+
        '<option value="ban" '+(v.punishment==='ban'?'selected':'')+'>ban</option>'+
        '<option value="kick" '+(v.punishment==='kick'?'selected':'')+'>kick</option>'+
        '<option value="remove_roles" '+(v.punishment==='remove_roles'?'selected':'')+'>remove_roles</option>'+
        '<option value="timeout" '+(v.punishment==='timeout'?'selected':'')+'>timeout</option>'+
      '</select>';
    holder.appendChild(div);
  }
  $('beastEnabled').checked = !!(currentSecurity.beastMode && currentSecurity.beastMode.enabled);
}

function renderAntiRaid(){
  const holder = $('antiRaidCards'); holder.innerHTML='';
  for(const k of antiRaidKeys){
    const v = currentSecurity[k] || {enabled:false, limit:6, punishment:'timeout'};
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = '<h3>'+k+'</h3>'+
      '<label>Enable</label><input id="'+k+'_enabled" type="checkbox" '+(v.enabled?'checked':'')+' />'+
      '<label>Limit</label><input id="'+k+'_limit" type="number" value="'+(v.limit||6)+'" />'+
      '<label>Punishment</label><select id="'+k+'_pun">'+
      '<option value="timeout" '+(v.punishment==='timeout'?'selected':'')+'>timeout</option>'+
      '<option value="kick" '+(v.punishment==='kick'?'selected':'')+'>kick</option>'+
      '<option value="ban" '+(v.punishment==='ban'?'selected':'')+'>ban</option></select>';
    holder.appendChild(div);
  }
}

function renderCommands(){
  const holder = $('commandsList'); holder.innerHTML='';
  const commandsState = currentSettings.commands || {};
  for(const cmd of commandCatalog){
    const cfg = Object.assign({enabled:true}, commandsState[cmd.name] || {});
    const row = document.createElement('div');
    row.className='command-item';
    row.innerHTML = '<div><b>/'+cmd.name+'</b><div class="muted">'+(cmd.category||'general')+'</div></div>'+
      '<input class="toggle" type="checkbox" data-cmd-toggle="'+cmd.name+'" '+(cfg.enabled?'checked':'')+' />'+
      '<button class="secondary" data-cmd-edit="'+cmd.name+'">تعديل</button>';
    holder.appendChild(row);
  }
  document.querySelectorAll('[data-cmd-edit]').forEach(btn=>btn.addEventListener('click',()=>openCommandModal(btn.dataset.cmdEdit)));
}

function openCommandModal(commandName){
  editingCommand = commandName;
  const cfg = Object.assign({enabled:true,aliases:[],disabledRoles:[],deleteInvoker:false,deleteBotReplyAfterSec:0}, (currentSettings.commands||{})[commandName]||{});
  $('modalTitle').textContent = 'تعديل /'+commandName;
  $('modalAliases').value = (cfg.aliases||[]).join(',');
  $('modalRoles').value = (cfg.disabledRoles||[]).join(',');
  $('modalDeleteInvoker').value = String(!!cfg.deleteInvoker);
  $('modalDeleteBotAfter').value = Number(cfg.deleteBotReplyAfterSec||0);
  $('commandModal').classList.add('open');
}

function closeModal(){ $('commandModal').classList.remove('open'); editingCommand=null; }

$('modalCancel').addEventListener('click', closeModal);
$('modalSave').addEventListener('click', async ()=>{
  if(!gid() || !editingCommand) return;
  const commands = Object.assign({}, currentSettings.commands || {});
  const cfg = Object.assign({enabled:true}, commands[editingCommand] || {});
  cfg.aliases = $('modalAliases').value.split(',').map(x=>x.trim()).filter(Boolean);
  cfg.disabledRoles = $('modalRoles').value.split(',').map(x=>x.trim()).filter(Boolean);
  cfg.deleteInvoker = $('modalDeleteInvoker').value === 'true';
  cfg.deleteBotReplyAfterSec = Number($('modalDeleteBotAfter').value || 0);
  commands[editingCommand] = cfg;
  currentSettings = await api('/api/settings/'+gid(), 'POST', { commands });
  renderCommands();
  closeModal();
  alert('تم حفظ إعدادات الأمر.');
});

async function loadAll(){
  if(!gid()) return;
  try{
    [currentSecurity, currentSettings, currentWhitelist, currentLogs] = await Promise.all([
      api('/api/security/'+gid()),
      api('/api/settings/'+gid()),
      api('/api/whitelist/'+gid()),
      api('/api/logs/'+gid())
    ]);
    const cat = await api('/api/commands'); commandCatalog = cat.commands || [];

    $('prefix').value = currentSettings.prefix || '$';
    $('maxMentions').value = Number(currentSecurity.maxMentions || 5);
    $('wlList').textContent = (currentWhitelist.users||[]).join('\n') || 'فارغ';
    $('messageLogs').value = currentLogs.channels?.['message-logs'] || '';
    $('securityLogs').value = currentLogs.channels?.['security-logs'] || '';

    renderAntiNuke();
    renderAntiRaid();
    renderCommands();

    const enabledCount = commandCatalog.filter(c => (currentSettings.commands?.[c.name]?.enabled !== false)).length;
    $('statusText').textContent = 'الأوامر المفعلة: '+enabledCount+' / '+commandCatalog.length;
  }catch(e){
    alert('فشل التحميل: '+e.message);
  }
}

$('guildId').addEventListener('change', loadAll);

$('saveGeneral').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  currentSettings = await api('/api/settings/'+gid(), 'POST', { prefix: $('prefix').value.trim() || '$' });
  currentSecurity = await api('/api/security/'+gid(), 'POST', { maxMentions: Number($('maxMentions').value || 5) });
  alert('تم حفظ الإعدادات العامة');
});

$('saveSecurity').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  const patch = { beastMode: { enabled: $('beastEnabled').checked } };
  for(const k of antiNukeKeys){
    patch[k] = {
      enabled: $(k+'_enabled').checked,
      limit: Number($(k+'_limit').value || 3),
      punishment: $(k+'_pun').value
    };
  }
  currentSecurity = await api('/api/security/'+gid(), 'POST', patch);
  alert('تم حفظ إعدادات الحماية الخاصة');
});

$('saveRaid').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  const patch = {};
  for(const k of antiRaidKeys){
    patch[k] = {
      enabled: $(k+'_enabled').checked,
      limit: Number($(k+'_limit').value || 6),
      punishment: $(k+'_pun').value
    };
  }
  currentSecurity = await api('/api/security/'+gid(), 'POST', patch);
  alert('تم حفظ إعدادات مكافحة الغزو');
});

$('saveCommands').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  const commands = Object.assign({}, currentSettings.commands || {});
  document.querySelectorAll('[data-cmd-toggle]').forEach(toggle=>{
    const name = toggle.dataset.cmdToggle;
    commands[name] = Object.assign({enabled:true,aliases:[],disabledRoles:[],deleteInvoker:false,deleteBotReplyAfterSec:0}, commands[name] || {}, { enabled: toggle.checked });
  });
  currentSettings = await api('/api/settings/'+gid(), 'POST', { commands });
  alert('تم حفظ حالة الأوامر');
});

$('btnWlAdd').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  const id = $('wlAdd').value.trim(); if(!id) return;
  const users = Array.from(new Set([...(currentWhitelist.users || []), id]));
  currentWhitelist = await api('/api/whitelist/'+gid(), 'POST', { users });
  $('wlList').textContent = users.join('\n');
});

$('btnWlRemove').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  const id = $('wlRemove').value.trim(); if(!id) return;
  const users = (currentWhitelist.users || []).filter(x=>x!==id);
  currentWhitelist = await api('/api/whitelist/'+gid(), 'POST', { users });
  $('wlList').textContent = users.join('\n') || 'فارغ';
});

$('saveLogs').addEventListener('click', async ()=>{
  if(!gid()) return alert('أدخل Guild ID أولاً');
  const channels = Object.assign({}, currentLogs.channels || {}, {
    'message-logs': $('messageLogs').value.trim(),
    'security-logs': $('securityLogs').value.trim()
  });
  currentLogs = await api('/api/logs/'+gid(), 'POST', { channels });
  alert('تم حفظ السجلات');
});
</script>
</body>
</html>`);
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
    res.json(next);
  });

  app.get('/api/settings/:guildId', (req, res) => {
    const current = store.get('settings', req.params.guildId);
    if (!current.commands) current.commands = {};
    res.json(current);
  });
  app.post('/api/settings/:guildId', (req, res) => {
    const current = store.get('settings', req.params.guildId);
    const next = deepMerge(current, req.body);
    if (!next.commands) next.commands = {};
    store.set('settings', req.params.guildId, next);
    res.json(next);
  });

  app.get('/api/whitelist/:guildId', (req, res) => res.json(store.get('whitelist', req.params.guildId)));
  app.post('/api/whitelist/:guildId', (req, res) => {
    const current = store.get('whitelist', req.params.guildId);
    const next = deepMerge(current, req.body);
    if (!Array.isArray(next.users)) next.users = [];
    store.set('whitelist', req.params.guildId, next);
    res.json(next);
  });

  app.get('/api/logs/:guildId', (req, res) => res.json(store.get('logs', req.params.guildId)));
  app.post('/api/logs/:guildId', (req, res) => {
    const current = store.get('logs', req.params.guildId);
    const next = deepMerge(current, req.body);
    store.set('logs', req.params.guildId, next);
    res.json(next);
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`[DASHBOARD] running on :${port}`);
  });

  return app;
};

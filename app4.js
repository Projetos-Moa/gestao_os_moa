/* =========================================================
   DASHBOARD
   ========================================================= */
function semaphore(pct){if(pct>=100)return 'sema-blue';if(pct>=70)return 'sema-yellow';return 'sema-red'}

async function renderDashboard(){
  const all=await idbGetAll();
  const committed=all.filter(r=>r.status!=='DRAFT' && r.status!=='ENCAMINHADO');
  const encaminhados=all.filter(r=>r.status==='ENCAMINHADO');
  const avancos=committed.filter(r=>r.data.type==='AVANCO');
  const rncs=committed.filter(r=>r.data.type==='RNC');

  const bannerEl=document.getElementById('draftBanner');
  if(pendingDraft){
    const minsAgo=Math.max(0,Math.round((Date.now()-new Date(pendingDraft.updatedAt).getTime())/60000));
    bannerEl.innerHTML=`
      <div class="fechamento-cta" onclick="resumeDraft()">
        <div class="fc-icon">📝</div>
        <div class="fc-text"><div class="fc-title">Rascunho em andamento</div><div class="fc-sub">${esc(pendingDraft.data.front||'Frente não definida')} · atualizado há ${minsAgo} min · toque para continuar</div></div>
        <div class="fc-actions"><button class="btn danger" onclick="event.stopPropagation();discardDraft()">Descartar</button></div>
      </div>`;
  }else{bannerEl.innerHTML=''}

  const encWrap=document.getElementById('dashEncaminhados');
  encWrap.innerHTML=encaminhados.length===0?'<div class="empty-note">Nenhum registro encaminhado no momento.</div>':
    encaminhados.map(r=>`
      <div class="lanc-item">
        <div class="li-main"><b>📤 ${esc(r.data.front||'—')} — ${r.data.type==='RNC'?'RNC':'Avanço'}</b><small>${esc(r.data.responsible||'—')} · ${r.data.date||'—'} · ${fmtDateTime(r.updatedAt)}</small></div>
        <div style="display:flex;gap:8px;align-items:center"><span class="status-badge ENCAMINHADO">Encaminhado</span><button class="btn primary" style="min-height:38px;padding:0 14px;font-size:12px" onclick="continueEncaminhado('${r.id}')">▶ Continuar</button></div>
      </div>`).join('');

  const realizado={};
  avancos.forEach(r=>{
    const fcod=frenteCodFromLabel(r.data.front);
    if(!fcod)return;
    realizado[fcod]=realizado[fcod]||{};
    r.data.items.forEach(it=>{realizado[fcod][it.discCod]=(realizado[fcod][it.discCod]||0)+itemQt(it)});
  });
  const frentesComDados=Object.keys(realizado);
  let pctSamples=[];
  const rncAbertas=rncs.filter(r=>{const s=r.data.rnc.status||'ABERTA';return s!=='FECHADA'&&s!=='CANCELADA'}).length;
  const lastActivity=committed.length?committed.reduce((a,b)=>a.updatedAt>b.updatedAt?a:b):null;

  const frentesWrap=document.getElementById('dashFrentes');
  if(frentesComDados.length===0){
    frentesWrap.innerHTML='<div class="empty-note">Nenhum lançamento de avanço registrado ainda.</div>';
  }else{
    frentesWrap.innerHTML=frentesComDados.map(fcod=>{
      const f=frenteByCod(fcod);
      const discMap=realizado[fcod];
      const rows=Object.keys(discMap).map(discCod=>{
        const disc=discByCod(discCod)||{nome:discCod,und:''};
        const real=discMap[discCod];
        const metaObj=CADASTRO.metas.find(m=>m.frenteCod===fcod&&m.discCod===discCod);
        const meta=metaObj?metaObj.meta:0;
        const pct=meta?Math.min(real/meta*100,999):null;
        if(pct!==null)pctSamples.push(Math.min(pct,100));
        const barCls=pct===null?'':(pct>=100?'full':pct>=70?'warn':'danger');
        return `<div class="disc-row"><div class="dr-top"><span class="dr-name">${meta?'<span class="sema-dot '+semaphore(pct)+'"></span>':'<span class="sema-dot sema-grey"></span>'}${esc(disc.nome)}</span><span class="dr-nums">${fmtNum(real)} ${esc(disc.und)}${meta?' / meta '+fmtNum(meta)+' ('+fmtNum(pct)+'%)':' · meta não cadastrada'}</span></div>${meta?`<div class="progress"><div class="bar ${barCls}" style="width:${Math.min(pct,100)}%"></div></div>`:''}</div>`;
      }).join('');
      return `<div class="frente-group"><div class="fg-name">${esc(f?frenteLabel(f):fcod)}</div>${rows}</div>`;
    }).join('');
  }
  const globalPct=pctSamples.length?pctSamples.reduce((a,b)=>a+b,0)/pctSamples.length:null;

  document.getElementById('dashKpis').innerHTML=`
    <div class="kpi-card" style="--kpi-accent:var(--navy)"><div class="kl">Registros de avanço</div><div class="kv">${avancos.length}</div><div class="ks">lançamentos diários</div></div>
    <div class="kpi-card" style="--kpi-accent:var(--info-blue)"><div class="kl">Encaminhados</div><div class="kv">${encaminhados.length}</div><div class="ks">aguardando campo</div></div>
    <div class="kpi-card" style="--kpi-accent:var(--red)"><div class="kl">RNCs abertas</div><div class="kv">${rncAbertas}<span>/ ${rncs.length}</span></div><div class="ks">não conformidades</div></div>
    <div class="kpi-card" style="--kpi-accent:var(--green-dark)"><div class="kl">% Avanço médio (c/ meta)</div><div class="kv">${globalPct===null?'—':fmtNum(globalPct)+'%'}</div><div class="ks">${globalPct===null?'cadastre metas para calcular':'média das linhas com meta'}</div></div>
    <div class="kpi-card" style="--kpi-accent:var(--text-dim)"><div class="kl">Última atividade</div><div class="kv" style="font-size:18px">${lastActivity?fmtDateTime(lastActivity.updatedAt):'—'}</div><div class="ks">${lastActivity?esc(lastActivity.data.responsible||''):'nenhum lançamento ainda'}</div></div>`;

  const statusCounts={};
  CADASTRO.rncStatus.forEach(s=>statusCounts[s.cod]=0);
  rncs.forEach(r=>{const st=r.data.rnc.status||'ABERTA';statusCounts[st]=(statusCounts[st]||0)+1});
  document.getElementById('dashRncStatus').innerHTML=rncs.length===0?'<div class="empty-note">Nenhuma RNC registrada.</div>':
    CADASTRO.rncStatus.map(s=>`<div class="rnc-stat"><span class="rnc-badge ${s.cod}">${esc(s.nome)}</span><b>${statusCounts[s.cod]||0}</b></div>`).join('');

  const classCounts={};
  CADASTRO.rncClass.forEach(c=>classCounts[c.cod]=0);
  rncs.forEach(r=>{const c=r.data.rnc.classificacao;if(c)classCounts[c]=(classCounts[c]||0)+1});
  document.getElementById('dashRncClass').innerHTML=rncs.length===0?'<div class="empty-note">Nenhuma RNC registrada.</div>':
    CADASTRO.rncClass.map(c=>`<div class="rnc-stat"><span class="rnc-badge ${c.cod}">${esc(c.nome)}</span><b>${classCounts[c.cod]||0}</b></div>`).join('');

  const recent=committed.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,6);
  const recentWrap=document.getElementById('dashRecent');
  recentWrap.innerHTML=recent.length===0?'<div class="empty-note">Nenhum lançamento ainda — use "＋ Novo registro" para começar.</div>':
    recent.map(r=>{
      const line=lancLine(r);
      return `<div class="lanc-item"><div class="li-main"><b>${line.icon} ${line.title}</b><small>${esc(r.data.responsible||'—')} · ${r.data.date||'—'} · ${fmtDateTime(r.updatedAt)}</small></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${line.badges}<span class="status-badge ${r.status}">${statusLabel(r.status)}</span></div></div>`;
    }).join('');
}

/* =========================================================
   CADASTRO — administração das listas (layout em sidebar)
   ========================================================= */
const CAD_DEFS={
  responsaveis:{label:'Responsáveis',fields:[{key:'cod',label:'Código',ph:'R05'},{key:'nome',label:'Nome completo',ph:'Ex.: Marcos Silva'}]},
  frentes:{label:'Frentes de obra',fields:[{key:'cod',label:'Código',ph:'FO08'},{key:'nome',label:'Frente',ph:'Ex.: Área X'}]},
  turnos:{label:'Turnos',fields:[{key:'cod',label:'Código',ph:'T4'},{key:'nome',label:'Turno',ph:'Ex.: Turno C — 05h às 07h'}]},
  disciplinas:{label:'Descrição montagem',fields:[
    {key:'cod',label:'Código',ph:'MEC-X'},{key:'nome',label:'Descrição',ph:'Ex.: Montagem X'},{key:'und',label:'Unidade',ph:'unt.'},
    {key:'detalhamento',label:'Detalhamento',type:'select',options:[['none','Nenhum'],['juntas','Acoplamento / Solda'],['tags','Lista de tags']]},
    {key:'dnAplica',label:'Aplica DN?',type:'checkbox'}
  ]},
  diametros:{label:'Diâmetros (Ø)',fields:[{key:'cod',label:'Diâmetro',ph:'DN25'}]},
  folhas:{label:'Folhas',fields:[{key:'cod',label:'Código',ph:'FL-22'}]},
  desenhos:{label:'Desenhos',fields:[{key:'cod',label:'Nº do desenho',ph:'ZZ8115M7000274'},{key:'descricao',label:'Descrição',ph:'opcional'}]},
  materiais:{label:'Materiais',fields:[{key:'cod',label:'Código',ph:'MAT-009'},{key:'descricao',label:'Descrição',ph:'Ex.: Tubo PRETO SCH 40 DN 4"'},{key:'unidade',label:'Unidade',ph:'un., m, kg...'}]},
  tags:{label:'Tags (suporte/equipamento)',fields:[
    {key:'cod',label:'Tag',ph:'SUP-020'},{key:'tipo',label:'Tipo',type:'select',options:[['SUP','Suporte'],['MEC-EQP','Equipamento']]},{key:'descricao',label:'Descrição',ph:'opcional'}
  ]},
  metas:{label:'Metas (programado)',fields:[
    {key:'frenteCod',label:'Frente',type:'select-frente'},{key:'discCod',label:'Descrição montagem',type:'select-disc'},{key:'meta',label:'Meta',ph:'0',type:'number'}
  ]},
  contatos:{label:'Contatos / Notificações',fields:[
    {key:'nome',label:'Nome',ph:'Ex.: Ana Souza'},{key:'email',label:'E-mail',ph:'nome@empresa.com'},
    {key:'papel',label:'Papel',type:'select',options:[['QUALIDADE','Qualidade'],['SUPERVISOR','Supervisor de Construção'],['GERENTE','Gerente'],['PLANEJAMENTO','Planejamento']]}
  ]},
  rncStatus:{label:'Status RNC',fields:[{key:'cod',label:'Código',ph:'EM_ESPERA'},{key:'nome',label:'Status',ph:'Ex.: Em espera'}]},
  rncClass:{label:'Classificação RNC',fields:[{key:'cod',label:'Código',ph:'MEDIA'},{key:'nome',label:'Nome',ph:'Ex.: MÉDIA'},{key:'desc',label:'Descrição',ph:'Ex.: Impacto médio-baixo'}]}
};
let cadCurrent='responsaveis';
function renderCadastro(){
  const navWrap=document.getElementById('cadNav');
  navWrap.innerHTML=Object.keys(CAD_DEFS).map(k=>`<button class="cad-nav-btn ${k===cadCurrent?'active':''}" onclick="setCadTab('${k}')">${esc(CAD_DEFS[k].label)}</button>`).join('');
  renderCadBody();
}
function setCadTab(k){cadCurrent=k;renderCadastro()}
function cadOptionsFor(field){
  if(field.type==='select-frente')return CADASTRO.frentes.map(f=>[f.cod,frenteLabel(f)]);
  if(field.type==='select-disc')return CADASTRO.disciplinas.map(d=>[d.cod,d.nome]);
  return field.options||[];
}
let contatosSubView='lista';
function setContatosSubView(v){contatosSubView=v;renderCadBody()}
function saveRncEmailText(){
  const v=document.getElementById('rncEmailTextInput').value.trim();
  CADASTRO.rncEmailText=v||DEFAULT_CADASTRO.rncEmailText;
  saveCadastro();
  toast('Texto da notificação de RNC atualizado.','ok');
}
function resetRncEmailText(){document.getElementById('rncEmailTextInput').value=DEFAULT_CADASTRO.rncEmailText}
const RNC_VAR_LABELS={frente:'Frente',desenho:'Desenho',folha:'Folha',data:'Data',turno:'Turno',responsavel:'Responsável',rnc_id:'ID da RNC',classificacao:'Classificação',descricao:'Descrição'};
function rncVarChipsHtml(){
  return RNC_TEMPLATE_VARS.map(k=>`<button type="button" class="chip" onclick="insertRncVar('${k}')">${esc(RNC_VAR_LABELS[k]||k)}</button>`).join('');
}
function insertRncVar(key){
  const ta=document.getElementById('rncEmailTextInput');
  const token='{{'+key+'}}';
  const start=ta.selectionStart??ta.value.length;
  const end=ta.selectionEnd??ta.value.length;
  ta.value=ta.value.slice(0,start)+token+ta.value.slice(end);
  ta.focus();
  ta.selectionStart=ta.selectionEnd=start+token.length;
}
function renderCadListHtml(){
  const def=CAD_DEFS[cadCurrent];
  const list=CADASTRO[cadCurrent];
  const formFields=def.fields.map(f=>{
    if(f.type==='select'||f.type==='select-frente'||f.type==='select-disc'){
      const opts=cadOptionsFor(f).map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');
      return `<div class="qfield2"><label>${esc(f.label)}</label><select id="cadf-${f.key}"><option value="">Selecione</option>${opts}</select></div>`;
    }
    if(f.type==='checkbox')return `<div class="qfield2"><label>${esc(f.label)}</label><select id="cadf-${f.key}"><option value="1">Sim</option><option value="">Não</option></select></div>`;
    return `<div class="qfield2"><label>${esc(f.label)}</label><input id="cadf-${f.key}" type="${f.type==='number'?'number':'text'}" placeholder="${esc(f.ph||'')}"></div>`;
  }).join('');
  const rowsHtml=list.map((item,idx)=>{
    const cells=def.fields.map(f=>{
      let v=item[f.key];
      if(f.type==='checkbox')v=v?'Sim':'Não';
      if(f.type==='select-frente'){const fr=frenteByCod(v);v=fr?frenteLabel(fr):v}
      if(f.type==='select-disc'){const dc=discByCod(v);v=dc?dc.nome:v}
      if(f.key==='detalhamento'){const opt=(f.options||[]).find(o=>o[0]===v);v=opt?opt[1]:v}
      if(f.key==='papel'){const opt=(f.options||[]).find(o=>o[0]===v);v=opt?opt[1]:v}
      return `<td>${esc(v??'')}</td>`;
    }).join('');
    return `<tr><td>${idx+1}</td>${cells}<td><button class="rm-btn" onclick="removeCadEntry('${cadCurrent}',${idx})" title="Remover">×</button></td></tr>`;
  }).join('');
  const headers=def.fields.map(f=>`<th>${esc(f.label)}</th>`).join('');
  return `
    <p class="cad-note">${list.length} registro(s) cadastrado(s). Adicionar/remover apenas — para editar, remova e cadastre novamente.</p>
    <div class="cad-form">${formFields}<button class="btn primary" onclick="addCadEntry('${cadCurrent}')">＋ Adicionar</button></div>
    <div style="overflow-x:auto"><table class="cad-table"><thead><tr><th>#</th>${headers}<th></th></tr></thead>
    <tbody>${rowsHtml || '<tr><td colspan="'+(def.fields.length+2)+'" style="text-align:center;color:var(--text-dim)">Nenhum registro ainda.</td></tr>'}</tbody></table></div>`;
}
function renderCadBody(){
  const body=document.getElementById('cadBody');
  if(cadCurrent==='contatos'){
    const chips=`<div class="chips" style="margin-bottom:14px">
      <button class="chip ${contatosSubView==='lista'?'active':''}" onclick="setContatosSubView('lista')">📇 Contatos</button>
      <button class="chip ${contatosSubView==='texto'?'active':''}" onclick="setContatosSubView('texto')">✉️ Texto da notificação</button>
      <button class="chip ${contatosSubView==='rnc'?'active':''}" onclick="setContatosSubView('rnc')">📧 Notificação RNC</button>
    </div>`;
    if(contatosSubView==='texto'){
      body.innerHTML=chips+`
        <p class="cad-note">Texto de abertura do e-mail enviado à Qualidade quando o Administrador encaminha uma RNC. Os dados completos da ocorrência são montados automaticamente logo abaixo deste texto.</p>
        <div class="cad-note" style="margin-bottom:6px">Variáveis disponíveis — clique para inserir no texto:</div>
        <div class="chips" style="margin-bottom:12px">${rncVarChipsHtml()}</div>
        <div class="field full"><label>Texto de abertura do e-mail</label><textarea id="rncEmailTextInput" style="min-height:140px">${esc(CADASTRO.rncEmailText||'')}</textarea></div>
        <div style="display:flex;gap:10px;margin-top:12px"><button class="btn secondary" onclick="resetRncEmailText()">Restaurar padrão</button><button class="btn primary" onclick="saveRncEmailText()">Salvar</button></div>`;
      return;
    }
    if(contatosSubView==='rnc'){
      body.innerHTML=chips+renderResponsavelListHtml('rnc','rncResponsavel','RNC (encaminhamento para Qualidade)');
      return;
    }
    body.innerHTML=chips+renderCadListHtml();
    return;
  }
  if(cadCurrent==='materiais'||cadCurrent==='desenhos'){
    const respKey=cadCurrent==='materiais'?'materiaisResponsavel':'desenhosResponsavel';
    const label=cadCurrent==='materiais'?'materiais':'desenhos';
    const sub=cadSubView[cadCurrent]||'catalogo';
    const chips=`<div class="chips" style="margin-bottom:14px">
      <button class="chip ${sub==='catalogo'?'active':''}" onclick="setCadSubView('${cadCurrent}','catalogo')">📋 Catálogo</button>
      <button class="chip ${sub==='responsavel'?'active':''}" onclick="setCadSubView('${cadCurrent}','responsavel')">👤 Responsáveis</button>
    </div>`;
    if(sub==='responsavel'){
      body.innerHTML=chips+renderResponsavelListHtml(cadCurrent,respKey,label);
      return;
    }
    body.innerHTML=chips+renderCadListHtml();
    return;
  }
  body.innerHTML=renderCadListHtml();
}
let cadSubView={materiais:'catalogo',desenhos:'catalogo'};
function setCadSubView(cat,v){cadSubView[cat]=v;renderCadBody()}
function renderResponsavelListHtml(catKey,respKey,itemLabel){
  const list=CADASTRO[respKey]||[];
  const rowsHtml=list.map((c,idx)=>`<tr><td>${idx+1}</td><td>${esc(c.nome||'')}</td><td>${esc(c.email||'')}</td><td>${esc(c.setor||'')}</td><td>${c.tipo==='CC'?'CC':'Para'}</td><td><button class="rm-btn" onclick="removeResponsavelContact('${catKey}','${respKey}',${idx})" title="Remover">×</button></td></tr>`).join('');
  return `
    <p class="cad-note">Contatos que recebem a notificação por e-mail quando o Administrador encaminha ${esc(itemLabel)}. Estrutura: <b>Para</b> (destinatário principal, um único contato) + <b>CC</b> (demais pessoas em cópia, quantas forem necessárias).</p>
    <div class="cad-form">
      <div class="qfield2"><label>Nome</label><input id="respNome-${catKey}" placeholder="Ex.: Ana Souza"></div>
      <div class="qfield2"><label>E-mail</label><input id="respEmail-${catKey}" placeholder="Ex.: ana.souza@techint.com"></div>
      <div class="qfield2"><label>Setor</label><input id="respSetor-${catKey}" placeholder="Ex.: Qualidade"></div>
      <div class="qfield2"><label>Tipo</label><select id="respTipo-${catKey}"><option value="PARA">Para</option><option value="CC">CC</option></select></div>
      <button class="btn primary" onclick="addResponsavelContact('${catKey}','${respKey}')">＋ Adicionar</button>
    </div>
    <div style="overflow-x:auto"><table class="cad-table"><thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Setor</th><th>Tipo</th><th></th></tr></thead>
    <tbody>${rowsHtml || '<tr><td colspan="6" style="text-align:center;color:var(--text-dim)">Nenhum contato cadastrado ainda.</td></tr>'}</tbody></table></div>`;
}
function addResponsavelContact(catKey,respKey){
  const nome=document.getElementById('respNome-'+catKey).value.trim();
  const email=document.getElementById('respEmail-'+catKey).value.trim();
  const setor=document.getElementById('respSetor-'+catKey).value.trim();
  const tipo=document.getElementById('respTipo-'+catKey).value||'PARA';
  if(!nome||!email){toast('Preencha nome e e-mail.','err');return}
  if(!CADASTRO[respKey])CADASTRO[respKey]=[];
  if(tipo==='PARA'&&CADASTRO[respKey].some(c=>c.tipo==='PARA')){toast('Já existe um contato "Para". Cadastre este como CC, ou remova o atual "Para" primeiro.','err');return}
  CADASTRO[respKey].push({nome,email,setor,tipo});
  saveCadastro();
  renderCadBody();
  toast('Contato adicionado.','ok');
}
function removeResponsavelContact(catKey,respKey,idx){
  CADASTRO[respKey].splice(idx,1);
  saveCadastro();
  renderCadBody();
}
function addCadEntry(cat){
  const def=CAD_DEFS[cat];
  const entry={};
  let firstVal=null;
  def.fields.forEach(f=>{
    const el=document.getElementById('cadf-'+f.key);
    let v=el.value;
    if(f.type==='checkbox')v=!!v;
    else if(f.type==='number')v=parseFloat(v)||0;
    entry[f.key]=v;
    if(firstVal===null)firstVal=v;
  });
  if(!firstVal){toast('Preencha ao menos o primeiro campo.','err');return}
  CADASTRO[cat].push(entry);
  saveCadastro();refreshCadastroSelects();renderCadBody();
  toast('Registro adicionado ao cadastro.','ok');
}
function removeCadEntry(cat,idx){
  CADASTRO[cat].splice(idx,1);
  saveCadastro();refreshCadastroSelects();renderCadBody();
}

/* =========================================================
   Conectividade + sincronização
   ========================================================= */
function toggleConn(){isOnline=!isOnline;updateConnUI();if(isOnline)trySync()}
function updateConnUI(){
  const btn=document.getElementById('connToggle');
  btn.classList.toggle('online',isOnline);
  document.getElementById('connLabel').textContent=isOnline?'Online':'Offline (simulado)';
}
let syncing=false;
async function trySync(){
  if(!isOnline||syncing)return;
  const all=await idbGetAll();
  const pending=all.filter(r=>r.status==='PENDING_SYNC');
  if(pending.length===0){refreshSyncStatus();return}
  syncing=true;
  refreshSyncStatus('syncing');
  for(const r of pending){r.status='SYNCING';await idbPut(r)}
  refreshSyncStatus('syncing');
  await new Promise(res=>setTimeout(res,1300));
  for(const r of pending){
    const fail=Math.random()<0.12;
    if(fail){r.status='SYNC_ERROR';r.errorMsg='Falha simulada de rede ao enviar para a API.'}
    else{r.status='SYNCED';r.syncedAt=nowIso();r.errorMsg=null}
    await idbPut(r);
  }
  syncing=false;
  refreshSyncStatus();
  if(document.getElementById('view-lanc').classList.contains('active'))renderLancList();
  if(document.getElementById('view-dash').classList.contains('active'))renderDashboard();
  const okCount=pending.filter(r=>r.status==='SYNCED').length;
  const errCount=pending.filter(r=>r.status==='SYNC_ERROR').length;
  if(okCount)toast(okCount+' registro(s) sincronizado(s) com sucesso.','ok');
  if(errCount)toast(errCount+' registro(s) com erro de sincronização.','err');
}
async function refreshSyncStatus(forceState){
  const el=document.getElementById('syncStatus');
  const txt=document.getElementById('syncStatusText');
  if(!el||!txt)return;
  const all=await idbGetAll();
  const pending=all.filter(r=>r.status==='PENDING_SYNC').length;
  const err=all.filter(r=>r.status==='SYNC_ERROR').length;
  el.classList.remove('pending','syncing','err');
  if(forceState==='syncing'){el.classList.add('syncing');txt.textContent='Sincronizando…';return}
  if(err>0){el.classList.add('err');txt.textContent=err+' com erro de sync';return}
  if(pending>0){el.classList.add('pending');txt.textContent=pending+' pendente(s) de sync';return}
  txt.textContent='Sem pendências';
}

boot();

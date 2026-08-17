/* =========================================================
   STEP 2 — Quantitativos (lançamentos múltiplos por tipo)
   ========================================================= */
function openAddItem(){
  const wrap=document.getElementById('addItemPresets');
  wrap.innerHTML='';
  CADASTRO.disciplinas.forEach(d=>{
    const b=document.createElement('button');
    b.className='qr-preset';
    b.innerHTML=`<b>${esc(d.nome)}</b><small>${esc(d.cod)} · ${d.dnAplica?'com DN':'sem DN'} · und. ${esc(d.und)}</small>`;
    b.onclick=()=>{draft.data.items.push(newItemForDisc(d.cod));renderQItems();scheduleSave();closeAddItem()};
    wrap.appendChild(b);
  });
  document.getElementById('addItemOverlay').classList.add('open');
}
function closeAddItem(){document.getElementById('addItemOverlay').classList.remove('open')}

function renderQItems(){
  const wrap=document.getElementById('qItems');
  wrap.innerHTML='';
  if(draft.data.items.length===0){
    wrap.innerHTML='<div class="empty-note">Nenhuma linha adicionada. Use "＋ Adicionar linha" para começar.</div>';
    return;
  }
  draft.data.items.forEach(it=>wrap.appendChild(buildQCard(it)));
}
function renderQItemsKeepScroll(){const y=window.scrollY;renderQItems();window.scrollTo(0,y)}

function dnOptionsHtml(selected){
  let html=`<option value="—" ${selected==='—'?'selected':''}>—</option>`;
  html+=CADASTRO.diametros.map(d=>`<option value="${esc(d.cod)}" ${selected===d.cod?'selected':''}>${esc(d.cod)}</option>`).join('');
  return html;
}
function folhaOptionsHtml(selected){
  let html=`<option value="">—</option>`;
  html+=CADASTRO.folhas.map(f=>`<option value="${esc(f.cod)}" ${selected===f.cod?'selected':''}>${esc(f.cod)}</option>`).join('');
  return html;
}
function tagOptionsHtml(discCod,selected){
  const opts=CADASTRO.tags.filter(t=>t.tipo===discCod);
  let html=`<option value="">Selecione o tag</option>`;
  html+=opts.map(t=>`<option value="${esc(t.cod)}" ${selected===t.cod?'selected':''}>${esc(t.cod)}${t.descricao?' — '+esc(t.descricao):''}</option>`).join('');
  return html;
}
function buildLancRowHtml(disc,l,idx){
  let fields='';
  if(disc.dnAplica)fields+=`<div class="qfield2 sm"><label>DN</label><select data-lf="dn">${dnOptionsHtml(l.dn)}</select></div>`;
  fields+=`<div class="qfield2 sm"><label>Folha</label><select data-lf="folha">${folhaOptionsHtml(l.folha)}</select></div>`;
  if(disc.detalhamento==='tags')fields+=`<div class="qfield2 sm"><label>Tag</label><select data-lf="tag">${tagOptionsHtml(disc.cod,l.tag)}</select></div>`;
  fields+=`<div class="qfield2 sm qty"><label>Qtd. (${esc(disc.und)})</label><input data-lf="qtd" type="number" min="0" step="0.01" value="${l.qtd}"></div>`;
  if(disc.detalhamento==='juntas'){
    fields+=`<div class="qfield2 sm"><label>Acoplamento</label><input data-lf="acoplamento" type="number" min="0" step="1" value="${l.acoplamento||0}"></div>`;
    fields+=`<div class="qfield2 sm"><label>Solda</label><input data-lf="solda" type="number" min="0" step="1" value="${l.solda||0}"></div>`;
  }
  return `<div class="lanc-row" data-lidx="${idx}">${fields}<button class="rm-btn" data-lrm="${idx}" title="Remover lançamento">×</button></div>`;
}
function updateCardTotal(card,it,disc){
  const totalSpan=card.querySelector('.qcard-total');
  if(totalSpan)totalSpan.textContent=`Total: ${fmtNum(itemQt(it))} ${disc.und}`;
}
function buildQCard(it){
  const disc=discByCod(it.discCod)||{nome:it.discCod,cod:it.discCod,und:'',dnAplica:false,detalhamento:'none'};
  const card=document.createElement('div');
  card.className='qcard';
  const rowsHtml=(it.lancamentos||[]).map((l,idx)=>buildLancRowHtml(disc,l,idx)).join('')
    || '<div class="empty-note" style="padding:8px 0">Nenhum lançamento — use "＋ Lançamento".</div>';
  card.innerHTML=`
    <div class="qcard-head">
      <div class="qcard-title">${esc(disc.nome)} <small>${esc(disc.cod)}</small></div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="qcard-total">Total: ${fmtNum(itemQt(it))} ${esc(disc.und)}</span>
        <button class="rm-btn" data-cardrm title="Remover tipo">×</button>
      </div>
    </div>
    <div class="lanc-rows">${rowsHtml}</div>
    <button class="btn secondary" data-addlanc style="min-height:38px;padding:0 14px;font-size:12px;margin-top:10px">＋ Lançamento</button>`;

  card.querySelectorAll('[data-lf]').forEach(inp=>{
    const evt=inp.tagName==='SELECT'?'change':'input';
    inp.addEventListener(evt,()=>{
      const idx=+inp.closest('.lanc-row').dataset.lidx;
      const f=inp.dataset.lf;
      const numeric=(f==='qtd'||f==='acoplamento'||f==='solda');
      it.lancamentos[idx][f]=numeric?(parseFloat(inp.value)||0):inp.value;
      updateCardTotal(card,it,disc);
      scheduleSave();
    });
  });
  card.querySelectorAll('[data-lrm]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=+btn.dataset.lrm;
      it.lancamentos.splice(idx,1);
      renderQItemsKeepScroll();scheduleSave();
    });
  });
  card.querySelector('[data-addlanc]').addEventListener('click',()=>{
    it.lancamentos.push(newLancamento(it.discCod));
    renderQItemsKeepScroll();scheduleSave();
  });
  card.querySelector('[data-cardrm]').addEventListener('click',async()=>{
    if(await askConfirm('Remover tipo de montagem',`Remover todos os lançamentos de ${disc.nome}?`)){
      draft.data.items=draft.data.items.filter(x=>x.id!==it.id);
      renderQItemsKeepScroll();scheduleSave();
    }
  });
  return card;
}

window.addEventListener('resize',()=>{if(draft && !document.getElementById('page2').classList.contains('hidden')){renderQItems()}});

/* ---------- step 3 / resumo ---------- */
function itemLine(it){
  const disc=discByCod(it.discCod)||{nome:it.discCod,und:'',detalhamento:'none'};
  const parts=(it.lancamentos||[]).filter(l=>lancQtd(l)>0 || (disc.detalhamento==='juntas'&&(l.acoplamento||l.solda))).map(l=>{
    let s='';
    if(l.dn && l.dn!=='—')s+=l.dn+' · ';
    if(l.folha)s+='Folha '+l.folha+' · ';
    if(l.tag)s+='Tag '+l.tag+' · ';
    s+=fmtNum(lancQtd(l))+' '+disc.und;
    if(disc.detalhamento==='juntas' && (l.acoplamento||l.solda))s+=' (Acoplamento: '+(l.acoplamento||0)+' | Solda: '+(l.solda||0)+')';
    return s;
  });
  if(parts.length===0)return null;
  return disc.nome+':\n   – '+parts.join('\n   – ');
}
function buildSummaryText(d){
  const lines=[];
  lines.push('📋 RELATÓRIO DIÁRIO DE CAMPO — '+d.obra.toUpperCase());
  lines.push('────────────────────────────');
  lines.push('Data: '+(d.date||'—'));
  lines.push('Responsável: '+(d.responsible||'—'));
  lines.push('Frente: '+(d.front||'—'));
  lines.push('Turno: '+(d.shift||'—'));
  if(d.folha)lines.push('Folha: '+d.folha);
  if(d.desenho)lines.push('Desenho: '+d.desenho);
  if(d.clima||d.horarioLiberacaoArt||d.horarioLiberacaoPpt||d.horarioLiberacaoQuente)lines.push('Clima: '+(d.clima||'—')+' | Liberação ART: '+(d.horarioLiberacaoArt||'—')+' | Liberação PPT: '+(d.horarioLiberacaoPpt||'—')+' | Liberação Trab. a Quente: '+(d.horarioLiberacaoQuente||'—'));
  lines.push('');
  if(d.type==='AVANCO'){
    lines.push('TIPO: AVANÇO — QUANTITATIVOS EXECUTADOS');
    const withLines=d.items.map(it=>itemLine(it)).filter(Boolean);
    if(withLines.length===0)lines.push('(nenhum item com quantidade lançada)');
    withLines.forEach(line=>lines.push('• '+line));
  }else{
    const rc=d.rnc;
    lines.push('TIPO: RNC — NÃO CONFORMIDADE');
    lines.push('ID: '+(rc.id||'(gerado ao finalizar)'));
    lines.push('Classificação: '+(rc.classificacao||'—')+' | Status: '+(rc.status||'ABERTA'));
    lines.push('Descrição: '+(rc.descricao||'—'));
    if(rc.causa)lines.push('Causa provável: '+rc.causa);
    if(rc.acaoImediata)lines.push('Ação imediata: '+rc.acaoImediata);
    if(rc.hh)lines.push('Impacto HH estimado: '+rc.hh);
    if(rc.responsavelAcao)lines.push('Responsável pela ação: '+rc.responsavelAcao+(rc.responsavelEmail?' ('+rc.responsavelEmail+')':''));
    if(rc.prazo)lines.push('Prazo para fechamento: '+rc.prazo);
  }
  lines.push('');
  if(d.comments)lines.push('Comentários: '+d.comments);
  if(d.unexpected)lines.push('Imprevistos: '+d.unexpected);
  if(d.pending)lines.push('Pendências: '+d.pending);
  lines.push('Data/hora do registro: '+(d.date||'—')+' '+(d.registradoEm||'—'));
  lines.push('────────────────────────────');
  lines.push('Gerado por Gestão de OS · MOA');
  return lines.join('\n');
}
function renderSummary(){
  const d=draft.data;
  if(d.type==='AVANCO'){
    const withLines=d.items.filter(it=>itemLine(it));
    const totalLanc=d.items.reduce((a,it)=>a+(it.lancamentos||[]).filter(l=>lancQtd(l)>0).length,0);
    document.getElementById('summary').innerHTML=`
      <div class="sum-item"><b>Responsável</b><span style="font-size:15px">${esc(d.responsible)}</span></div>
      <div class="sum-item"><b>Frente</b><span style="font-size:15px">${esc(d.front)}</span></div>
      <div class="sum-item"><b>Data / Turno</b><span style="font-size:14px">${d.date} · ${esc(d.shift)}</span></div>
      <div class="sum-item"><b>Tipos com produção</b><span>${withLines.length} / ${d.items.length}</span></div>`;
  }else{
    document.getElementById('summary').innerHTML=`
      <div class="sum-item"><b>Responsável</b><span style="font-size:15px">${esc(d.responsible)}</span></div>
      <div class="sum-item"><b>Frente</b><span style="font-size:15px">${esc(d.front)}</span></div>
      <div class="sum-item"><b>Classificação</b><span>${esc(d.rnc.classificacao||'—')}</span></div>
      <div class="sum-item"><b>Responsável ação</b><span style="font-size:13px">${esc(d.rnc.responsavelAcao||'—')}</span></div>`;
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  ['comments','unexpected','pending'].forEach(id=>{
    document.getElementById(id).addEventListener('input',e=>{draft.data[id]=e.target.value;scheduleSave()});
  });
});

function onFiles(e){
  const files=Array.from(e.target.files||[]);
  files.forEach(f=>draft.data.attachments.push({name:f.name,size:f.size,type:f.type}));
  renderAttachments();scheduleSave();e.target.value='';
}
function renderAttachments(){
  const wrap=document.getElementById('attachList');
  wrap.innerHTML='';
  draft.data.attachments.forEach((a,i)=>{
    const c=document.createElement('span');
    c.className='attach-chip';
    c.innerHTML=`${a.type&&a.type.startsWith('image')?'🖼️':'📄'} ${esc(a.name)} <span style="color:var(--text-dim);font-family:var(--mono)">(${Math.round(a.size/1024)}kb)</span><button>×</button>`;
    c.querySelector('button').onclick=()=>{draft.data.attachments.splice(i,1);renderAttachments();scheduleSave()};
    wrap.appendChild(c);
  });
}

async function nextRncId(){
  const all=await idbGetAll();
  const year=new Date().getFullYear();
  const count=all.filter(r=>r.data.type==='RNC' && r.status!=='DRAFT' && r.status!=='ENCAMINHADO').length;
  return 'RNC-AVCB-'+year+'-'+String(count+1).padStart(3,'0');
}

async function copyResumo(){
  const text=document.getElementById('resumoText').value;
  try{await navigator.clipboard.writeText(text);toast('Resumo copiado! Cole no WhatsApp, e-mail etc.','ok')}
  catch(e){
    const ta=document.getElementById('resumoText');ta.focus();ta.select();
    try{document.execCommand('copy');toast('Resumo copiado! Cole no WhatsApp, e-mail etc.','ok')}
    catch(e2){toast('Não foi possível copiar automaticamente — selecione o texto manualmente.','err')}
  }
}
async function copyEmailBody(){
  const text=document.getElementById('emailBody').value;
  try{await navigator.clipboard.writeText(text);toast('Corpo do e-mail copiado.','ok')}
  catch(e){
    const ta=document.getElementById('emailBody');ta.focus();ta.select();
    try{document.execCommand('copy');toast('Corpo do e-mail copiado.','ok')}
    catch(e2){toast('Não foi possível copiar — selecione manualmente.','err')}
  }
}
const RNC_TEMPLATE_VARS=['frente','desenho','folha','data','turno','responsavel','rnc_id','classificacao','descricao'];
function rncTemplateVarValues(d){
  return {
    frente:d.front||'—',desenho:d.desenho||'—',folha:d.folha||'—',data:d.date||'—',
    turno:d.shift||'—',responsavel:d.responsible||'—',
    rnc_id:d.rnc.id||'—',classificacao:d.rnc.classificacao||'—',descricao:d.rnc.descricao||'—'
  };
}
function fillRncTemplateVars(text,d){
  const vars=rncTemplateVarValues(d);
  return text.replace(/\{\{(\w+)\}\}/g,(m,k)=>vars[k]!==undefined?vars[k]:m);
}
function buildEmailForRnc(d){
  const list=CADASTRO.rncResponsavel||[];
  const para=list.find(c=>c.tipo==='PARA');
  const ccContacts=list.filter(c=>c.tipo==='CC');
  const to=para?para.email:'';
  const cc=ccContacts.map(c=>c.email).join(',');
  const subject='[RNC] '+d.rnc.id+' — '+d.rnc.classificacao+' — '+d.front;
  const intro=fillRncTemplateVars(CADASTRO.rncEmailText||DEFAULT_CADASTRO.rncEmailText,d);
  const body=intro+'\n\n'+buildSummaryText(d);
  return {to,cc,subject,body};
}
function openEmail(){
  if(!lastEmailDraft || !lastEmailDraft.to){toast('Cadastre o responsável de Qualidade em Cadastro → Contatos.','err');return}
  const {to,cc,subject,body}=lastEmailDraft;
  let url='mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  if(cc)url+='&cc='+encodeURIComponent(cc);
  window.location.href=url;
  toast('Abrindo seu aplicativo de e-mail padrão...','ok');
}
async function continueFromRnc(){
  if(!draft.data.rnc.descricao||!draft.data.rnc.classificacao){toast('Preencha descrição e classificação da RNC.','err');return}
  if(!draft.data.rnc.id){
    draft.data.rnc.id=await nextRncId();
    draft.data.rnc.status='EM_ANALISE';
  }
  if(sessionProfile!=='ADMIN'){
    draft.notifRead=false;
    toast('RNC '+draft.data.rnc.id+' registrada. O Administrador foi notificado.','ok');
  }
  await persistDraft();
  goStep(3);
}

async function finish(){
  draft.data.registradoEm=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  if(draft.data.type==='AVANCO'){
    draft.data.items.forEach(it=>{
      const disc=discByCod(it.discCod)||{detalhamento:'none'};
      it.lancamentos=(it.lancamentos||[]).filter(l=>lancQtd(l)>0 || (disc.detalhamento==='juntas'&&(l.acoplamento||l.solda)));
    });
    draft.data.items=draft.data.items.filter(it=>it.lancamentos.length>0);
    if(draft.data.items.length===0){toast('Lance ao menos uma quantidade antes de finalizar.','err');return}
  }
  if(draft.data.type==='RNC' && (!draft.data.rnc.descricao||!draft.data.rnc.classificacao)){toast('Preencha descrição e classificação da RNC.','err');goStep(2,true);return}
  if(draft.data.type==='RNC' && !draft.data.rnc.id){
    draft.data.rnc.id=await nextRncId();
    draft.data.rnc.status='EM_ANALISE';
  }
  if(sessionProfile!=='ADMIN')draft.notifRead=false;
  draft.status='PENDING_SYNC';
  draft.updatedAt=nowIso();
  await idbPut(draft);
  if(sessionProfile==='ADMIN')refreshNotifBadge();
  document.querySelectorAll('#page1,#page2,#page2rnc,#page3').forEach(s=>s.classList.add('hidden'));
  document.getElementById('done').classList.remove('hidden');
  const isAdmin=sessionProfile==='ADMIN';
  if(draft.data.type==='AVANCO'){
    const totalLanc=draft.data.items.reduce((a,it)=>a+it.lancamentos.length,0);
    document.getElementById('doneSummary').innerHTML=`
      <div class="sum-item"><b>ID</b><span style="font-size:15px">AV-${draft.id.slice(0,8).toUpperCase()}</span></div>
      <div class="sum-item"><b>Frente</b><span style="font-size:14px">${esc(draft.data.front)}</span></div>
      <div class="sum-item"><b>Tipos lançados</b><span>${draft.data.items.length}</span></div>
      <div class="sum-item"><b>Lançamentos</b><span>${totalLanc}</span></div>`;
    if(isAdmin){
      document.getElementById('emailBox').classList.add('hidden');
    }else{
      document.getElementById('emailBoxTitle').textContent='🔔 Administrador notificado';
      document.getElementById('emailBoxContent').innerHTML='<p class="cad-note">O Administrador foi notificado sobre este avanço.</p>';
      document.getElementById('emailBox').classList.remove('hidden');
    }
  }else{
    document.getElementById('doneSummary').innerHTML=`
      <div class="sum-item"><b>ID da RNC</b><span style="font-size:15px">${draft.data.rnc.id}</span></div>
      <div class="sum-item"><b>Classificação</b><span>${esc(draft.data.rnc.classificacao)}</span></div>
      <div class="sum-item"><b>Status</b><span>${esc(rncStatusNome(draft.data.rnc.status))}</span></div>
      <div class="sum-item"><b>Responsável</b><span style="font-size:12.5px">${esc(draft.data.rnc.responsavelAcao||'—')}</span></div>`;
    document.getElementById('emailBox').classList.remove('hidden');
    if(isAdmin){
      lastEmailDraft=buildEmailForRnc(draft.data);
      document.getElementById('emailBoxTitle').textContent='📧 Encaminhar para Qualidade';
      document.getElementById('emailBoxContent').innerHTML=`
        <p class="cad-note">Para: ${esc(lastEmailDraft.to||'— (cadastre em Contatos)')}   |   Cc: ${esc(lastEmailDraft.cc||'—')}</p>
        <textarea class="resumo-text" id="emailBody" readonly style="min-height:160px">${esc(lastEmailDraft.subject+'\n\n'+lastEmailDraft.body)}</textarea>
        <div class="resumo-actions"><button class="btn primary" onclick="openEmail()">📧 Abrir e-mail</button><button class="btn secondary" onclick="copyEmailBody()">📋 Copiar corpo</button></div>`;
    }else{
      document.getElementById('emailBoxTitle').textContent='🔔 Administrador notificado';
      document.getElementById('emailBoxContent').innerHTML='<p class="cad-note">O Administrador foi notificado sobre esta RNC e dará andamento ao fluxo, encaminhando para a Qualidade.</p>';
    }
  }
  document.getElementById('resumoText').value=buildSummaryText(draft.data);
  refreshSyncStatus();
  trySync();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---------- views ---------- */
function showView(v){
  if(v!=='login' && v!=='campo-hub' && !sessionProfile)v='login';
  if((v==='cadastro'||v==='relatorio') && sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');v='dash'}
  const panelVisKey={curvas:'curvas',lanc:'lanc',controle:'controle'}[v];
  if(panelVisKey && sessionProfile!=='ADMIN'){
    if(!PANEL_VIS)loadPanelVisFromCache();
    if(!PANEL_VIS[panelVisKey]){toast('Este painel não está disponível para o seu perfil.','err');v='dash'}
  }
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.getElementById('topNav')?.classList.toggle('hidden',!sessionProfile||v==='campo-hub');
  document.getElementById('topNav')?.classList.toggle('topnav-minimal',sessionProfile!=='ADMIN' && (v==='wizard'||v==='solicitacoes'));
  document.getElementById('navDash')?.classList.toggle('active',v==='dash');
  document.getElementById('navLanc')?.classList.toggle('active',v==='lanc');
  document.getElementById('navCad')?.classList.toggle('active',v==='cadastro');
  document.getElementById('navCurvas')?.classList.toggle('active',v==='curvas');
  document.getElementById('navControle')?.classList.toggle('active',v==='controle');
  if(v==='lanc')renderLancList();
  if(v==='dash')renderDashboard();
  if(v==='cadastro')renderCadastro();
  if(v==='curvas')renderCurvas();
  if(v==='controle')renderControle();
  if(v==='solicitacoes')renderSolicitacoesView();
  if(v==='relatorio')renderRelatorioView();
  window.scrollTo({top:0});
}

let lancFilter='ALL';
let periodFilter='ALL';
let customFrom='',customTo='';
function setLancFilter(f){lancFilter=f;document.querySelectorAll('#lancFilters .chip').forEach(c=>c.classList.toggle('active',c.dataset.f===f));updateLancFiltersBadge();renderLancList()}
function setPeriodFilter(p){
  periodFilter=p;
  document.querySelectorAll('#periodFilters .chip').forEach(c=>c.classList.toggle('active',c.dataset.p===p));
  document.getElementById('customPeriodRow').classList.toggle('hidden',p!=='CUSTOM');
  updateLancFiltersBadge();
  renderLancList();
}
function applyCustomPeriod(){
  customFrom=document.getElementById('customFrom').value;
  customTo=document.getElementById('customTo').value;
  updateLancFiltersBadge();
  renderLancList();
}
function updateLancFiltersBadge(){
  const btn=document.getElementById('btnLancFiltersToggle');
  if(!btn)return;
  const n=(lancFilter!=='ALL'?1:0)+(periodFilter!=='ALL'?1:0);
  btn.textContent='🔍 Filtros'+(n?' ('+n+')':'');
}
function startOfWeekMonday(d){const day=d.getDay();const diff=(day+6)%7;const m=new Date(d);m.setDate(d.getDate()-diff);m.setHours(0,0,0,0);return m}
function inPeriod(dateStr){
  if(periodFilter==='ALL')return true;
  if(!dateStr)return false;
  if(periodFilter==='TODAY')return dateStr===todayLocalIso();
  const d=new Date(dateStr+'T00:00:00');
  const now=new Date();now.setHours(0,0,0,0);
  if(periodFilter==='WEEK'){
    const monday=startOfWeekMonday(now);
    const sunday=new Date(monday);sunday.setDate(monday.getDate()+6);
    return d>=monday && d<=sunday;
  }
  if(periodFilter==='MONTH')return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth();
  if(periodFilter==='CUSTOM'){
    if(customFrom && dateStr<customFrom)return false;
    if(customTo && dateStr>customTo)return false;
    return true;
  }
  return true;
}
/* =========================================================
   NOTIFICAÇÕES — avanço, RNC e solicitações pendentes de revisão pelo Adm
   ========================================================= */
async function getNotifications(){
  const all=await idbGetAll();
  const fromRegistros=all.filter(r=>r.notifRead===false).map(r=>({
    kind:r.data.type,sourceId:r.id,
    title:r.data.type==='RNC'?('⚠️ RNC '+(r.data.rnc.id||'')+' — '+(r.data.front||'(sem frente)')):('📈 Avanço — '+(r.data.front||'(sem frente)')),
    subtitle:(r.data.responsible||'—')+' · '+fmtDateTime(r.updatedAt),
    createdAt:r.updatedAt
  }));
  const fromSolic=(SOLICITACOES||[]).filter(s=>!s.readByAdmin).map(s=>({
    kind:s.tipo,sourceId:s.id,
    title:(s.tipo==='MATERIAL'?'📦 Solicitação de material':'📐 Solicitação de desenho')+' — '+((s.itens||[]).length)+' item(ns)',
    subtitle:(s.solicitante||'—')+' · '+fmtDateTime(s.createdAt),
    createdAt:s.createdAt
  }));
  return [...fromRegistros,...fromSolic].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
async function refreshNotifBadge(){
  if(sessionProfile!=='ADMIN')return;
  const badge=document.getElementById('notifBadgeCount');
  if(!badge)return;
  const list=await getNotifications();
  badge.textContent=list.length;
  badge.classList.toggle('hidden',list.length===0);
}
async function openNotifPanel(){
  const list=await getNotifications();
  const wrap=document.getElementById('notifList');
  wrap.innerHTML=list.length===0?'<p class="empty-note">Nenhuma notificação pendente.</p>':
    list.map(n=>`<div class="lanc-item notif-item" onclick="openNotifDetail('${n.kind}','${n.sourceId}')"><div class="li-main"><b>${esc(n.title)}</b><small>${esc(n.subtitle)}</small></div></div>`).join('');
  document.getElementById('notifDrawer').classList.add('open');
  document.getElementById('notifBackdrop').classList.add('show');
}
function closeNotifPanel(){
  document.getElementById('notifDrawer').classList.remove('open');
  document.getElementById('notifBackdrop').classList.remove('show');
}
async function openNotifDetail(kind,sourceId){
  if(kind==='AVANCO'||kind==='RNC'){
    const all=await idbGetAll();
    const rec=all.find(r=>r.id===sourceId);
    if(!rec)return;
    rec.notifRead=true;
    await idbPut(rec);
    refreshNotifBadge();
    closeNotifPanel();
    if(kind==='RNC'){openRncNotifDetail(rec)}
    else{toast('Avanço de '+(rec.data.front||'—')+' marcado como visto.','ok');showView('lanc')}
  }else{
    markSolicitacaoRead(sourceId);
    refreshNotifBadge();
    closeNotifPanel();
    openSolicitacaoDetail(sourceId);
  }
}
let rncNotifTargetId=null;
function openRncNotifDetail(rec){
  rncNotifTargetId=rec.id;
  const r=rec.data.rnc;
  document.getElementById('rncNotifSummary').innerHTML=`
    <div class="notif-detail">
      <div class="notif-detail-head">
        <b>${esc(r.id||'RNC')}</b>
        <div class="badges">
          <span class="rnc-badge ${esc(r.classificacao||'')}">${esc(r.classificacao||'—')}</span>
          <span class="rnc-badge ${esc(r.status||'')}">${esc(rncStatusNome(r.status))}</span>
        </div>
      </div>
      <div class="notif-detail-row"><div class="notif-detail-label">Frente</div><div class="notif-detail-value">${esc(rec.data.front||'—')}</div></div>
      <div class="notif-detail-row"><div class="notif-detail-label">Responsável</div><div class="notif-detail-value">${esc(rec.data.responsible||'—')}</div></div>
      <div class="notif-detail-row"><div class="notif-detail-label">Data</div><div class="notif-detail-value">${esc(rec.data.date||'—')}</div></div>
      <div class="notif-detail-row"><div class="notif-detail-label">Descrição</div><div class="notif-detail-value">${esc(r.descricao||'—')}</div></div>
    </div>`;
  document.getElementById('rncNotifOverlay').classList.add('open');
}
function closeRncNotifDetail(){document.getElementById('rncNotifOverlay').classList.remove('open')}
async function forwardRncToQualidade(){
  const all=await idbGetAll();
  const rec=all.find(r=>r.id===rncNotifTargetId);
  if(!rec)return;
  const emailDraft=buildEmailForRnc(rec.data);
  if(!emailDraft.to){toast('Cadastre o responsável de Qualidade em Cadastro → Contatos.','err');return}
  let url='mailto:'+encodeURIComponent(emailDraft.to)+'?subject='+encodeURIComponent(emailDraft.subject)+'&body='+encodeURIComponent(emailDraft.body);
  if(emailDraft.cc)url+='&cc='+encodeURIComponent(emailDraft.cc);
  window.location.href=url;
  rec.data.rnc.status='EM_ACAO';
  await idbPut(rec);
  closeRncNotifDetail();
  renderLancList();
  toast('RNC encaminhada para a Qualidade.','ok');
}

/* =========================================================
   SOLICITAÇÕES — materiais (a partir do TakeOff) / desenhos
   ========================================================= */
let solicTipo='MATERIAL';
let solicRows=[{item:'',material:'',qtd:'',unidade:''}];
function blankSolicRow(){return solicTipo==='MATERIAL'?{item:'',material:'',qtd:'',unidade:''}:{fromCatalog:true,desenhoCod:'',desenhoCustom:''}}
function extractUnitFromQte(qte){
  if(qte===undefined||qte===null)return 'un.';
  const m=String(qte).trim().match(/[a-zA-Zçãéíóúâêîôûàü°²³%]+$/);
  return m?m[0]:'un.';
}
function setSolicTipo(t){solicTipo=t;solicRows=[blankSolicRow()];renderSolicitacoesView()}
function desenhoOptionsHtml(selected){
  return '<option value="">Selecione</option>'+CADASTRO.desenhos.map(d=>`<option value="${esc(d.cod)}" ${d.cod===selected?'selected':''}>${esc(desenhoLabel(d))}</option>`).join('');
}
function renderSolicRowsHtml(){
  if(solicTipo==='MATERIAL'){
    return solicRows.map((row,i)=>`
      <div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:10px;flex-wrap:wrap">
        <div class="field" style="flex:0 0 76px;min-width:76px"><label>Item</label><input type="number" value="${esc(row.item)}" oninput="onSolicItemInput(${i},this.value)" list="takeoffItemsList"></div>
        <div class="field" style="flex:4;min-width:240px"><label>Material</label><input readonly id="solicRowMat-${i}" value="${esc(row.material)}" placeholder="Preenchido automaticamente pelo Item"></div>
        <div class="field" style="flex:0 0 90px;min-width:90px"><label>Qt. <span id="solicRowUnit-${i}">${row.unidade?'('+esc(row.unidade)+')':''}</span></label><input type="number" min="1" value="${esc(row.qtd)}" oninput="solicRows[${i}].qtd=this.value"></div>
        <button class="rm-btn" onclick="removeSolicRowAt(${i})" title="Remover" ${solicRows.length<=1?'disabled':''} style="margin-bottom:10px">×</button>
      </div>`).join('');
  }
  return solicRows.map((row,i)=>`
    <div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:10px;flex-wrap:wrap">
      <div class="field" style="flex:1;min-width:150px"><label>Origem</label><select onchange="onSolicOrigemChange(${i},this.value)">
        <option value="catalogo" ${row.fromCatalog?'selected':''}>Cadastrado</option>
        <option value="outro" ${!row.fromCatalog?'selected':''}>Outro</option>
      </select></div>
      <div class="field" style="flex:2;min-width:220px">${row.fromCatalog
        ?`<label>Desenho</label><select onchange="solicRows[${i}].desenhoCod=this.value">${desenhoOptionsHtml(row.desenhoCod)}</select>`
        :`<label>Desenho (digitar)</label><input value="${esc(row.desenhoCustom||'')}" oninput="solicRows[${i}].desenhoCustom=this.value" placeholder="Nome/número do desenho">`}</div>
      <button class="rm-btn" onclick="removeSolicRowAt(${i})" title="Remover" ${solicRows.length<=1?'disabled':''} style="margin-bottom:10px">×</button>
    </div>`).join('');
}
function renderSolicRowsWrap(){const el=document.getElementById('solicRowsWrap');if(el)el.innerHTML=renderSolicRowsHtml()}
function onSolicItemInput(i,val){
  solicRows[i].item=val;
  if(!CONTROLE)loadControleFromCache();
  const found=(CONTROLE.takeoff||[]).find(t=>String(t.item)===String(val).trim());
  solicRows[i].material=found?found.descricao:'';
  solicRows[i].unidade=found?extractUnitFromQte(found.qte):'';
  const matEl=document.getElementById('solicRowMat-'+i);
  if(matEl)matEl.value=found?found.descricao:(val?'Item não encontrado no TakeOff':'');
  const unitEl=document.getElementById('solicRowUnit-'+i);
  if(unitEl)unitEl.textContent=solicRows[i].unidade?'('+solicRows[i].unidade+')':'';
}
function onSolicOrigemChange(i,val){solicRows[i].fromCatalog=(val==='catalogo');renderSolicRowsWrap()}
function addSolicRow(){solicRows.push(blankSolicRow());renderSolicRowsWrap()}
function removeSolicRowAt(i){if(solicRows.length<=1)return;solicRows.splice(i,1);renderSolicRowsWrap()}
function renderSolicitacoesView(){
  if(!CONTROLE)loadControleFromCache();
  const respOptions=CADASTRO.responsaveis.map(r=>`<option value="${esc(r.nome)}">${esc(respLabel(r))}</option>`).join('');
  const takeoffDatalist=solicTipo==='MATERIAL'?`<datalist id="takeoffItemsList">${(CONTROLE.takeoff||[]).map(t=>`<option value="${esc(t.item)}">${esc(t.descricao)}</option>`).join('')}</datalist>`:'';
  document.getElementById('solicBody').innerHTML=`
    <div class="chips" style="margin-bottom:14px">
      <button class="chip ${solicTipo==='MATERIAL'?'active':''}" onclick="setSolicTipo('MATERIAL')">📦 Materiais</button>
      <button class="chip ${solicTipo==='DESENHO'?'active':''}" onclick="setSolicTipo('DESENHO')">📐 Desenhos</button>
    </div>
    <div class="grid" style="margin-bottom:14px">
      <div class="field full"><label>Projeto</label><input value="AVCB Gasômetro" readonly></div>
      <div class="field full"><label>Solicitante</label><select id="solicNome"><option value="">Selecione</option>${respOptions}</select></div>
    </div>
    <div id="solicRowsWrap">${renderSolicRowsHtml()}</div>
    <button class="btn secondary" onclick="addSolicRow()" style="margin-bottom:14px">＋ Adicionar ${solicTipo==='MATERIAL'?'material':'desenho'}</button>
    ${takeoffDatalist}
    <div class="field full"><label>Observação</label><textarea id="solicObs" placeholder="opcional"></textarea></div>
    <div class="actions"><button class="btn secondary" onclick="backFromSolicitacoes()">← Voltar</button><div class="right"><button class="btn primary" onclick="submitSolicitacao()">${solicTipo==='MATERIAL'?'📦':'📐'} Enviar solicitação</button></div></div>`;
}
function backFromSolicitacoes(){showView(sessionProfile==='ADMIN'?'dash':'campo-hub')}
async function submitSolicitacao(){
  const nome=document.getElementById('solicNome').value;
  if(!nome){toast('Selecione o solicitante.','err');return}
  let itens=[];
  if(solicTipo==='MATERIAL'){
    itens=solicRows.filter(r=>r.item&&r.qtd).map(r=>({item:r.item,material:r.material||'(item não encontrado no TakeOff)',quantidade:r.qtd,unidade:r.unidade||''}));
    if(itens.length===0){toast('Informe ao menos um item e quantidade.','err');return}
  }else{
    itens=solicRows.filter(r=>r.fromCatalog?r.desenhoCod:r.desenhoCustom).map(r=>r.fromCatalog?{desenho:r.desenhoCod,custom:false}:{desenho:r.desenhoCustom,custom:true});
    if(itens.length===0){toast('Informe ao menos um desenho.','err');return}
  }
  const obs=document.getElementById('solicObs').value;
  const s={
    id:'sol_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    tipo:solicTipo,itens,observacao:obs,
    solicitante:nome,projeto:'AVCB Gasômetro',status:'ABERTA',
    createdAt:nowIso(),readByAdmin:false
  };
  SOLICITACOES.push(s);
  saveSolicitacoes();
  toast('Solicitação enviada! O Administrador foi notificado.','ok');
  refreshNotifBadge();
  solicRows=[blankSolicRow()];
  backFromSolicitacoes();
  await submitSolicitacaoToSupabase(s);
}
let solicDetailTargetId=null;
async function markSolicitacaoRead(id){
  const s=SOLICITACOES.find(x=>x.id===id);
  if(s){s.readByAdmin=true;saveSolicitacoes();await updateSolicitacaoRemote(id,{read_by_admin:true})}
}
const SOLIC_STATUS_LABELS={ABERTA:'Aberta',ENCAMINHADA:'Encaminhada',ATENDIDA:'Atendida'};
function openSolicitacaoDetail(id){
  const s=SOLICITACOES.find(x=>x.id===id);
  if(!s)return;
  solicDetailTargetId=id;
  document.getElementById('solicDetailTitle').textContent=s.tipo==='MATERIAL'?'📦 Solicitação de material':'📐 Solicitação de desenho';
  const itensHtml=(s.itens||[]).map(it=>s.tipo==='MATERIAL'
    ?`<div class="notif-item-card"><b>Item ${esc(it.item)}</b><span>${esc(it.material)} — Qtd: ${esc(it.quantidade)}${it.unidade?' '+esc(it.unidade):''}</span></div>`
    :`<div class="notif-item-card"><b>${it.custom?'Outro (não cadastrado)':'Cadastrado'}</b><span>${esc(it.desenho)}</span></div>`
  ).join('');
  document.getElementById('solicDetailSummary').innerHTML=`
    <div class="notif-detail">
      <div class="notif-detail-head">
        <b>${esc(s.solicitante)}</b>
        <span class="status-badge ${esc(s.status)}">${esc(SOLIC_STATUS_LABELS[s.status]||s.status)}</span>
      </div>
      <div class="notif-detail-row"><div class="notif-detail-label">Projeto</div><div class="notif-detail-value">${esc(s.projeto)}</div></div>
      <div class="notif-detail-items">
        <div class="notif-detail-items-title">${(s.itens||[]).length} item(ns) solicitado(s)</div>
        ${itensHtml}
      </div>
      ${s.observacao?`<div class="notif-detail-row"><div class="notif-detail-label">Observação</div><div class="notif-detail-value">${esc(s.observacao)}</div></div>`:''}
    </div>`;
  document.getElementById('solicDetailOverlay').classList.add('open');
}
function closeSolicDetail(){document.getElementById('solicDetailOverlay').classList.remove('open')}
function buildEmailForSolicitacao(s){
  const respKey=s.tipo==='MATERIAL'?'materiaisResponsavel':'desenhosResponsavel';
  const list=CADASTRO[respKey]||[];
  const para=list.find(c=>c.tipo==='PARA');
  const ccContacts=list.filter(c=>c.tipo==='CC');
  const to=para?para.email:'';
  const cc=ccContacts.map(c=>c.email).join(',');
  const subject='[Solicitação] '+(s.tipo==='MATERIAL'?'Materiais':'Desenhos')+' — '+s.solicitante;
  const itensText=(s.itens||[]).map(it=>s.tipo==='MATERIAL'
    ?'• Item '+it.item+' — '+it.material+' — Qtd: '+it.quantidade+(it.unidade?' '+it.unidade:'')
    :'• '+it.desenho+(it.custom?' (não cadastrado)':'')
  ).join('\n');
  const body='Prezados,\n\nSegue solicitação de '+(s.tipo==='MATERIAL'?'materiais':'desenhos')+' do projeto '+s.projeto+', encaminhada pelo Administrador.\n\nSolicitante: '+s.solicitante+'\n\nItens solicitados:\n'+itensText+(s.observacao?'\n\nObservação: '+s.observacao:'')+'\n\nGerado por Gestão de OS · MOA';
  return {to,cc,subject,body};
}
async function forwardSolicitacao(){
  const s=SOLICITACOES.find(x=>x.id===solicDetailTargetId);
  if(!s)return;
  const email=buildEmailForSolicitacao(s);
  if(!email.to){toast('Cadastre o responsável (Para) em Cadastro → '+(s.tipo==='MATERIAL'?'Materiais':'Desenhos')+' → Responsáveis.','err');return}
  let url='mailto:'+encodeURIComponent(email.to)+'?subject='+encodeURIComponent(email.subject)+'&body='+encodeURIComponent(email.body);
  if(email.cc)url+='&cc='+encodeURIComponent(email.cc);
  window.location.href=url;
  s.status='ENCAMINHADA';
  saveSolicitacoes();
  toast('Solicitação encaminhada para '+email.to+'.','ok');
  await updateSolicitacaoRemote(s.id,{status:'ENCAMINHADA'});
}
async function markSolicitacaoAtendida(){
  const s=SOLICITACOES.find(x=>x.id===solicDetailTargetId);
  if(!s)return;
  s.status='ATENDIDA';
  saveSolicitacoes();
  await updateSolicitacaoRemote(s.id,{status:'ATENDIDA'});
  closeSolicDetail();
  toast('Solicitação marcada como atendida.','ok');
}

/* =========================================================
   RELATÓRIO — consulta visual de registros diários (somente leitura)
   ========================================================= */
async function renderRelatorioView(){
  const dateInput=document.getElementById('relatorioDate');
  if(!dateInput.value)dateInput.value=todayLocalIso();
  const targetDate=dateInput.value;
  const all=await idbGetAll();
  const committed=all.filter(r=>r.status!=='DRAFT'&&r.status!=='ENCAMINHADO'&&r.data.date===targetDate).sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt));
  const wrap=document.getElementById('relatorioBody');
  if(committed.length===0){wrap.innerHTML='<p class="empty-note">Nenhum registro para esta data.</p>';return}
  wrap.innerHTML=`<p class="cad-note">${committed.length} registro(s) em ${fmtDateBR(targetDate)}.</p>`+
    committed.map(r=>{
      const line=lancLine(r);
      return `<div class="lanc-item"><div class="li-main"><b>${line.icon} ${line.title}</b><small>${esc(r.data.responsible||'—')} · ${esc(r.data.front||'—')} · ${esc(r.data.registradoEm||fmtDateTime(r.updatedAt))}</small></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${line.badges}<span class="status-badge ${r.status}">${statusLabel(r.status)}</span></div></div>`;
    }).join('');
}

let rncStatusTargetId=null;
async function openRncStatusChange(id){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  const all=await idbGetAll();
  const rec=all.find(r=>r.id===id);
  if(!rec){toast('Registro não encontrado.','err');return}
  rncStatusTargetId=id;
  const sel=document.getElementById('rncStatusSelect');
  sel.innerHTML=CADASTRO.rncStatus.map(s=>`<option value="${esc(s.cod)}" ${s.cod===rec.data.rnc.status?'selected':''}>${esc(s.nome)}</option>`).join('');
  document.getElementById('rncStatusMeta').textContent=(rec.data.rnc.id||'RNC')+' — '+(rec.data.front||'');
  document.getElementById('rncStatusOverlay').classList.add('open');
}
function closeRncStatusChange(){document.getElementById('rncStatusOverlay').classList.remove('open')}
async function submitRncStatusChange(){
  const all=await idbGetAll();
  const rec=all.find(r=>r.id===rncStatusTargetId);
  if(!rec)return;
  rec.data.rnc.status=document.getElementById('rncStatusSelect').value;
  rec.updatedAt=nowIso();
  await idbPut(rec);
  closeRncStatusChange();
  renderLancList();
  if(document.getElementById('view-dash').classList.contains('active'))renderDashboard();
  toast('Status da RNC atualizado.','ok');
}
async function getFilteredLancamentos(){
  const all=(await idbGetAll()).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  return all.filter(r=>(lancFilter==='ALL'||r.status===lancFilter) && inPeriod(r.data.date));
}
function rncStatusNome(cod){return (CADASTRO.rncStatus.find(s=>s.cod===cod)||{}).nome||cod}
function lancLine(r){
  if(r.data.type==='AVANCO'){
    const totalLanc=(r.data.items||[]).reduce((a,it)=>a+(it.lancamentos?it.lancamentos.length:0),0);
    return {icon:'📈',title:`${esc(r.data.front||'(sem frente)')} — ${totalLanc} lançamento(s)`,badges:''};
  }
  const rc=r.data.rnc||{};
  return {
    icon:'⚠️',
    title:`${esc(r.data.front||'(sem frente)')} — ${esc(rc.id||'RNC')}`,
    badges:(rc.classificacao?`<span class="rnc-badge ${rc.classificacao}">${esc(rc.classificacao)}</span>`:'')+
           (rc.status?`<span class="rnc-badge ${rc.status}">${esc(rncStatusNome(rc.status))}</span>`:'')
  };
}
async function renderLancList(){
  const list=await getFilteredLancamentos();
  const wrap=document.getElementById('lancList');
  if(list.length===0){wrap.innerHTML='<p class="sub">Nenhum lançamento encontrado para os filtros atuais.</p>';return}
  wrap.innerHTML='';
  const editable=['PENDING_SYNC','SYNCING','SYNCED','SYNC_ERROR'];
  list.forEach(r=>{
    const line=lancLine(r);
    const el=document.createElement('div');
    el.className='lanc-item';
    const gearId='gear-'+r.id;
    const showGear=sessionProfile==='ADMIN' && editable.includes(r.status);
    el.innerHTML=`
      <div class="li-main"><b>${line.icon} ${line.title}</b><small>${esc(r.data.responsible||'—')} · ${r.data.date||'—'} · atualizado ${fmtDateTime(r.updatedAt)} · ${esc(r.deviceId)}</small></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        ${line.badges}
        <span class="status-badge ${r.status}">${statusLabel(r.status)}</span>
        ${r.status==='SYNC_ERROR'?'<button class="btn secondary" data-retry style="min-height:38px;padding:0 12px;font-size:11.5px">Tentar novamente</button>':''}
        ${r.status==='ENCAMINHADO'?'<button class="btn primary" data-cont style="min-height:38px;padding:0 12px;font-size:11.5px">▶ Continuar</button>':''}
        ${showGear?`<div class="dd-wrap"><button class="btn secondary" style="min-height:38px;min-width:38px;padding:0;font-size:14px" onclick="toggleDD('${gearId}')" title="Ações">⚙️</button><div class="dd-menu hidden" id="${gearId}"><button data-edit>✏️ Editar</button>${r.data.type==='RNC'?'<button data-rncstatus>🔀 Status RNC</button>':''}<button data-del class="danger-item">🗑️ Excluir</button></div></div>`:''}
      </div>`;
    if(r.status==='SYNC_ERROR'){el.querySelector('[data-retry]').onclick=async()=>{r.status='PENDING_SYNC';r.errorMsg=null;await idbPut(r);renderLancList();refreshSyncStatus();trySync()}}
    if(r.status==='ENCAMINHADO'){el.querySelector('[data-cont]').onclick=()=>continueEncaminhado(r.id)}
    const editBtn=el.querySelector('[data-edit]');
    if(editBtn)editBtn.onclick=()=>editLancamento(r.id);
    const rncStatusBtn=el.querySelector('[data-rncstatus]');
    if(rncStatusBtn)rncStatusBtn.onclick=()=>openRncStatusChange(r.id);
    const delBtn=el.querySelector('[data-del]');
    if(delBtn)delBtn.onclick=()=>deleteLancamento(r.id);
    wrap.appendChild(el);
  });
}
function statusLabel(s){return {DRAFT:'Rascunho',ENCAMINHADO:'Encaminhado',PENDING_SYNC:'Pendente',SYNCING:'Sincronizando',SYNCED:'Sincronizado',SYNC_ERROR:'Erro de sync'}[s]||s}

let editSnapshot=null;
function applyEditCancelUi(){
  const wrap=document.getElementById('btnCancelEditWrap');
  if(wrap)wrap.classList.toggle('hidden',!editSnapshot);
}
async function editLancamento(id){
  const all=await idbGetAll();
  const rec=all.find(r=>r.id===id);
  if(!rec){toast('Registro não encontrado.','err');return}
  editSnapshot=JSON.parse(JSON.stringify(rec));
  rec.status='DRAFT';
  await idbPut(rec);
  draft=rec;
  bindStep1();
  document.getElementById('comments').value=draft.data.comments||'';
  document.getElementById('unexpected').value=draft.data.unexpected||'';
  document.getElementById('pending').value=draft.data.pending||'';
  renderAttachments();
  showView('wizard');
  goStep(1,true);
  applyEditCancelUi();
  toast('Editando lançamento — ao finalizar, ele volta para a fila de sincronização. Use "Cancelar edição" para descartar as alterações.','ok');
}
async function cancelEditLancamento(){
  if(!editSnapshot)return;
  const ok=await askConfirm('Cancelar edição','As alterações feitas nesta edição serão descartadas e o registro voltará ao estado anterior. Deseja continuar?');
  if(!ok)return;
  await idbPut(editSnapshot);
  editSnapshot=null;
  draft=null;
  applyEditCancelUi();
  showView('lanc');
  toast('Edição cancelada — o registro voltou ao estado anterior.','ok');
}
async function deleteLancamento(id){
  if(await askConfirm('Excluir lançamento','Tem certeza que deseja excluir este lançamento definitivamente? Esta ação não pode ser desfeita.')){
    await idbDelete(id);
    renderLancList();
    if(document.getElementById('view-dash').classList.contains('active'))renderDashboard();
    toast('Lançamento excluído.','ok');
  }
}

/* ---------- exportação Excel / PDF ---------- */
function lancExportRows(list){
  return list.map(r=>({
    'Data':r.data.date||'',
    'Tipo':r.data.type==='AVANCO'?'Avanço':'RNC',
    'Responsável':r.data.responsible||'',
    'Frente':r.data.front||'',
    'Turno':r.data.shift||'',
    'Status':statusLabel(r.status),
    'ID/RNC':r.data.type==='RNC'?(r.data.rnc.id||''):('AV-'+r.id.slice(0,8).toUpperCase()),
    'Classificação RNC':r.data.type==='RNC'?(r.data.rnc.classificacao||''):'',
    'Lançamentos':r.data.type==='AVANCO'?(r.data.items||[]).reduce((a,it)=>a+(it.lancamentos?it.lancamentos.length:0),0):'',
    'Atualizado em':fmtDateTime(r.updatedAt)
  }));
}
function lancItemRows(list){
  const rows=[];
  list.filter(r=>r.data.type==='AVANCO').forEach(r=>{
    (r.data.items||[]).forEach(it=>{
      const disc=discByCod(it.discCod)||{nome:it.discCod,und:''};
      (it.lancamentos||[]).forEach(l=>{
        rows.push({
          'Data':r.data.date||'','Frente':r.data.front||'','Descrição Montagem':disc.nome,
          'DN':l.dn||'','Folha':l.folha||'','Tag':l.tag||'','Quantidade':lancQtd(l),'Unidade':disc.und,
          'Acoplamento':l.acoplamento||'','Solda':l.solda||''
        });
      });
    });
  });
  return rows;
}
async function exportLancExcel(){
  if(typeof XLSX==='undefined'){toast('Biblioteca de exportação não carregada (requer internet na primeira vez).','err');return}
  const list=await getFilteredLancamentos();
  if(list.length===0){toast('Nenhum lançamento para exportar.','err');return}
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(lancExportRows(list)),'Registros');
  const itemRows=lancItemRows(list);
  if(itemRows.length)XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(itemRows),'Itens detalhados');
  XLSX.writeFile(wb,'GestaoOS_MOA_Lancamentos_'+todayLocalIso()+'.xlsx');
  toast('Excel exportado.','ok');
}
async function exportLancPdf(){
  if(typeof window.jspdf==='undefined'){toast('Biblioteca de exportação não carregada (requer internet na primeira vez).','err');return}
  const list=await getFilteredLancamentos();
  if(list.length===0){toast('Nenhum lançamento para exportar.','err');return}
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'landscape'});
  doc.setFontSize(14);doc.text('Gestão de OS · MOA — Lançamentos (AVCB Gasômetro)',14,14);
  doc.setFontSize(9);doc.text('Gerado em '+fmtDateTime(nowIso())+' · '+list.length+' registro(s)',14,20);
  const rows=lancExportRows(list).map(o=>Object.values(o));
  doc.autoTable({head:[Object.keys(lancExportRows(list.slice(0,1))[0]||{})],body:rows,startY:26,styles:{fontSize:8}});
  doc.save('GestaoOS_MOA_Lancamentos_'+todayLocalIso()+'.pdf');
  toast('PDF exportado.','ok');
}

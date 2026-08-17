/* =========================================================
   CURVA S — Avanço Físico (ApexCharts)
   ========================================================= */
const CURVA_KEY='avancopro_curvas_v1';
const SEMANA_BASE_KEY='gestaoos_semana_base_v1';
function round2(n){return Math.round((n||0)*100)/100}
function fmtDateBR(iso){if(!iso)return '—';const p=iso.split('-');return p[2]+'/'+p[1]}
function curvaStatusLabel(s){return {EM_DIA:'Em dia',ATRASADO:'Atrasado',ADIANTADO:'Adiantado',SEM_ATUALIZACAO:'Sem atualização'}[s]||s}
function addDaysIso(iso,days){
  const [y,m,d]=iso.split('-').map(Number);
  const dt=new Date(Date.UTC(y,m-1,d));
  dt.setUTCDate(dt.getUTCDate()+days);
  return dt.toISOString().slice(0,10);
}

const DEFAULT_CURVA={
  header:{projeto:'AVCB Gasômetro',contrato:'Contrato 4821',disciplina:'Tubulação — Combate a Incêndio',periodoRef:'Mar–Ago/2026',linhaBase:'Rev. 00',responsavel:'',dataAtualizacao:null},
  semanas:[
    {id:'seed-1',semana:1,dataIni:'2026-03-02',dataFim:'2026-03-08',plan:8,real:7.5,obs:'',status:'EM_DIA'},
    {id:'seed-2',semana:2,dataIni:'2026-03-09',dataFim:'2026-03-15',plan:8,real:8.3,obs:'',status:'ADIANTADO'},
    {id:'seed-3',semana:3,dataIni:'2026-03-16',dataFim:'2026-03-22',plan:9,real:6,obs:'Atraso na entrega de materiais (flanges DN250).',status:'ATRASADO'},
    {id:'seed-4',semana:4,dataIni:'2026-03-23',dataFim:'2026-03-29',plan:9,real:8.8,obs:'',status:'EM_DIA'},
    {id:'seed-5',semana:5,dataIni:'2026-03-30',dataFim:'2026-04-05',plan:10,real:0,obs:'',status:'SEM_ATUALIZACAO'},
    {id:'seed-6',semana:6,dataIni:'2026-04-06',dataFim:'2026-04-12',plan:10,real:9.5,obs:'',status:'EM_DIA'}
  ]
};
let CURVA=null;
function loadCurvaFromCache(){
  try{const raw=localStorage.getItem(CURVA_KEY);if(raw){CURVA=JSON.parse(raw);return}}catch(e){}
  CURVA=JSON.parse(JSON.stringify(DEFAULT_CURVA));
}
async function loadCurva(){
  loadCurvaFromCache();
  if(!sessionProfile)return;
  if(!(await isSupabaseReachable())){supaErrToast({message:'servidor inacessível'},'Curva S: usando dados salvos neste dispositivo');return}
  try{
    const [{data:headerRow,error:e1},{data:semanasRows,error:e2}]=await Promise.all([
      supabase.from('curva_s_header').select('*').eq('id',1).maybeSingle(),
      supabase.from('curva_s_semanas').select('*').order('semana')
    ]);
    if(e1||e2)throw(e1||e2);
    CURVA={
      header:headerRow?{
        projeto:headerRow.projeto||'',contrato:headerRow.contrato||'',disciplina:headerRow.disciplina||'',
        periodoRef:headerRow.periodo_ref||'',linhaBase:headerRow.linha_base||'',responsavel:headerRow.responsavel||'',
        dataAtualizacao:headerRow.data_atualizacao||null
      }:CURVA.header,
      semanas:(semanasRows&&semanasRows.length)?semanasRows.map(w=>({id:w.id,semana:w.semana,dataIni:w.data_ini,dataFim:w.data_fim,plan:+w.plan||0,real:+w.real||0,obs:w.obs||'',status:w.status})):CURVA.semanas
    };
    saveCurva();
  }catch(e){supaErrToast(e,'Curva S: usando dados salvos neste dispositivo')}
}
function saveCurva(){localStorage.setItem(CURVA_KEY,JSON.stringify(CURVA))}
async function syncCurvaHeader(){
  if(!(await isSupabaseReachable())){toast('Servidor inacessível — cabeçalho salvo só neste dispositivo.','err');return}
  try{
    const h=CURVA.header;
    const {error}=await supabase.from('curva_s_header').upsert({
      id:1,projeto:h.projeto,contrato:h.contrato,disciplina:h.disciplina,periodo_ref:h.periodoRef,
      linha_base:h.linhaBase,responsavel:h.responsavel,data_atualizacao:h.dataAtualizacao
    });
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível salvar o cabeçalho no servidor')}
}
async function syncCurvaSemanaUpsert(w){
  if(!w)return;
  if(!(await isSupabaseReachable())){toast('Servidor inacessível — semana salva só neste dispositivo.','err');return}
  try{
    const {error}=await supabase.from('curva_s_semanas').upsert({
      id:w.id,semana:w.semana,data_ini:w.dataIni,data_fim:w.dataFim,plan:w.plan,real:w.real,obs:w.obs,status:w.status
    });
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível salvar a semana no servidor')}
}
async function syncCurvaSemanaDelete(id){
  if(!(await isSupabaseReachable())){toast('Servidor inacessível — remoção não sincronizada.','err');return}
  try{
    const {error}=await supabase.from('curva_s_semanas').delete().eq('id',id);
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível remover a semana no servidor')}
}

/* ---------- semana base de referência ---------- */
let SEMANA_BASE=null;
function loadSemanaBaseFromCache(){
  try{const raw=localStorage.getItem(SEMANA_BASE_KEY);if(raw){SEMANA_BASE=JSON.parse(raw);return}}catch(e){}
  SEMANA_BASE=null;
}
async function loadSemanaBase(){
  loadSemanaBaseFromCache();
  if(!sessionProfile)return;
  if(!(await isSupabaseReachable()))return;
  try{
    const {data,error}=await supabase.from('curva_s_semana_base').select('*').eq('id',1).maybeSingle();
    if(error)throw error;
    if(data && data.semana_inicial!=null && data.data_inicial){
      SEMANA_BASE={semanaInicial:data.semana_inicial,dataInicial:data.data_inicial};
      saveSemanaBase();
    }
  }catch(e){supaErrToast(e,'Semana base: usando dado salvo neste dispositivo')}
}
function saveSemanaBase(){localStorage.setItem(SEMANA_BASE_KEY,JSON.stringify(SEMANA_BASE))}
async function syncSemanaBase(){
  if(!(await isSupabaseReachable())){toast('Servidor inacessível — semana base salva só neste dispositivo.','err');return}
  try{
    const {error}=await supabase.from('curva_s_semana_base').upsert({id:1,semana_inicial:SEMANA_BASE.semanaInicial,data_inicial:SEMANA_BASE.dataInicial});
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível salvar a semana base no servidor')}
}
function mondayOfWeek(dateStr){
  const [y,m,d]=dateStr.split('-').map(Number);
  const dt=new Date(Date.UTC(y,m-1,d));
  const dow=dt.getUTCDay();
  const isoDow=dow===0?7:dow;
  dt.setUTCDate(dt.getUTCDate()-isoDow+1);
  return dt.toISOString().slice(0,10);
}
function semanaToDates(n){
  if(!SEMANA_BASE || !SEMANA_BASE.dataInicial)return {dataIni:'',dataFim:''};
  const offsetDays=(n-(SEMANA_BASE.semanaInicial||1))*7;
  const dataIni=addDaysIso(SEMANA_BASE.dataInicial,offsetDays);
  const dataFim=addDaysIso(dataIni,6);
  return {dataIni,dataFim};
}
function currentSemanaFromBase(){
  if(!SEMANA_BASE || !SEMANA_BASE.dataInicial)return null;
  const today=todayLocalIso();
  const [y1,m1,d1]=SEMANA_BASE.dataInicial.split('-').map(Number);
  const [y2,m2,d2]=today.split('-').map(Number);
  const diffDays=Math.floor((Date.UTC(y2,m2-1,d2)-Date.UTC(y1,m1-1,d1))/86400000);
  return (SEMANA_BASE.semanaInicial||1)+Math.floor(diffDays/7);
}
function openSemanaBaseForm(){
  if(!SEMANA_BASE)loadSemanaBase();
  document.getElementById('sbSemana').value=SEMANA_BASE?SEMANA_BASE.semanaInicial:1;
  document.getElementById('sbData').value=SEMANA_BASE?SEMANA_BASE.dataInicial:'';
  previewSemanaBaseRange();
  document.getElementById('semanaBaseOverlay').classList.add('open');
}
function closeSemanaBaseForm(){document.getElementById('semanaBaseOverlay').classList.remove('open')}
function previewSemanaBaseRange(){
  const val=document.getElementById('sbData').value;
  const prev=document.getElementById('sbPreview');
  if(!val){prev.textContent='—';return}
  const mon=mondayOfWeek(val);
  const sun=addDaysIso(mon,6);
  prev.innerHTML='<b>'+fmtDateBR(mon)+' – '+fmtDateBR(sun)+'</b>';
}
async function submitSemanaBaseForm(){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  const semanaInicial=parseInt(document.getElementById('sbSemana').value,10)||1;
  const rawDate=document.getElementById('sbData').value;
  if(!rawDate){toast('Escolha um dia dentro da semana de referência.','err');return}
  const dataInicial=mondayOfWeek(rawDate);
  SEMANA_BASE={semanaInicial,dataInicial};
  saveSemanaBase();
  closeSemanaBaseForm();
  updateSemanaBaseBadge();
  if(!CURVA)await loadCurva();
  if(document.getElementById('curvaChart'))renderChart();
  toast('Semana base definida ('+fmtDateBR(dataInicial)+' – '+fmtDateBR(addDaysIso(dataInicial,6))+'). Datas serão sugeridas automaticamente.','ok');
  await syncSemanaBase();
}
function updateSemanaBaseBadge(){
  const el=document.getElementById('semanaBaseBadge');
  if(!el)return;
  el.textContent=SEMANA_BASE?('📅 Base: S'+SEMANA_BASE.semanaInicial+' = '+fmtDateBR(SEMANA_BASE.dataInicial)):'📅 Semana base';
}

function curvaSorted(){return [...CURVA.semanas].sort((a,b)=>a.semana-b.semana)}
function curvaCalc(){
  let planAcum=0,realAcum=0;
  return curvaSorted().map(w=>{
    planAcum=round2(planAcum+(+w.plan||0));
    realAcum=round2(realAcum+(+w.real||0));
    const desvioSem=round2((+w.real||0)-(+w.plan||0));
    const desvioAcum=round2(realAcum-planAcum);
    return {...w,planAcum,realAcum,desvioSem,desvioAcum};
  });
}
function wouldExceed100(candidateSemanas){
  let p=0,r=0;
  for(const w of [...candidateSemanas].sort((a,b)=>a.semana-b.semana)){
    p+=(+w.plan||0);r+=(+w.real||0);
    if(p>100.01||r>100.01)return true;
  }
  return false;
}
function autoStatus(plan,real){
  if(!real)return 'SEM_ATUALIZACAO';
  if(real>plan+0.01)return 'ADIANTADO';
  if(real<plan-0.01)return 'ATRASADO';
  return 'EM_DIA';
}

/* ---------- render ---------- */
async function renderCurvas(){
  if(!CURVA)await loadCurva();
  if(!SEMANA_BASE)await loadSemanaBase();
  applyProfileUI();
  updateSemanaBaseBadge();
  renderCurvaHeader();
  applyHeaderUiState();
  renderCurvaKpis();
  renderCurvaTotalBanner();
  renderCurvaTable();
  renderChart();
}
function renderCurvaHeader(){
  const h=CURVA.header;
  document.getElementById('curvaHeaderView').innerHTML=`
    <div class="sum-item"><b>Projeto</b><span style="font-size:14px">${esc(h.projeto||'—')}</span></div>
    <div class="sum-item"><b>Contrato / Empreendimento</b><span style="font-size:14px">${esc(h.contrato||'—')}</span></div>
    <div class="sum-item"><b>Disciplina / Frente</b><span style="font-size:14px">${esc(h.disciplina||'—')}</span></div>
    <div class="sum-item"><b>Período de referência</b><span style="font-size:14px">${esc(h.periodoRef||'—')}</span></div>
    <div class="sum-item"><b>Linha de base</b><span style="font-size:14px">${esc(h.linhaBase||'—')}</span></div>
    <div class="sum-item"><b>Responsável / Atualização</b><span style="font-size:12.5px">${esc(h.responsavel||'—')}${h.dataAtualizacao?' · '+fmtDateTime(h.dataAtualizacao):''}</span></div>`;
}
let curvaHeaderCollapsed=false, curvaHeaderPinned=false;
function toggleHeaderCollapse(){
  curvaHeaderCollapsed=!curvaHeaderCollapsed;
  localStorage.setItem('curva_header_collapsed',curvaHeaderCollapsed?'1':'');
  applyHeaderUiState();
}
function toggleHeaderPin(){
  curvaHeaderPinned=!curvaHeaderPinned;
  localStorage.setItem('curva_header_pinned',curvaHeaderPinned?'1':'');
  applyHeaderUiState();
}
function applyHeaderUiState(){
  curvaHeaderCollapsed=localStorage.getItem('curva_header_collapsed')==='1';
  curvaHeaderPinned=localStorage.getItem('curva_header_pinned')==='1';
  const grid=document.getElementById('curvaHeaderView');
  const block=document.getElementById('curvaHeaderBlock');
  if(!grid||!block)return;
  grid.classList.toggle('hidden',curvaHeaderCollapsed);
  block.classList.toggle('curva-pinned',curvaHeaderPinned);
  const collapseBtn=document.getElementById('btnCollapseHeader');
  if(collapseBtn)collapseBtn.textContent=curvaHeaderCollapsed?'▸ Exibir':'▾ Recolher';
  const pinBtn=document.getElementById('btnPinHeader');
  if(pinBtn){pinBtn.classList.toggle('active',curvaHeaderPinned);pinBtn.textContent=curvaHeaderPinned?'📌 Fixado':'📌 Fixar'}
}
function renderCurvaKpis(){
  const calc=curvaCalc();
  const last=calc[calc.length-1];
  const planAcum=last?last.planAcum:0, realAcum=last?last.realAcum:0, desvio=last?last.desvioAcum:0;
  const critico=desvio<-5;
  const statusGeral=desvio>=0?'Adiantado / em dia':(critico?'Crítico':'Atrasado');
  const statusColor=desvio>=0?'var(--green-dark)':(critico?'var(--red)':'var(--yellow)');
  document.getElementById('curvaKpis').innerHTML=`
    <div class="kpi-card" style="--kpi-accent:var(--info-blue)"><div class="kl">Planejado acumulado</div><div class="kv">${fmtNum(planAcum)}<span>%</span></div><div class="ks">até a última semana lançada</div></div>
    <div class="kpi-card" style="--kpi-accent:var(--green-dark)"><div class="kl">Realizado acumulado</div><div class="kv">${fmtNum(realAcum)}<span>%</span></div><div class="ks">até a última semana lançada</div></div>
    <div class="kpi-card" style="--kpi-accent:${desvio<0?'var(--red)':'var(--green-dark)'}"><div class="kl">Desvio acumulado</div><div class="kv" style="color:${desvio<0?'var(--red)':'var(--green-dark)'}">${desvio>=0?'+':''}${fmtNum(desvio)}<span>%</span></div><div class="ks">realizado − planejado</div></div>
    <div class="kpi-card" style="--kpi-accent:${statusColor}"><div class="kl">Status geral</div><div class="kv" style="font-size:19px;color:${statusColor}">${statusGeral}</div><div class="ks">${calc.length} semana(s) lançada(s)</div></div>`;
}
function renderCurvaTotalBanner(){
  const totalPlan=CURVA.semanas.reduce((a,w)=>a+(+w.plan||0),0);
  const banner=document.getElementById('curvaTotalBanner');
  if(Math.abs(totalPlan-100)<0.01){banner.innerHTML='';return}
  const falta=round2(100-totalPlan);
  banner.innerHTML=`<div class="banner banner-warn show"><span>⚠️</span><span>Total de peso planejado cadastrado: <b>${fmtNum(totalPlan)}%</b> — ${falta>0?'faltam '+fmtNum(falta)+'% para completar 100%.':'excede em '+fmtNum(-falta)+'% os 100% — revise os pesos semanais.'}</span></div>`;
}
let curvaStatusFilter='ALL';
function setCurvaStatusFilter(s){curvaStatusFilter=s;document.querySelectorAll('#curvaStatusFilters .chip').forEach(c=>c.classList.toggle('active',c.dataset.s===s));renderCurvaTable()}
function renderCurvaTable(){
  const calc=curvaCalc();
  const wkFrom=parseInt(document.getElementById('curvaWkFrom').value,10)||null;
  const wkTo=parseInt(document.getElementById('curvaWkTo').value,10)||null;
  const filtered=calc.filter(w=>{
    if(curvaStatusFilter!=='ALL' && w.status!==curvaStatusFilter)return false;
    if(wkFrom && w.semana<wkFrom)return false;
    if(wkTo && w.semana>wkTo)return false;
    return true;
  });
  const tbody=document.getElementById('curvaTableBody');
  if(filtered.length===0){tbody.innerHTML='<tr><td colspan="11" style="text-align:center;color:var(--text-dim)">Nenhuma semana cadastrada para os filtros atuais.</td></tr>';return}
  const canEdit=sessionProfile==='ADMIN';
  tbody.innerHTML=filtered.map(w=>{
    const noUpdate=(!w.real||w.real===0) && w.dataFim && w.dataFim<todayLocalIso();
    const rowCls=w.desvioAcum<-5?'curva-warn':(noUpdate?'curva-noupdate':'');
    return `<tr class="${rowCls}">
      <td>${w.semana}</td>
      <td>${fmtDateBR(w.dataIni)} – ${fmtDateBR(w.dataFim)}</td>
      <td>${fmtNum(w.plan)}%</td>
      <td>${fmtNum(w.real)}%${noUpdate?' <span class="curva-flag">⚠</span>':''}</td>
      <td>${fmtNum(w.planAcum)}%</td>
      <td>${fmtNum(w.realAcum)}%</td>
      <td class="${w.desvioSem<0?'curva-flag':''}">${w.desvioSem>=0?'+':''}${fmtNum(w.desvioSem)}%</td>
      <td class="${w.desvioAcum<-5?'curva-flag':''}">${w.desvioAcum>=0?'+':''}${fmtNum(w.desvioAcum)}%</td>
      <td><span class="curva-status-badge ${w.status}">${curvaStatusLabel(w.status)}</span></td>
      <td style="max-width:160px;font-size:11.5px;color:var(--text-lo)">${esc(w.obs||'—')}</td>
      <td>${canEdit?`<button class="rm-btn" onclick="openWeekForm('${w.id}')" title="Editar">✏️</button><button class="rm-btn" onclick="deleteWeek('${w.id}')" title="Excluir">×</button>`:''}</td>
    </tr>`;
  }).join('');
}

/* ---------- formulário de semana (individual) ---------- */
let editingWeekId=null;
function nextSemanaNumber(){return CURVA.semanas.reduce((a,w)=>Math.max(a,w.semana),0)+1}
function openWeekForm(id){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  editingWeekId=id||null;
  const w=id?CURVA.semanas.find(x=>x.id===id):null;
  document.getElementById('weekFormTitle').textContent=id?'✏️ Editar semana':'＋ Adicionar semana';
  const semanaVal=w?w.semana:nextSemanaNumber();
  document.getElementById('wSemana').value=semanaVal;
  document.getElementById('wStatus').value=w?w.status:'EM_DIA';
  if(w){
    document.getElementById('wDataIni').value=w.dataIni||'';
    document.getElementById('wDataFim').value=w.dataFim||'';
  }else{
    const d=semanaToDates(semanaVal);
    document.getElementById('wDataIni').value=d.dataIni;
    document.getElementById('wDataFim').value=d.dataFim;
  }
  document.getElementById('wPlan').value=w?w.plan:'';
  document.getElementById('wReal').value=w?w.real:'';
  document.getElementById('wObs').value=w?w.obs:'';
  document.getElementById('weekFormHint').textContent='';
  document.getElementById('wSemana').oninput=()=>{
    if(!editingWeekId && SEMANA_BASE){
      const sem=parseInt(document.getElementById('wSemana').value,10);
      if(sem){
        const dd=semanaToDates(sem);
        document.getElementById('wDataIni').value=dd.dataIni;
        document.getElementById('wDataFim').value=dd.dataFim;
      }
    }
  };
  document.getElementById('weekOverlay').classList.add('open');
}
function closeWeekForm(){document.getElementById('weekOverlay').classList.remove('open')}
async function submitWeekForm(){
  const hint=document.getElementById('weekFormHint');
  const semana=parseInt(document.getElementById('wSemana').value,10);
  const dataIni=document.getElementById('wDataIni').value;
  const dataFim=document.getElementById('wDataFim').value;
  const plan=parseFloat(document.getElementById('wPlan').value)||0;
  const real=parseFloat(document.getElementById('wReal').value)||0;
  const status=document.getElementById('wStatus').value;
  const obs=document.getElementById('wObs').value;
  if(!semana||semana<1){hint.textContent='Informe um número de semana válido.';return}
  if(plan<0||real<0){hint.textContent='Valores negativos não são permitidos.';return}
  const dup=CURVA.semanas.find(w=>w.semana===semana && w.id!==editingWeekId);
  if(dup){hint.textContent='Já existe um lançamento para a semana '+semana+'. Edite o existente.';return}
  const candidate=CURVA.semanas.filter(w=>w.id!==editingWeekId).concat([{semana,plan,real}]);
  if(wouldExceed100(candidate)){hint.textContent='O acumulado (planejado ou realizado) ultrapassaria 100%. Ajuste os valores.';return}
  let savedWeek;
  if(editingWeekId){
    savedWeek=Object.assign(CURVA.semanas.find(x=>x.id===editingWeekId),{semana,dataIni,dataFim,plan,real,status,obs});
  }else{
    savedWeek={id:uuid(),semana,dataIni,dataFim,plan,real,status,obs};
    CURVA.semanas.push(savedWeek);
  }
  saveCurva();closeWeekForm();renderCurvas();
  toast('Semana salva. Acumulados recalculados.','ok');
  await syncCurvaSemanaUpsert(savedWeek);
}
async function deleteWeek(id){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  if(await askConfirm('Excluir semana','Remover este lançamento semanal? O acumulado será recalculado automaticamente.')){
    CURVA.semanas=CURVA.semanas.filter(w=>w.id!==id);
    saveCurva();renderCurvas();
    toast('Semana removida.','ok');
    await syncCurvaSemanaDelete(id);
  }
}

/* ---------- preenchimento rápido (múltiplas semanas) ---------- */
let quickRowsData=[];
function openQuickFill(){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  const start=nextSemanaNumber();
  quickRowsData=[{semana:start,plan:0,real:0},{semana:start+1,plan:0,real:0},{semana:start+2,plan:0,real:0}];
  renderQuickRows();
  document.getElementById('quickFillHint').textContent='';
  document.getElementById('quickFillOverlay').classList.add('open');
}
function closeQuickFill(){document.getElementById('quickFillOverlay').classList.remove('open')}
function addQuickRow(){
  const maxSem=quickRowsData.length?Math.max(...quickRowsData.map(r=>r.semana)):nextSemanaNumber()-1;
  quickRowsData.push({semana:maxSem+1,plan:0,real:0});
  renderQuickRows();
}
function renderQuickRows(){
  document.getElementById('quickRows').innerHTML=quickRowsData.map((r,idx)=>`
    <div class="lanc-row" data-qidx="${idx}">
      <div class="qfield2 sm"><label>Semana nº</label><input data-qf="semana" type="number" min="1" value="${r.semana}"></div>
      <div class="qfield2 sm"><label>Planejado (%)</label><input data-qf="plan" type="number" min="0" step="0.01" value="${r.plan}"></div>
      <div class="qfield2 sm"><label>Realizado (%)</label><input data-qf="real" type="number" min="0" step="0.01" value="${r.real}"></div>
      <button class="rm-btn" data-qrm title="Remover linha">×</button>
    </div>`).join('');
  document.querySelectorAll('#quickRows [data-qf]').forEach(inp=>{
    inp.addEventListener('input',()=>{
      const idx=+inp.closest('.lanc-row').dataset.qidx;
      const f=inp.dataset.qf;
      quickRowsData[idx][f]=f==='semana'?(parseInt(inp.value,10)||0):(parseFloat(inp.value)||0);
    });
  });
  document.querySelectorAll('#quickRows [data-qrm]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=+btn.closest('.lanc-row').dataset.qidx;
      quickRowsData.splice(idx,1);
      renderQuickRows();
    });
  });
}
async function submitQuickFill(){
  const hint=document.getElementById('quickFillHint');
  hint.textContent='';
  if(quickRowsData.length===0){hint.textContent='Adicione ao menos uma linha.';return}
  const seen=new Set();
  for(const r of quickRowsData){
    if(!r.semana||r.semana<1){hint.textContent='Há uma semana inválida na lista.';return}
    if(seen.has(r.semana)){hint.textContent='Semana '+r.semana+' repetida na lista.';return}
    seen.add(r.semana);
    if(CURVA.semanas.find(w=>w.semana===r.semana)){hint.textContent='A semana '+r.semana+' já existe — remova-a da lista ou edite-a na tabela.';return}
    if(r.plan<0||r.real<0){hint.textContent='Valores negativos não são permitidos.';return}
  }
  const candidate=CURVA.semanas.concat(quickRowsData.map(r=>({semana:r.semana,plan:r.plan,real:r.real})));
  if(wouldExceed100(candidate)){hint.textContent='O acumulado total ultrapassaria 100%. Ajuste os valores.';return}
  const newWeeks=quickRowsData.map(r=>{
    const d=semanaToDates(r.semana);
    return {id:uuid(),semana:r.semana,dataIni:d.dataIni,dataFim:d.dataFim,plan:r.plan,real:r.real,status:autoStatus(r.plan,r.real),obs:''};
  });
  newWeeks.forEach(w=>CURVA.semanas.push(w));
  saveCurva();closeQuickFill();renderCurvas();
  toast(quickRowsData.length+' semana(s) adicionada(s) de uma vez.','ok');
  for(const w of newWeeks)await syncCurvaSemanaUpsert(w);
}

/* ---------- cabeçalho ---------- */
function openHeaderForm(){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  const h=CURVA.header;
  document.getElementById('hProjeto').value=h.projeto||'';
  document.getElementById('hContrato').value=h.contrato||'';
  document.getElementById('hDisciplina').value=h.disciplina||'';
  document.getElementById('hPeriodo').value=h.periodoRef||'';
  document.getElementById('hLinhaBase').value=h.linhaBase||'';
  document.getElementById('hResponsavel').value=h.responsavel||'';
  document.getElementById('headerOverlay').classList.add('open');
}
function closeHeaderForm(){document.getElementById('headerOverlay').classList.remove('open')}
async function submitHeaderForm(){
  CURVA.header={
    projeto:document.getElementById('hProjeto').value,
    contrato:document.getElementById('hContrato').value,
    disciplina:document.getElementById('hDisciplina').value,
    periodoRef:document.getElementById('hPeriodo').value,
    linhaBase:document.getElementById('hLinhaBase').value,
    responsavel:document.getElementById('hResponsavel').value,
    dataAtualizacao:nowIso()
  };
  saveCurva();closeHeaderForm();renderCurvas();
  toast('Cabeçalho atualizado.','ok');
  await syncCurvaHeader();
}

/* ---------- gráfico (ApexCharts) ---------- */
let curvaChart=null, curvaChartFullInst=null;
let labelsEnabled=false, labelPos='top';

function computeChartData(calc){
  // Mostra exatamente as semanas cadastradas em "Lançamentos semanais" —
  // nada de semanas extrapoladas/projetadas automaticamente.
  const categories=calc.map(w=>'S'+w.semana);
  let lastFilledIdx=-1;
  calc.forEach((w,i)=>{if((+w.real||0)>0 || w.status!=='SEM_ATUALIZACAO')lastFilledIdx=i});
  const planned=calc.map(w=>w.planAcum);
  const realized=calc.map((w,i)=>i<=lastFilledIdx?w.realAcum:null);
  const planWeekly=calc.map(w=>w.plan);
  const realWeekly=calc.map((w,i)=>i<=lastFilledIdx?w.real:null);
  return {categories,planned,realized,planWeekly,realWeekly};
}
function dataLabelOffsets(pos){
  return {top:{offsetX:0,offsetY:-10},bottom:{offsetX:0,offsetY:14},center:{offsetX:0,offsetY:0},left:{offsetX:-16,offsetY:0},right:{offsetX:16,offsetY:0}}[pos]||{offsetX:0,offsetY:-10};
}
function buildChartOptions(){
  const calc=curvaCalc();
  const {categories,planned,realized,planWeekly,realWeekly}=computeChartData(calc);
  const off=dataLabelOffsets(labelPos);

  const maxWeeklyRaw=Math.max(1,...calc.map(w=>Math.max(+w.plan||0,+w.real||0)));
  const maxWeekly=Math.ceil((maxWeeklyRaw*1.4)/5)*5;

  const series=[
    {name:'Planejado acumulado',type:'line',data:planned},
    {name:'Realizado acumulado',type:'line',data:realized},
    {name:'Planejado semanal',type:'column',data:planWeekly},
    {name:'Realizado semanal',type:'column',data:realWeekly}
  ];

  const colorMap={'Planejado acumulado':'#002B5C','Realizado acumulado':'#6FA834','Planejado semanal':'#2E7BC4','Realizado semanal':'#92D050'};
  const colors=series.map(s=>colorMap[s.name]);
  const strokeWidth=series.map(s=>s.type!=='line'?0:3);
  const dashArr=series.map(()=>0);
  const fillOpacity=series.map(s=>s.type==='column'?0.6:1);
  const markerSizes=series.map(s=>s.type==='line'?4:0);

  let firstAccumSeen=false, firstWeeklySeen=false;
  const yaxis=series.map(s=>{
    const isWeekly=s.type==='column';
    let show=false;
    if(isWeekly && !firstWeeklySeen){show=true;firstWeeklySeen=true}
    if(!isWeekly && !firstAccumSeen){show=true;firstAccumSeen=true}
    return {
      seriesName:s.name,show,opposite:isWeekly,min:0,max:isWeekly?maxWeekly:100,
      title:show?{text:isWeekly?'Avanço semanal (%)':'Avanço acumulado (%)'}:undefined,
      labels:{formatter:v=>(v===null||v===undefined)?'':v.toFixed(2)+'%'}
    };
  });

  const xAnnotations=[];
  const curSemana=currentSemanaFromBase();
  if(curSemana!==null && categories.indexOf('S'+curSemana)>=0){
    xAnnotations.push({
      x:'S'+curSemana,borderColor:'#002B5C',strokeDashArray:4,
      label:{text:'📍 Semana atual (S'+curSemana+')',orientation:'horizontal',offsetY:-4,style:{color:'#fff',background:'#002B5C',fontSize:'9px',fontWeight:700}}
    });
  }

  return {
    chart:{type:'line',height:440,fontFamily:'Inter, sans-serif',toolbar:{show:true,tools:{download:true,zoom:true,zoomin:true,zoomout:true,pan:true,reset:true}}},
    series,colors,
    stroke:{curve:'smooth',width:strokeWidth,dashArray:dashArr},
    fill:{opacity:fillOpacity},
    plotOptions:{bar:{columnWidth:'55%',borderRadius:2}},
    markers:{size:markerSizes,hover:{size:6}},
    xaxis:{categories,title:{text:'Semana'}},
    yaxis,
    dataLabels:{
      enabled:labelsEnabled,
      enabledOnSeries:[0,1],
      formatter:v=>(v===null||v===undefined)?'':v.toFixed(2)+'%',
      offsetX:off.offsetX,offsetY:off.offsetY,
      style:{fontSize:'10px',fontWeight:700}
    },
    grid:{borderColor:'#D9E8CE',strokeDashArray:3,yaxis:{lines:{show:true}},xaxis:{lines:{show:false}}},
    legend:{position:'top',horizontalAlign:'center',fontSize:'12px',markers:{radius:12}},
    tooltip:{
      shared:true,
      custom:function({dataPointIndex}){
        const w=calc[dataPointIndex];
        if(!w)return '<div style="padding:8px 10px;font-family:Inter,sans-serif;font-size:12px">Semana projetada (tendência)</div>';
        let alertLine='';
        if(w.desvioAcum<-5){
          const critico=w.desvioAcum<=-15;
          alertLine=`<div style="margin-top:8px;padding:6px 8px;border-radius:6px;background:${critico?'rgba(229,72,77,.12)':'rgba(242,179,61,.18)'};color:${critico?'#8c2226':'#7a5a10'};font-weight:700;font-size:11px">${critico?'🔴 Crítico':'🟡 Atenção'} — ${Math.abs(w.desvioAcum).toFixed(1)}% abaixo do planejado acumulado</div>`;
        }
        return `<div style="padding:10px 12px;font-family:Inter,sans-serif;font-size:12px;line-height:1.7">
          <b>Semana ${w.semana}</b> (${fmtDateBR(w.dataIni)}–${fmtDateBR(w.dataFim)})<br>
          Planejado semanal: <b>${fmtNum(w.plan)}%</b> · Realizado semanal: <b>${fmtNum(w.real)}%</b><br>
          Planejado acumulado: <b>${fmtNum(w.planAcum)}%</b><br>
          Realizado acumulado: <b>${fmtNum(w.realAcum)}%</b><br>
          Desvio acumulado: <b style="color:${w.desvioAcum<0?'#E5484D':'#6FA834'}">${w.desvioAcum>=0?'+':''}${fmtNum(w.desvioAcum)}%</b>
          ${alertLine}
        </div>`;
      }
    },
    annotations:{xaxis:xAnnotations},
    responsive:[{breakpoint:760,options:{chart:{height:320},legend:{fontSize:'10px'}}}]
  };
}
function renderChart(){
  const opts=buildChartOptions();
  const el=document.getElementById('curvaChart');
  if(!el)return;
  if(curvaChart){curvaChart.updateOptions(opts,true,true)}
  else{curvaChart=new ApexCharts(el,opts);curvaChart.render()}
}
function expandChart(){
  document.getElementById('chartFullOverlay').classList.add('open');
  setTimeout(()=>{
    const opts=buildChartOptions();
    opts.chart.height='100%';
    if(curvaChartFullInst){curvaChartFullInst.destroy()}
    curvaChartFullInst=new ApexCharts(document.getElementById('curvaChartFull'),opts);
    curvaChartFullInst.render();
  },60);
}
function closeExpandChart(){
  document.getElementById('chartFullOverlay').classList.remove('open');
  if(curvaChartFullInst){curvaChartFullInst.destroy();curvaChartFullInst=null}
}
function toggleDataLabels(){
  labelsEnabled=!labelsEnabled;
  document.getElementById('btnToggleLabels').textContent='🏷️ Rótulos: '+(labelsEnabled?'ativados':'desativados');
  renderChart();
}
function setLabelPosition(pos){labelPos=pos;if(labelsEnabled)renderChart()}

/* =========================================================
   CADASTRO — listas de referência editáveis (localStorage)
   ========================================================= */
const CADASTRO_KEY='avancopro_cadastro_v2';
const ADMIN_PASS_KEY='avancopro_admin_pass';
const AVANCO_PASS_KEY='avancopro_avanco_pass';
const SESSION_KEY='avancopro_session_profile';

const DEFAULT_CADASTRO={
  responsaveis:[
    {cod:'R01',nome:'Wesley Vinicius'},{cod:'R02',nome:'Ernane Rodrigues'},
    {cod:'R03',nome:'Nelmar'},{cod:'R04',nome:'Willian'}
  ],
  frentes:[
    {cod:'FO01',nome:'GASÔMETRO-AV.05'},{cod:'FO02',nome:'GASÔMETRO-Interno'},
    {cod:'FO03',nome:'RUA 23'},{cod:'FO04',nome:'Área de Espuma — LGE'},
    {cod:'FO05',nome:'Casa de Bombas'},{cod:'FO06',nome:'Interligação Geral'},
    {cod:'FO07',nome:'Suportes / Estrutura'}
  ],
  turnos:[
    {cod:'T1',nome:'Turno A — 07h às 17h'},{cod:'T2',nome:'Turno B — 19h às 05h'},{cod:'T3',nome:'Turno Administrativo'}
  ],
  disciplinas:[
    {cod:'MEC',nome:'Tubulação',und:'mm',dnAplica:true,detalhamento:'juntas'},
    {cod:'MEC-VLV',nome:'Montagem de Válvulas',und:'unt.',dnAplica:true,detalhamento:'none'},
    {cod:'SUP',nome:'Montagem de Suporte',und:'unt.',dnAplica:false,detalhamento:'tags'},
    {cod:'MEC-EQP',nome:'Montagem de Equipamentos',und:'unt.',dnAplica:false,detalhamento:'tags'}
  ],
  diametros:[{cod:'DN25'},{cod:'DN32'},{cod:'DN40'},{cod:'DN50'},{cod:'DN65'},{cod:'DN80'},{cod:'DN100'},{cod:'DN150'},{cod:'DN200'},{cod:'DN250'},{cod:'DN300'}],
  folhas:[
    {cod:'FL-06'},{cod:'FL-07'},{cod:'FL-08'},{cod:'FL-09'},{cod:'FL-10'},{cod:'FL-11'},
    {cod:'FL-12'},{cod:'FL-13'},{cod:'FL-14'},{cod:'FL-15'},{cod:'FL-16'},{cod:'FL-21'}
  ],
  desenhos:[
    {cod:'ZZ8115M7000274',descricao:'Isométrico geral — tubulação'},
    {cod:'ZZ8115M7000275',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000276',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000277',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000278',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000279',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000280',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000281',descricao:'Suportes — planta'},
    {cod:'ZZ8115M7000290',descricao:'Conjunto de suportes'},
    {cod:'ZZ8115M7000291',descricao:'Conjunto de suportes'},
    {cod:'ZZ8115M7000292',descricao:'Conjunto de suportes'},
    {cod:'ZZ8115M7000293',descricao:'Ponto de conexão / hidrantes'},
    {cod:'ZZ8115M7000308',descricao:'Hidrante de recalque'},
    {cod:'ZZ8115M7000312',descricao:'Conjunto de suportes'}
  ],
  tags:[
    {cod:'SUP-001',tipo:'SUP',descricao:'Suporte tipo U'},
    {cod:'SUP-002',tipo:'SUP',descricao:'Suporte guia'},
    {cod:'SUP-003',tipo:'SUP',descricao:'Suporte fixo'},
    {cod:'EQP-001',tipo:'MEC-EQP',descricao:'Bomba de incêndio'},
    {cod:'EQP-002',tipo:'MEC-EQP',descricao:'Vaso de pressão'},
    {cod:'EQP-003',tipo:'MEC-EQP',descricao:'Painel de comando'}
  ],
  materiais:[
    {cod:'MAT-001',descricao:'Tubo PRETO SCH 40 DN 10", extrem. bisel, ASME B36',unidade:'m'},
    {cod:'MAT-002',descricao:'Curva 90° RL PRETO DN 10", SCH 40, ASME B16.9',unidade:'un.'},
    {cod:'MAT-003',descricao:'Válvula gaveta, corpo aço fundido, DN 10", 150 LBS',unidade:'un.'},
    {cod:'MAT-004',descricao:'Flange sobreposto DN 10", 150 LBS, ASME B16.5',unidade:'un.'},
    {cod:'MAT-005',descricao:'Parafuso estojo 7/8" x 4.1/2" ASTM A193 B7',unidade:'un.'},
    {cod:'MAT-006',descricao:'Junta de vedação papelão hidráulico DN 10"',unidade:'un.'},
    {cod:'MAT-007',descricao:'Eletrodo de solda TIG/MIG',unidade:'kg'},
    {cod:'MAT-008',descricao:'Chumbador químico HVA HAS 3/4" x 14" - Hilti',unidade:'un.'}
  ],
  metas:[
    {frenteCod:'FO01',discCod:'MEC',meta:60000},
    {frenteCod:'FO01',discCod:'MEC-VLV',meta:20},
    {frenteCod:'FO02',discCod:'SUP',meta:40},
    {frenteCod:'FO04',discCod:'MEC-EQP',meta:10}
  ],
  contatos:[
    {nome:'Ana Souza',email:'ana.souza@techint.com',papel:'QUALIDADE'},
    {nome:'Carlos Bittencourt',email:'carlos.bittencourt@techint.com',papel:'SUPERVISOR'},
    {nome:'Roberto Lima',email:'roberto.lima@techint.com',papel:'GERENTE'},
    {nome:'Fernanda Alves',email:'fernanda.alves@techint.com',papel:'PLANEJAMENTO'}
  ],
  rncStatus:[
    {cod:'ABERTA',nome:'Aberta'},{cod:'EM_ANALISE',nome:'Em análise'},{cod:'EM_ACAO',nome:'Plano de ação em andamento'},
    {cod:'FECHADA',nome:'Fechada — verificada'},{cod:'CANCELADA',nome:'Cancelada'}
  ],
  rncClass:[
    {cod:'CRITICA',nome:'CRÍTICA',desc:'Impacto alto'},
    {cod:'MAIOR',nome:'MAIOR',desc:'Impacto médio'},
    {cod:'MENOR',nome:'MENOR',desc:'Impacto baixo'}
  ],
  rncEmailText:'Prezados,\n\nSegue notificação de Não Conformidade registrada na frente {{frente}} (desenho {{desenho}}, folha {{folha}}), encaminhada pelo Administrador após análise para tratativa da Qualidade.',
  materiaisResponsavel:[],
  desenhosResponsavel:[],
  rncResponsavel:[
    {nome:'Ana Souza',email:'ana.souza@techint.com',setor:'Qualidade',tipo:'PARA'},
    {nome:'Carlos Bittencourt',email:'carlos.bittencourt@techint.com',setor:'Supervisão',tipo:'CC'},
    {nome:'Roberto Lima',email:'roberto.lima@techint.com',setor:'Gerência',tipo:'CC'},
    {nome:'Fernanda Alves',email:'fernanda.alves@techint.com',setor:'Planejamento',tipo:'CC'}
  ]
};

let CADASTRO=null;
function loadCadastro(){
  try{
    const raw=localStorage.getItem(CADASTRO_KEY);
    if(raw){
      CADASTRO=JSON.parse(raw);
      let migrated=false;
      const hadRncResponsavel=CADASTRO.rncResponsavel!==undefined;
      Object.keys(DEFAULT_CADASTRO).forEach(k=>{if(CADASTRO[k]===undefined){CADASTRO[k]=JSON.parse(JSON.stringify(DEFAULT_CADASTRO[k]));migrated=true}});
      ['materiaisResponsavel','desenhosResponsavel'].forEach(k=>{
        const v=CADASTRO[k];
        if(v&&!Array.isArray(v)){
          CADASTRO[k]=(v.nome||v.email)?[{nome:v.nome||'',email:v.email||'',setor:v.setor||'',tipo:'PARA'}]:[];
          migrated=true;
        }
      });
      if(!hadRncResponsavel&&Array.isArray(CADASTRO.contatos)){
        const qual=CADASTRO.contatos.find(c=>c.papel==='QUALIDADE');
        const ccRoles=['SUPERVISOR','GERENTE','PLANEJAMENTO'];
        const seeded=[];
        if(qual)seeded.push({nome:qual.nome,email:qual.email,setor:'Qualidade',tipo:'PARA'});
        ccRoles.forEach(role=>{const c=CADASTRO.contatos.find(x=>x.papel===role);if(c)seeded.push({nome:c.nome,email:c.email,setor:role,tipo:'CC'})});
        if(seeded.length){CADASTRO.rncResponsavel=seeded;migrated=true}
      }
      if(migrated)saveCadastro();
      return;
    }
  }catch(e){}
  CADASTRO=JSON.parse(JSON.stringify(DEFAULT_CADASTRO));
  saveCadastro();
}
function saveCadastro(){localStorage.setItem(CADASTRO_KEY,JSON.stringify(CADASTRO))}

/* =========================================================
   SOLICITAÇÕES — materiais / desenhos
   ========================================================= */
const SOLIC_KEY='gestaoos_solicitacoes_v1';
let SOLICITACOES=null;
function loadSolicitacoes(){
  try{const raw=localStorage.getItem(SOLIC_KEY);if(raw){SOLICITACOES=JSON.parse(raw);return}}catch(e){}
  SOLICITACOES=[];
}
function saveSolicitacoes(){localStorage.setItem(SOLIC_KEY,JSON.stringify(SOLICITACOES))}

function frenteLabel(f){return f.cod+' · '+f.nome}
function respLabel(r){return r.cod+' · '+r.nome}
function turnoLabel(t){return t.cod+' · '+t.nome}
function discByCod(cod){return CADASTRO.disciplinas.find(d=>d.cod===cod)}
function frenteCodFromLabel(label){return (label||'').split(' · ')[0]}
function frenteByCod(cod){return CADASTRO.frentes.find(f=>f.cod===cod)}

function fillSelect(id,options,labelFn,placeholder){
  const el=document.getElementById(id);
  const keep=el.querySelector('option')?.value===''?el.querySelector('option').outerHTML:(placeholder||'');
  el.innerHTML=keep;
  options.forEach(o=>{const opt=document.createElement('option');opt.value=labelFn(o);opt.textContent=labelFn(o);el.appendChild(opt)});
}
function folhaLabel(f){return f.cod}
function desenhoLabel(d){return d.descricao?d.cod+' · '+d.descricao:d.cod}
function refreshCadastroSelects(){
  fillSelect('responsible',CADASTRO.responsaveis,respLabel);
  fillSelect('front',CADASTRO.frentes,frenteLabel);
  fillSelect('shift',CADASTRO.turnos,turnoLabel);
  fillSelect('folha',CADASTRO.folhas,folhaLabel);
  fillSelect('desenho',CADASTRO.desenhos,desenhoLabel);
  const rc=document.getElementById('rncClass');
  rc.innerHTML='<option value="">Selecione</option>';
  CADASTRO.rncClass.forEach(c=>{const o=document.createElement('option');o.value=c.cod;o.textContent=c.nome+' — '+(c.desc||'');rc.appendChild(o)});
}

/* =========================================================
   LOGIN / SESSÃO
   ========================================================= */
let sessionProfile=null;
function hasAdminPassword(){return !!localStorage.getItem(ADMIN_PASS_KEY)}
function startAdminLogin(){
  document.getElementById('loginChoice').classList.add('hidden');
  document.getElementById('loginAdminForm').classList.remove('hidden');
  const isSetup=!hasAdminPassword();
  document.getElementById('adminFormTitle').textContent=isSetup?'Cadastrar senha de administrador':'Acesso administrador';
  document.getElementById('f-adminPassConfirm').classList.toggle('hidden',!isSetup);
  document.getElementById('adminSubmitBtn').textContent=isSetup?'Cadastrar e entrar':'Entrar';
  document.getElementById('adminFormHint').textContent=isSetup?'Nenhuma senha cadastrada ainda neste dispositivo — defina uma (mínimo 4 caracteres).':'';
  document.getElementById('adminPassInput').value='';
  document.getElementById('adminPassConfirm').value='';
  document.getElementById('adminPassInput').focus();
}
function cancelAdminLogin(){
  document.getElementById('loginChoice').classList.remove('hidden');
  document.getElementById('loginAdminForm').classList.add('hidden');
}
function submitAdminLogin(){
  const pass=document.getElementById('adminPassInput').value;
  const isSetup=!hasAdminPassword();
  if(!pass){toast('Digite uma senha.','err');return}
  if(isSetup){
    const confirmVal=document.getElementById('adminPassConfirm').value;
    if(pass.length<4){toast('Use ao menos 4 caracteres.','err');return}
    if(pass!==confirmVal){toast('As senhas não coincidem.','err');return}
    localStorage.setItem(ADMIN_PASS_KEY,pass);
    enterAs('ADMIN');
    toast('Senha cadastrada. Bem-vindo!','ok');
  }else{
    if(pass!==localStorage.getItem(ADMIN_PASS_KEY)){toast('Senha incorreta.','err');return}
    enterAs('ADMIN');
  }
}
function loginCampo(){enterAsSilent('CAMPO');showView('campo-hub')}
function hasAvancoPassword(){return !!localStorage.getItem(AVANCO_PASS_KEY)}
function startAvancoLogin(){
  document.getElementById('campoHubChoice').classList.add('hidden');
  document.getElementById('loginAvancoForm').classList.remove('hidden');
  document.getElementById('avancoPassInput').value='';
  document.getElementById('avancoFormHint').textContent=hasAvancoPassword()?'':'Nenhuma senha cadastrada ainda neste dispositivo. Peça ao Administrador para configurá-la em Configurações → Alterar senha.';
  document.getElementById('avancoPassInput').focus();
}
function cancelAvancoLogin(){
  document.getElementById('campoHubChoice').classList.remove('hidden');
  document.getElementById('loginAvancoForm').classList.add('hidden');
}
function submitAvancoLogin(){
  if(!hasAvancoPassword()){toast('Nenhuma senha cadastrada. Peça ao Administrador para configurá-la em Configurações → Alterar senha.','err');return}
  const pass=document.getElementById('avancoPassInput').value;
  if(!pass){toast('Digite a senha.','err');return}
  if(pass!==localStorage.getItem(AVANCO_PASS_KEY)){toast('Senha incorreta.','err');return}
  enterAsSilent('AVANCO');
  startNew();
}
function enterAsSilent(profile){
  sessionProfile=profile;
  localStorage.setItem(SESSION_KEY,profile);
  applyProfileUI();
}
function enterAs(profile){
  enterAsSilent(profile);
  showView('dash');
}
function logout(){
  sessionProfile=null;
  localStorage.removeItem(SESSION_KEY);
  applyProfileUI();
  document.getElementById('loginChoice').classList.remove('hidden');
  document.getElementById('loginAdminForm').classList.add('hidden');
  document.getElementById('campoHubChoice').classList.remove('hidden');
  document.getElementById('loginAvancoForm').classList.add('hidden');
  showView('login');
}
function applyProfileUI(){
  const logged=!!sessionProfile;
  document.getElementById('topNav').classList.toggle('hidden',!logged);
  document.getElementById('profileBadge').textContent=sessionProfile==='ADMIN'?'👔 Administrador':(sessionProfile==='CAMPO'?'🦺 Projeto AVCB':(sessionProfile==='AVANCO'?'📝 Avanço Diário':''));
  const btnEnc=document.getElementById('btnEncaminhar');
  if(btnEnc)btnEnc.classList.toggle('hidden',sessionProfile!=='ADMIN');
  ['btnEditHeader','btnAddWeek','btnQuickFill','cfgCadastro','cfgSenha','cfgTextos','cfgPanelVis','navNotif','navRelatorio'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.toggle('hidden',sessionProfile!=='ADMIN')});
  if(sessionProfile==='ADMIN')refreshNotifBadge();
  applyPanelVis();
}
function openChangePass(){
  document.getElementById('oldPass').value='';document.getElementById('newPass').value='';document.getElementById('newPass2').value='';
  document.getElementById('avancoNewPass').value='';document.getElementById('avancoNewPass2').value='';
  document.getElementById('avancoPassStatus').textContent=hasAvancoPassword()?'Uma senha já está cadastrada — informe uma nova para substituí-la.':'Nenhuma senha cadastrada ainda para o Avanço Diário.';
  setPassTab('admin');
  document.getElementById('changePassOverlay').classList.add('open');
  closeConfigDrawer();
}
function setPassTab(t){
  document.getElementById('chipPassAdmin').classList.toggle('active',t==='admin');
  document.getElementById('chipPassAvanco').classList.toggle('active',t==='avanco');
  document.getElementById('passTabAdmin').classList.toggle('hidden',t!=='admin');
  document.getElementById('passTabAvanco').classList.toggle('hidden',t!=='avanco');
}
function submitAvancoPass(){
  const n1=document.getElementById('avancoNewPass').value;
  const n2=document.getElementById('avancoNewPass2').value;
  if(n1.length<4){toast('Use ao menos 4 caracteres.','err');return}
  if(n1!==n2){toast('As senhas não coincidem.','err');return}
  localStorage.setItem(AVANCO_PASS_KEY,n1);
  closeChangePass();
  toast('Senha do Avanço Diário atualizada.','ok');
}

/* ---------- painel de configurações (faixa lateral) ---------- */
let configPinned=localStorage.getItem('gestaoos_config_pinned')==='1';
function openConfigDrawer(){
  document.getElementById('configDrawer').classList.add('open');
  if(!configPinned)document.getElementById('configBackdrop').classList.add('show');
  updateConfigPinBtn();
}
function closeConfigDrawer(){
  if(configPinned)return;
  document.getElementById('configDrawer').classList.remove('open');
  document.getElementById('configBackdrop').classList.remove('show');
}
function toggleConfigPin(){
  configPinned=!configPinned;
  localStorage.setItem('gestaoos_config_pinned',configPinned?'1':'');
  if(configPinned){document.getElementById('configBackdrop').classList.remove('show')}
  updateConfigPinBtn();
}
function updateConfigPinBtn(){
  const btn=document.getElementById('btnPinConfig');
  if(!btn)return;
  btn.classList.toggle('active',configPinned);
  btn.textContent=configPinned?'📌 Fixado':'📌 Fixar';
}

/* ---------- painéis visíveis para a produção ---------- */
const PANEL_VIS_KEY='gestaoos_painel_vis_v1';
const PANEL_VIS_DEFS=[['curvas','navCurvas','📈 Curva S'],['lanc','navLanc','📋 Lançamentos'],['controle','navControle','🗂️ Controle']];
let PANEL_VIS=null;
function loadPanelVis(){
  try{const raw=localStorage.getItem(PANEL_VIS_KEY);if(raw){PANEL_VIS={...{curvas:true,lanc:true,controle:true},...JSON.parse(raw)};return}}catch(e){}
  PANEL_VIS={curvas:true,lanc:true,controle:true};
}
function savePanelVis(){localStorage.setItem(PANEL_VIS_KEY,JSON.stringify(PANEL_VIS))}
function applyPanelVis(){
  if(!PANEL_VIS)loadPanelVis();
  const isAdmin=sessionProfile==='ADMIN';
  PANEL_VIS_DEFS.forEach(([key,navId])=>{
    const el=document.getElementById(navId);
    if(el)el.classList.toggle('hidden',!isAdmin && !PANEL_VIS[key]);
  });
}
function openPanelVisConfig(){
  if(!PANEL_VIS)loadPanelVis();
  document.getElementById('panelVisList').innerHTML=PANEL_VIS_DEFS.map(([key,navId,label])=>
    `<label class="config-item" style="cursor:pointer"><input type="checkbox" id="panelVis-${key}" ${PANEL_VIS[key]?'checked':''} style="width:18px;height:18px"> <span>${esc(label)}</span></label>`
  ).join('');
  document.getElementById('panelVisOverlay').classList.add('open');
  closeConfigDrawer();
}
function closePanelVisConfig(){document.getElementById('panelVisOverlay').classList.remove('open')}
function savePanelVisConfig(){
  PANEL_VIS_DEFS.forEach(([key])=>{PANEL_VIS[key]=document.getElementById('panelVis-'+key).checked});
  savePanelVis();
  applyPanelVis();
  closePanelVisConfig();
  toast('Painéis visíveis para a produção atualizados.','ok');
}

/* ---------- utilitários genéricos: dropdown pequeno + painel de filtros ---------- */
function toggleDD(id){
  document.querySelectorAll('.dd-menu').forEach(m=>{if(m.id!==id)m.classList.add('hidden')});
  document.getElementById(id).classList.toggle('hidden');
}
document.addEventListener('click',(e)=>{
  document.querySelectorAll('.dd-menu').forEach(m=>{
    const wrap=m.closest('.dd-wrap');
    if(!m.classList.contains('hidden') && wrap && !wrap.contains(e.target)){
      m.classList.add('hidden');
    }
  });
});
function toggleFiltersPanel(panelId,btnId){
  const panel=document.getElementById(panelId);
  const opening=panel.classList.contains('hidden');
  panel.classList.toggle('hidden');
  const btn=document.getElementById(btnId);
  if(btn)btn.classList.toggle('active',opening);
}

/* ---------- textos personalizáveis do sistema ---------- */
const TEXTOS_KEY='gestaoos_textos_v1';
const DEFAULT_TEXTOS={
  brandMain:'Gestão de OS',brandAccent:'· MOA',
  dashTitle:'Painel de controle',
  dashSub:'Consolidado dos lançamentos diários de campo — dados reais deste dispositivo (IndexedDB).',
  lancTitle:'Meus lançamentos',
  lancSub:'Registros salvos neste dispositivo (IndexedDB). Fluxo offline-first: Encaminhado → Rascunho → Pendente → Sincronizando → Sincronizado.',
  curvaTitle:'Curva S — Avanço Físico',
  curvaSub:'Comparação entre avanço físico planejado e realizado, por semana, em percentual acumulado.',
  cadastroTitle:'Cadastros do projeto',
  cadastroSub:'Listas de referência do formulário — mesmo padrão da aba LISTAS da planilha do projeto. Alterações refletem imediatamente nos formulários.'
};
let TEXTOS=null;
function loadTextos(){
  try{const raw=localStorage.getItem(TEXTOS_KEY);if(raw){TEXTOS={...DEFAULT_TEXTOS,...JSON.parse(raw)};return}}catch(e){}
  TEXTOS={...DEFAULT_TEXTOS};
}
function saveTextos(){localStorage.setItem(TEXTOS_KEY,JSON.stringify(TEXTOS))}
function applyTextos(){
  const map={
    txtBrandMain:TEXTOS.brandMain,txtBrandAccent:TEXTOS.brandAccent,
    txtBrandMainLogin:TEXTOS.brandMain,txtBrandAccentLogin:TEXTOS.brandAccent,
    txtBrandMainHub:TEXTOS.brandMain,txtBrandAccentHub:TEXTOS.brandAccent,
    txtDashTitle:TEXTOS.dashTitle,txtDashSub:TEXTOS.dashSub,
    txtLancTitle:TEXTOS.lancTitle,txtLancSub:TEXTOS.lancSub,
    txtCurvaTitle:TEXTOS.curvaTitle,txtCurvaSub:TEXTOS.curvaSub,
    txtCadastroTitle:TEXTOS.cadastroTitle,txtCadastroSub:TEXTOS.cadastroSub
  };
  Object.keys(map).forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=map[id]});
  document.title=TEXTOS.brandMain+' '+TEXTOS.brandAccent+' — AVCB Gasômetro';
}
function openTextEditor(){
  if(sessionProfile!=='ADMIN'){toast('Acesso restrito ao Administrador.','err');return}
  document.getElementById('txtInBrandMain').value=TEXTOS.brandMain;
  document.getElementById('txtInBrandAccent').value=TEXTOS.brandAccent;
  document.getElementById('txtInDashTitle').value=TEXTOS.dashTitle;
  document.getElementById('txtInDashSub').value=TEXTOS.dashSub;
  document.getElementById('txtInLancTitle').value=TEXTOS.lancTitle;
  document.getElementById('txtInLancSub').value=TEXTOS.lancSub;
  document.getElementById('txtInCurvaTitle').value=TEXTOS.curvaTitle;
  document.getElementById('txtInCurvaSub').value=TEXTOS.curvaSub;
  document.getElementById('txtInCadastroTitle').value=TEXTOS.cadastroTitle;
  document.getElementById('txtInCadastroSub').value=TEXTOS.cadastroSub;
  closeConfigDrawer();
  document.getElementById('textEditorOverlay').classList.add('open');
}
function closeTextEditor(){document.getElementById('textEditorOverlay').classList.remove('open')}
function submitTextEditor(){
  TEXTOS={
    brandMain:document.getElementById('txtInBrandMain').value||DEFAULT_TEXTOS.brandMain,
    brandAccent:document.getElementById('txtInBrandAccent').value||DEFAULT_TEXTOS.brandAccent,
    dashTitle:document.getElementById('txtInDashTitle').value||DEFAULT_TEXTOS.dashTitle,
    dashSub:document.getElementById('txtInDashSub').value||DEFAULT_TEXTOS.dashSub,
    lancTitle:document.getElementById('txtInLancTitle').value||DEFAULT_TEXTOS.lancTitle,
    lancSub:document.getElementById('txtInLancSub').value||DEFAULT_TEXTOS.lancSub,
    curvaTitle:document.getElementById('txtInCurvaTitle').value||DEFAULT_TEXTOS.curvaTitle,
    curvaSub:document.getElementById('txtInCurvaSub').value||DEFAULT_TEXTOS.curvaSub,
    cadastroTitle:document.getElementById('txtInCadastroTitle').value||DEFAULT_TEXTOS.cadastroTitle,
    cadastroSub:document.getElementById('txtInCadastroSub').value||DEFAULT_TEXTOS.cadastroSub
  };
  saveTextos();applyTextos();closeTextEditor();
  toast('Textos atualizados.','ok');
}
function resetTextos(){
  TEXTOS={...DEFAULT_TEXTOS};
  saveTextos();applyTextos();closeTextEditor();
  toast('Textos restaurados para o padrão.','ok');
}
function closeChangePass(){document.getElementById('changePassOverlay').classList.remove('open')}
function submitChangePass(){
  const old=document.getElementById('oldPass').value;
  const n1=document.getElementById('newPass').value;
  const n2=document.getElementById('newPass2').value;
  if(old!==localStorage.getItem(ADMIN_PASS_KEY)){toast('Senha atual incorreta.','err');return}
  if(n1.length<4){toast('Use ao menos 4 caracteres.','err');return}
  if(n1!==n2){toast('As novas senhas não coincidem.','err');return}
  localStorage.setItem(ADMIN_PASS_KEY,n1);
  closeChangePass();
  toast('Senha alterada com sucesso.','ok');
}

/* =========================================================
   ITENS — modelo de lançamentos múltiplos por tipo de montagem
   ========================================================= */
function newLancamento(discCod){
  const disc=discByCod(discCod);
  const base={id:uuid(),folha:'',qtd:0};
  if(disc && disc.dnAplica)base.dn='—';
  if(disc && disc.detalhamento==='tags')base.tag='';
  if(disc && disc.detalhamento==='juntas'){base.acoplamento=0;base.solda=0}
  return base;
}
function newItemForDisc(discCod){return {id:uuid(),discCod,lancamentos:[newLancamento(discCod)]}}
function lancQtd(l){return +l.qtd||0}
function itemQt(it){return (it.lancamentos||[]).reduce((a,l)=>a+lancQtd(l),0)}

/* ---------- state ---------- */
function blankDraft(){
  const items=CADASTRO.disciplinas.map(d=>newItemForDisc(d.cod));
  return {
    id:uuid(),status:'DRAFT',createdAt:nowIso(),updatedAt:nowIso(),syncedAt:null,
    deviceId:deviceId(),version:1,errorMsg:null,
    data:{
      obra:'AVCB Gasômetro',date:todayLocalIso(),
      responsible:'',front:'',shift:'',folha:'',desenho:'',type:'AVANCO',
      clima:'',horarioLiberacaoArt:'',horarioLiberacaoPpt:'',horarioLiberacaoQuente:'',obsGeral:'',
      items,
      rnc:{id:null,status:'ABERTA',descricao:'',classificacao:'',hh:'',causa:'',acaoImediata:'',responsavelAcao:'',responsavelEmail:'',prazo:''},
      comments:'',unexpected:'',pending:'',attachments:[]
    }
  };
}

let draft=null;
let pendingDraft=null;
let saveTimer=null;
let isOnline=navigator.onLine;
let lastEmailDraft=null;

/* ---------- boot ---------- */
async function boot(){
  loadCadastro();
  refreshCadastroSelects();
  loadSolicitacoes();
  loadPanelVis();
  loadTextos();
  applyTextos();
  await openDb();
  const all=await idbGetAll();
  pendingDraft=all.find(r=>r.status==='DRAFT')||null;
  updateConnUI();
  refreshSyncStatus();
  sessionProfile=localStorage.getItem(SESSION_KEY);
  applyProfileUI();
  updateConfigPinBtn();
  if(configPinned && sessionProfile)openConfigDrawer();
  showView(sessionProfile?'dash':'login');
  window.addEventListener('online',()=>{isOnline=true;updateConnUI();trySync()});
  window.addEventListener('offline',()=>{isOnline=false;updateConnUI()});
  setInterval(trySync,15000);
}

function resumeDraft(){
  editSnapshot=null;applyEditCancelUi();
  draft=pendingDraft;pendingDraft=null;
  bindStep1();
  document.getElementById('comments').value=draft.data.comments||'';
  document.getElementById('unexpected').value=draft.data.unexpected||'';
  document.getElementById('pending').value=draft.data.pending||'';
  renderAttachments();
  showView('wizard');
  goStep(1,true);
}
async function discardDraft(){
  if(await askConfirm('Descartar rascunho','Tem certeza que deseja descartar o rascunho não finalizado? Esta ação não pode ser desfeita.')){
    await idbDelete(pendingDraft.id);pendingDraft=null;renderDashboard();toast('Rascunho descartado.','ok');
  }
}
async function continueEncaminhado(id){
  editSnapshot=null;applyEditCancelUi();
  const all=await idbGetAll();
  const rec=all.find(r=>r.id===id);
  if(!rec){toast('Registro não encontrado.','err');return}
  rec.status='DRAFT';
  await idbPut(rec);
  draft=rec;
  bindStep1();
  document.getElementById('comments').value=draft.data.comments||'';
  document.getElementById('unexpected').value=draft.data.unexpected||'';
  document.getElementById('pending').value=draft.data.pending||'';
  renderAttachments();
  showView('wizard');
  goStep(2,true);
}

async function startNew(){
  editSnapshot=null;applyEditCancelUi();
  const all=await idbGetAll();
  const orphanDrafts=all.filter(r=>r.status==='DRAFT');
  for(const d of orphanDrafts)await idbDelete(d.id);
  pendingDraft=null;
  draft=blankDraft();
  bindStep1();
  document.getElementById('comments').value='';document.getElementById('unexpected').value='';document.getElementById('pending').value='';
  draft.data.attachments=[];renderAttachments();
  showView('wizard');
  goStep(1,true);
}

/* ---------- autosave ---------- */
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(persistDraft,500)}
async function persistDraft(){draft.updatedAt=nowIso();await idbPut(draft)}

/* ---------- step 1 ---------- */
function bindStep1(){
  document.getElementById('date').value=draft.data.date||'';
  document.getElementById('responsible').value=draft.data.responsible||'';
  document.getElementById('front').value=draft.data.front||'';
  document.getElementById('shift').value=draft.data.shift||'';
  document.getElementById('folha').value=draft.data.folha||'';
  document.getElementById('desenho').value=draft.data.desenho||'';
  document.getElementById('clima').value=draft.data.clima||'';
  document.getElementById('horarioLiberacaoArt').value=draft.data.horarioLiberacaoArt||'';
  document.getElementById('horarioLiberacaoPpt').value=draft.data.horarioLiberacaoPpt||'';
  document.getElementById('horarioLiberacaoQuente').value=draft.data.horarioLiberacaoQuente||'';
  document.getElementById('obsGeral').value=draft.data.obsGeral||'';
  chooseType(draft.data.type,true);
  applyProfileUI();
}
document.addEventListener('DOMContentLoaded',()=>{
  ['date','responsible','front','shift','folha','desenho','clima','horarioLiberacaoArt','horarioLiberacaoPpt','horarioLiberacaoQuente','obsGeral'].forEach(id=>{
    const el=document.getElementById(id);
    el.addEventListener('input',()=>{draft.data[id]=el.value;clearFieldError(id);scheduleSave()});
    el.addEventListener('change',()=>{draft.data[id]=el.value;clearFieldError(id);scheduleSave()});
  });
});
function clearFieldError(id){const f=document.getElementById('f-'+id);if(f)f.classList.remove('invalid')}
function setFieldError(id){const f=document.getElementById('f-'+id);if(f)f.classList.add('invalid')}

let infoComplCollapsed=false;
function applyInfoComplUi(){
  document.getElementById('infoComplFields').classList.toggle('hidden',infoComplCollapsed);
  document.getElementById('btnToggleInfoCompl').textContent=infoComplCollapsed?'▸ Exibir':'▾ Recolher';
}
function toggleInfoCompl(){infoComplCollapsed=!infoComplCollapsed;applyInfoComplUi()}
function chooseType(t,silent){
  draft.data.type=t;
  document.getElementById('advanceChoice').classList.toggle('selected',t==='AVANCO');
  document.getElementById('rncChoice').classList.toggle('selected',t==='RNC');
  document.getElementById('s2').querySelector('b').innerHTML=t==='RNC'?'<span class="step-num">2</span>Não conformidade':'<span class="step-num">2</span>Quantitativos';
  document.getElementById('s2').querySelector('small').textContent=t==='RNC'?'Descrição do desvio':'Medição física';
  infoComplCollapsed=(t==='RNC');
  applyInfoComplUi();
  if(!silent)scheduleSave();
}

function validateStep1(){
  let ok=true;
  ['date','responsible','front','shift'].forEach(id=>{
    const v=document.getElementById(id).value;
    if(!v){setFieldError(id);ok=false}else{clearFieldError(id)}
  });
  if(!ok){toast('Preencha todos os campos obrigatórios.','err')}
  return ok;
}
async function encaminharParaCampo(){
  if(!validateStep1())return;
  draft.status='ENCAMINHADO';
  draft.updatedAt=nowIso();
  await idbPut(draft);
  toast('Registro encaminhado para a equipe de campo.','ok');
  draft=null;
  showView('dash');
}

/* ---------- navigation ---------- */
function goStep(n,silent){
  if(n===2 && !silent && !validateStep1())return;
  document.querySelectorAll('#page1,#page2,#page2rnc,#page3,#done').forEach(s=>s.classList.add('hidden'));
  for(let i=1;i<=3;i++){
    document.getElementById('s'+i).classList.toggle('active',i===n);
    document.getElementById('s'+i).classList.toggle('done',i<n);
  }
  if(n===1)document.getElementById('page1').classList.remove('hidden');
  if(n===2){
    if(draft.data.type==='RNC'){document.getElementById('page2rnc').classList.remove('hidden');bindRnc()}
    else{document.getElementById('page2').classList.remove('hidden');renderCtxStrip();renderQItems()}
  }
  if(n===3){document.getElementById('page3').classList.remove('hidden');renderSummary()}
  window.scrollTo({top:0,behavior:'smooth'});
}
function backFrom3(){goStep(2,true)}
function renderCtxStrip(){
  const d=draft.data;
  document.getElementById('ctxStrip').innerHTML=`
    <div class="ctx-item"><b>Data</b><span>${d.date||'—'}</span></div>
    <div class="ctx-item"><b>Responsável</b><span>${esc(d.responsible||'—')}</span></div>
    <div class="ctx-item"><b>Frente</b><span>${esc(d.front||'—')}</span></div>
    <div class="ctx-item"><b>Turno</b><span>${esc(d.shift||'—')}</span></div>`;
}

function bindRnc(){
  document.getElementById('rncDesc').value=draft.data.rnc.descricao||'';
  document.getElementById('rncClass').value=draft.data.rnc.classificacao||'';
  document.getElementById('rncHH').value=draft.data.rnc.hh||'';
  document.getElementById('rncCausa').value=draft.data.rnc.causa||'';
  document.getElementById('rncAction').value=draft.data.rnc.acaoImediata||'';
  document.getElementById('rncPrazo').value=draft.data.rnc.prazo||'';
  const qual=CADASTRO.contatos.find(c=>c.papel==='QUALIDADE');
  draft.data.rnc.responsavelAcao=qual?qual.nome:'';
  draft.data.rnc.responsavelEmail=qual?qual.email:'';
  document.getElementById('rncRespDisplay').value=qual?(qual.nome+' — '+qual.email):'Nenhum responsável de Qualidade cadastrado';
  document.getElementById('rncRespHint').textContent=qual?'Definido automaticamente pelo setor de Qualidade (Cadastro → Contatos).':'⚠️ Cadastre o responsável em Cadastro → Contatos.';
  const map={rncDesc:'descricao',rncClass:'classificacao',rncHH:'hh',rncCausa:'causa',rncAction:'acaoImediata',rncPrazo:'prazo'};
  Object.keys(map).forEach(id=>{
    document.getElementById(id).oninput=()=>{draft.data.rnc[map[id]]=document.getElementById(id).value;scheduleSave()};
    document.getElementById(id).onchange=()=>{draft.data.rnc[map[id]]=document.getElementById(id).value;scheduleSave()};
  });
  scheduleSave();
}

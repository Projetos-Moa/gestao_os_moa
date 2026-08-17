/* =========================================================
   CADASTRO — listas de referência editáveis (localStorage)
   ========================================================= */
const CADASTRO_KEY='avancopro_cadastro_v2';

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
// Tabelas Supabase 1:1 com uma categoria de CAD_DEFS (chave = cod).
const CAD_TABLE_MAP={
  responsaveis:'cadastro_responsaveis', frentes:'cadastro_frentes', turnos:'cadastro_turnos',
  diametros:'cadastro_diametros', folhas:'cadastro_folhas', desenhos:'cadastro_desenhos',
  materiais:'cadastro_materiais', tags:'cadastro_tags',
  rncStatus:'cadastro_rnc_status', rncClass:'cadastro_rnc_class'
};
function mapNotifRow(n){return {_id:n.id,nome:n.nome,email:n.email,setor:n.setor,tipo:n.tipo}}
function loadCadastroFromCache(){
  try{
    const raw=localStorage.getItem(CADASTRO_KEY);
    if(raw){CADASTRO=JSON.parse(raw);return}
  }catch(e){}
  CADASTRO=JSON.parse(JSON.stringify(DEFAULT_CADASTRO));
}
async function loadCadastro(){
  loadCadastroFromCache();
  if(!sessionProfile)return;   // ainda não logado — RLS bloquearia mesmo, usa só o cache local
  try{
    const [resp,front,turn,disc,dia,fol,des,mat,tag,rst,rcl,cont,met,notif,rncTxt]=await Promise.all([
      supabase.from('cadastro_responsaveis').select('cod,nome').order('cod'),
      supabase.from('cadastro_frentes').select('cod,nome').order('cod'),
      supabase.from('cadastro_turnos').select('cod,nome').order('cod'),
      supabase.from('cadastro_disciplinas').select('cod,nome,unidade,dn_aplica,detalhamento').order('cod'),
      supabase.from('cadastro_diametros').select('cod').order('cod'),
      supabase.from('cadastro_folhas').select('cod').order('cod'),
      supabase.from('cadastro_desenhos').select('cod,descricao').order('cod'),
      supabase.from('cadastro_materiais').select('cod,descricao,unidade').order('cod'),
      supabase.from('cadastro_tags').select('cod,tipo,descricao').order('cod'),
      supabase.from('cadastro_rnc_status').select('cod,nome').order('cod'),
      supabase.from('cadastro_rnc_class').select('cod,nome,descricao').order('cod'),
      supabase.from('cadastro_contatos').select('id,nome,email,papel').order('nome'),
      supabase.from('cadastro_metas').select('id,frente_cod,disc_cod,meta'),
      supabase.from('contatos_notificacao').select('id,categoria,nome,email,setor,tipo'),
      supabase.from('app_settings').select('value').eq('key','rnc_email_text').maybeSingle()
    ]);
    const results={resp,front,turn,disc,dia,fol,des,mat,tag,rst,rcl,cont,met,notif,rncTxt};
    const firstErr=Object.values(results).find(r=>r.error);
    if(firstErr){supaErrToast(firstErr.error,'Cadastro: usando dados salvos neste dispositivo');return}
    CADASTRO={
      responsaveis:resp.data,
      frentes:front.data,
      turnos:turn.data,
      disciplinas:disc.data.map(d=>({cod:d.cod,nome:d.nome,und:d.unidade,dnAplica:d.dn_aplica,detalhamento:d.detalhamento})),
      diametros:dia.data,
      folhas:fol.data,
      desenhos:des.data,
      materiais:mat.data,
      tags:tag.data,
      metas:met.data.map(m=>({_id:m.id,frenteCod:m.frente_cod,discCod:m.disc_cod,meta:m.meta})),
      contatos:cont.data.map(c=>({_id:c.id,nome:c.nome,email:c.email,papel:c.papel})),
      rncStatus:rst.data,
      rncClass:rcl.data.map(c=>({cod:c.cod,nome:c.nome,desc:c.descricao})),
      rncEmailText:(rncTxt.data?.value?.texto)||DEFAULT_CADASTRO.rncEmailText,
      materiaisResponsavel:notif.data.filter(n=>n.categoria==='MATERIAIS').map(mapNotifRow),
      desenhosResponsavel:notif.data.filter(n=>n.categoria==='DESENHOS').map(mapNotifRow),
      rncResponsavel:notif.data.filter(n=>n.categoria==='RNC').map(mapNotifRow)
    };
    saveCadastro();
  }catch(e){
    supaErrToast(e,'Cadastro: usando dados salvos neste dispositivo');
  }
}
function saveCadastro(){localStorage.setItem(CADASTRO_KEY,JSON.stringify(CADASTRO))}

/* ---------- sincronização de mutações de Cadastro com o Supabase ---------- */
async function cadEntrySyncAdd(cat,entry){
  try{
    if(cat==='metas'){
      const {data,error}=await supabase.from('cadastro_metas')
        .upsert({frente_cod:entry.frenteCod,disc_cod:entry.discCod,meta:entry.meta},{onConflict:'frente_cod,disc_cod'})
        .select('id').single();
      if(error)throw error;
      entry._id=data.id;
      return;
    }
    if(cat==='contatos'){
      const {data,error}=await supabase.from('cadastro_contatos')
        .insert({nome:entry.nome,email:entry.email,papel:entry.papel}).select('id').single();
      if(error)throw error;
      entry._id=data.id;
      return;
    }
    if(cat==='disciplinas'){
      const {error}=await supabase.from('cadastro_disciplinas')
        .upsert({cod:entry.cod,nome:entry.nome,unidade:entry.und,dn_aplica:entry.dnAplica,detalhamento:entry.detalhamento});
      if(error)throw error;
      return;
    }
    if(cat==='rncClass'){
      const {error}=await supabase.from('cadastro_rnc_class')
        .upsert({cod:entry.cod,nome:entry.nome,descricao:entry.desc});
      if(error)throw error;
      return;
    }
    const table=CAD_TABLE_MAP[cat];
    if(!table)return;
    const {error}=await supabase.from(table).upsert(entry);
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível salvar no servidor — ficou salvo só neste dispositivo')}
}
async function cadEntrySyncRemove(cat,entry){
  try{
    if(cat==='metas'||cat==='contatos'){
      if(!entry._id)return;
      const table=cat==='metas'?'cadastro_metas':'cadastro_contatos';
      const {error}=await supabase.from(table).delete().eq('id',entry._id);
      if(error)throw error;
      return;
    }
    const table=cat==='disciplinas'?'cadastro_disciplinas':(cat==='rncClass'?'cadastro_rnc_class':CAD_TABLE_MAP[cat]);
    if(!table)return;
    const {error}=await supabase.from(table).delete().eq('cod',entry.cod);
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível remover no servidor')}
}
async function notifContactSyncAdd(categoria,entry){
  try{
    const {data,error}=await supabase.from('contatos_notificacao')
      .insert({categoria,nome:entry.nome,email:entry.email,setor:entry.setor,tipo:entry.tipo})
      .select('id').single();
    if(error)throw error;
    entry._id=data.id;
  }catch(err){supaErrToast(err,'Não foi possível salvar no servidor — ficou salvo só neste dispositivo')}
}
async function notifContactSyncRemove(entry){
  if(!entry._id)return;
  try{
    const {error}=await supabase.from('contatos_notificacao').delete().eq('id',entry._id);
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível remover no servidor')}
}
async function saveAppSetting(key,value){
  try{
    const {error}=await supabase.from('app_settings').upsert({key,value});
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível salvar no servidor — ficou salvo só neste dispositivo')}
}
async function loadAppSetting(key){
  try{
    const {data,error}=await supabase.from('app_settings').select('value').eq('key',key).maybeSingle();
    if(error)throw error;
    return data?.value;
  }catch(err){supaErrToast(err,'Não foi possível carregar do servidor — usando dados salvos neste dispositivo');return undefined}
}

/* =========================================================
   SOLICITAÇÕES — materiais / desenhos
   ========================================================= */
const SOLIC_KEY='gestaoos_solicitacoes_v1';
let SOLICITACOES=null;
function mapSolicitacaoRow(row,itensRows){
  const itens=(itensRows||[]).filter(i=>i.solicitacao_id===row.id).map(i=>
    row.tipo==='MATERIAL'
      ?{item:i.item_takeoff,material:i.material,quantidade:i.quantidade,unidade:i.unidade}
      :{desenho:i.desenho,custom:i.custom}
  );
  return {id:row.id,tipo:row.tipo,itens,observacao:row.observacao,solicitante:row.solicitante,
    projeto:row.projeto,status:row.status,createdAt:row.created_at,readByAdmin:row.read_by_admin};
}
function loadSolicitacoesFromCache(){
  try{const raw=localStorage.getItem(SOLIC_KEY);if(raw){SOLICITACOES=JSON.parse(raw);return}}catch(e){}
  SOLICITACOES=[];
}
async function loadSolicitacoes(){
  loadSolicitacoesFromCache();
  if(!sessionProfile)return;
  try{
    const [{data:rows,error:e1},{data:itensRows,error:e2}]=await Promise.all([
      supabase.from('solicitacoes').select('*').order('created_at',{ascending:false}),
      supabase.from('solicitacao_itens').select('*')
    ]);
    if(e1||e2)throw (e1||e2);
    SOLICITACOES=rows.map(r=>mapSolicitacaoRow(r,itensRows));
    saveSolicitacoes();
  }catch(err){supaErrToast(err,'Solicitações: usando dados salvos neste dispositivo')}
}
function saveSolicitacoes(){localStorage.setItem(SOLIC_KEY,JSON.stringify(SOLICITACOES))}
async function submitSolicitacaoToSupabase(s){
  try{
    const {data:row,error:e1}=await supabase.from('solicitacoes').insert({
      created_by:sessionUser?.id||null,tipo:s.tipo,observacao:s.observacao,
      solicitante:s.solicitante,projeto:s.projeto,status:s.status,read_by_admin:s.readByAdmin
    }).select('id,created_at').single();
    if(e1)throw e1;
    const itensRows=s.itens.map(it=>s.tipo==='MATERIAL'
      ?{solicitacao_id:row.id,item_takeoff:it.item,material:it.material,quantidade:it.quantidade,unidade:it.unidade}
      :{solicitacao_id:row.id,desenho:it.desenho,custom:it.custom}
    );
    const {error:e2}=await supabase.from('solicitacao_itens').insert(itensRows);
    if(e2)throw e2;
    s.id=row.id;
    s.createdAt=row.created_at;
    saveSolicitacoes();
  }catch(err){supaErrToast(err,'Não foi possível enviar ao servidor — ficou salva só neste dispositivo')}
}
/* ---------- gestão de usuários (login por Usuário, via Edge Function admin-users) ---------- */
async function callAdminUsersFunction(payload){
  try{
    const {data,error}=await supabase.functions.invoke('admin-users',{body:payload});
    if(error)throw error;
    if(data && data.ok===false)throw new Error(data.error||'Falha na operação.');
    return data;
  }catch(err){
    supaErrToast(err,'Não foi possível completar a operação');
    return null;
  }
}
let USER_PROFILES=null;
async function loadUserProfiles(){
  if(sessionProfile!=='ADMIN')return;
  try{
    const {data,error}=await supabase.from('user_profiles').select('id,username,nome,papel').order('nome');
    if(error)throw error;
    USER_PROFILES=data;
  }catch(err){supaErrToast(err,'Não foi possível carregar os usuários')}
}
async function updateSolicitacaoRemote(id,patch){
  try{
    const {error}=await supabase.from('solicitacoes').update(patch).eq('id',id);
    if(error)throw error;
  }catch(err){supaErrToast(err,'Não foi possível atualizar no servidor')}
}

/* =========================================================
   Registros (Avanço Diário / RNC) — envio ao Supabase
   (IndexedDB continua sendo a fila offline do dispositivo;
   esta camada só decompõe/envia um registro já pronto para sync)
   ========================================================= */
function registroToRow(rec){
  const d=rec.data;
  return {
    id:rec.id,
    created_by:sessionUser?.id||null,
    status:rec.status,
    tipo:d.type,
    device_id:rec.deviceId,
    version:rec.version,
    error_msg:rec.errorMsg,
    notif_read:rec.notifRead!==false,
    obra:d.obra,
    data_registro:d.date,
    responsible_cod:codFromLabel(d.responsible),
    front_cod:codFromLabel(d.front),
    shift_cod:codFromLabel(d.shift),
    folha_cod:d.folha||null,
    desenho_cod:codFromLabel(d.desenho),
    clima:d.clima,
    horario_liberacao_art:d.horarioLiberacaoArt,
    horario_liberacao_ppt:d.horarioLiberacaoPpt,
    horario_liberacao_quente:d.horarioLiberacaoQuente,
    obs_geral:d.obsGeral,
    comments:d.comments,
    unexpected:d.unexpected,
    pending:d.pending,
    registrado_em:d.registradoEm||null
  };
}
function registroRncRow(rec){
  const r=rec.data.rnc;
  if(!r||!r.id)return null;
  return {
    registro_id:rec.id,
    rnc_id:r.id,
    status_cod:r.status||'ABERTA',
    descricao:r.descricao,
    classificacao_cod:r.classificacao||null,
    hh:r.hh!==''&&r.hh!==undefined?Number(r.hh):null,
    causa:r.causa,
    acao_imediata:r.acaoImediata,
    responsavel_acao:r.responsavelAcao,
    responsavel_email:r.responsavelEmail,
    prazo:r.prazo||null
  };
}
function registroItensLancamentosRows(rec){
  const itensRows=[],lancRows=[];
  (rec.data.items||[]).forEach(it=>{
    itensRows.push({id:it.id,registro_id:rec.id,disc_cod:it.discCod});
    (it.lancamentos||[]).forEach(l=>{
      lancRows.push({
        id:l.id,item_id:it.id,folha:l.folha||null,qtd:+l.qtd||0,
        dn:l.dn||null,tag_cod:l.tag||null,
        acoplamento:l.acoplamento!==undefined?(+l.acoplamento||0):null,
        solda:l.solda!==undefined?(+l.solda||0):null
      });
    });
  });
  return {itensRows,lancRows};
}
async function pushRegistroToSupabase(rec){
  try{
    const {error:e1}=await supabase.from('registros').upsert(registroToRow(rec));
    if(e1)throw e1;
    if(rec.data.type==='AVANCO'){
      const {itensRows,lancRows}=registroItensLancamentosRows(rec);
      const {error:eDel}=await supabase.from('registros_itens').delete().eq('registro_id',rec.id);
      if(eDel)throw eDel;
      if(itensRows.length){
        const {error:e2}=await supabase.from('registros_itens').insert(itensRows);
        if(e2)throw e2;
      }
      if(lancRows.length){
        const {error:e3}=await supabase.from('registros_lancamentos').insert(lancRows);
        if(e3)throw e3;
      }
    }else{
      const rncRow=registroRncRow(rec);
      if(rncRow){
        const {error:e4}=await supabase.from('registros_rnc').upsert(rncRow);
        if(e4)throw e4;
      }
    }
    return true;
  }catch(err){
    console.error('pushRegistroToSupabase',err);
    return false;
  }
}

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
let sessionUser=null;   // {id, email, nome}

async function loadAllAppData(){
  await loadCadastro();
  refreshCadastroSelects();
  await loadSolicitacoes();
  await loadPanelVis();
  await loadTextos();
  applyTextos();
  if(sessionProfile==='ADMIN')await loadUserProfiles();
}

const USERNAME_DOMAIN='avcb.local';
function usernameToEmail(username){
  const slug=(username||'').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9.]+/g,'.')
    .replace(/\.+/g,'.')
    .replace(/^\.|\.$/g,'');
  return slug+'@'+USERNAME_DOMAIN;
}
const ADMIN_USERNAME='admin';
const PROJETO_AVCB_USERNAME='projeto-avcb';

function startAdminLogin(){
  document.getElementById('loginChoice').classList.add('hidden');
  document.getElementById('loginAdminForm').classList.remove('hidden');
  document.getElementById('adminPassInput').value='';
  document.getElementById('adminFormHint').textContent='';
  document.getElementById('adminPassInput').focus();
}
function cancelAdminLogin(){
  document.getElementById('loginChoice').classList.remove('hidden');
  document.getElementById('loginAdminForm').classList.add('hidden');
}
async function submitAdminLogin(){
  const pass=document.getElementById('adminPassInput').value;
  const hint=document.getElementById('adminFormHint');
  if(!pass){hint.textContent='Digite a senha.';return}
  hint.textContent='Entrando...';
  const {error}=await supabase.auth.signInWithPassword({email:usernameToEmail(ADMIN_USERNAME),password:pass});
  if(error){console.error('Admin login error:',error);hint.textContent='Erro: '+error.message;return}
  await loadSessionProfile();
  if(sessionProfile!=='ADMIN'){
    hint.textContent='Esta conta não é de Administrador.';
    await supabase.auth.signOut();
    sessionProfile=null;sessionUser=null;
    return;
  }
  hint.textContent='Carregando dados...';
  await loadAllAppData();
  hint.textContent='';
  document.getElementById('adminPassInput').value='';
  routeAfterLogin();
}
function startCampoLogin(){
  document.getElementById('loginChoice').classList.add('hidden');
  document.getElementById('loginCampoForm').classList.remove('hidden');
  document.getElementById('campoPassInput').value='';
  document.getElementById('campoFormHint').textContent='';
  document.getElementById('campoPassInput').focus();
}
function cancelCampoLogin(){
  document.getElementById('loginChoice').classList.remove('hidden');
  document.getElementById('loginCampoForm').classList.add('hidden');
}
async function submitCampoLogin(){
  const pass=document.getElementById('campoPassInput').value;
  const hint=document.getElementById('campoFormHint');
  if(!pass){hint.textContent='Digite a senha do projeto.';return}
  hint.textContent='Entrando...';
  const {error}=await supabase.auth.signInWithPassword({email:usernameToEmail(PROJETO_AVCB_USERNAME),password:pass});
  if(error){console.error('Campo login error:',error);hint.textContent='Erro: '+error.message;return}
  await loadSessionProfile();
  if(!sessionProfile){
    hint.textContent='O acesso do Projeto AVCB ainda não foi configurado. Peça ao Administrador.';
    await supabase.auth.signOut();
    sessionProfile=null;sessionUser=null;
    return;
  }
  hint.textContent='Carregando dados...';
  await loadAllAppData();
  hint.textContent='';
  document.getElementById('campoPassInput').value='';
  routeAfterLogin();
}
async function loadSessionProfile(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){sessionProfile=null;sessionUser=null;return}
  const {data:profile,error}=await supabase.from('user_profiles').select('papel,nome,username').eq('id',user.id).single();
  if(error||!profile){sessionProfile=null;sessionUser={id:user.id,email:user.email,nome:'',username:''};return}
  sessionProfile=profile.papel;
  sessionUser={id:user.id,email:user.email,nome:profile.nome,username:profile.username};
}
function routeAfterLogin(){
  applyProfileUI();
  showView(sessionProfile==='ADMIN'?'dash':'campo-hub');
}
async function logout(){
  await supabase.auth.signOut();
  sessionProfile=null;
  sessionUser=null;
  applyProfileUI();
  document.getElementById('loginChoice').classList.remove('hidden');
  document.getElementById('loginAdminForm').classList.add('hidden');
  document.getElementById('loginCampoForm').classList.add('hidden');
  showView('login');
}
function applyProfileUI(){
  const logged=!!sessionProfile;
  document.getElementById('topNav').classList.toggle('hidden',!logged);
  document.getElementById('profileBadge').textContent=sessionProfile==='ADMIN'?'👔 Administrador':(sessionProfile==='CAMPO'?'🦺 Projeto AVCB':(sessionProfile==='AVANCO'?'📝 Avanço Diário':''));
  const btnEnc=document.getElementById('btnEncaminhar');
  if(btnEnc)btnEnc.classList.toggle('hidden',sessionProfile!=='ADMIN');
  ['btnEditHeader','btnAddWeek','btnQuickFill','cfgCadastro','cfgTextos','cfgPanelVis','cfgSenha','cfgSenhaProjeto','navNotif','navRelatorio'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.toggle('hidden',sessionProfile!=='ADMIN')});
  if(sessionProfile==='ADMIN')refreshNotifBadge();
  applyPanelVis();
}
function openChangePass(){
  document.getElementById('newPass').value='';document.getElementById('newPass2').value='';
  document.getElementById('changePassStatus').textContent='Conta atual: '+(sessionUser?.username||'—');
  document.getElementById('changePassOverlay').classList.add('open');
  closeConfigDrawer();
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
function loadPanelVisFromCache(){
  try{const raw=localStorage.getItem(PANEL_VIS_KEY);if(raw){PANEL_VIS={...{curvas:true,lanc:true,controle:true},...JSON.parse(raw)};return}}catch(e){}
  PANEL_VIS={curvas:true,lanc:true,controle:true};
}
async function loadPanelVis(){
  loadPanelVisFromCache();
  if(!sessionProfile)return;
  const remote=await loadAppSetting('panel_vis');
  if(remote){PANEL_VIS={...PANEL_VIS,...remote};savePanelVisToCache()}
}
function savePanelVisToCache(){localStorage.setItem(PANEL_VIS_KEY,JSON.stringify(PANEL_VIS))}
async function savePanelVis(){
  savePanelVisToCache();
  await saveAppSetting('panel_vis',PANEL_VIS);
}
function applyPanelVis(){
  if(!PANEL_VIS)loadPanelVisFromCache();
  const isAdmin=sessionProfile==='ADMIN';
  PANEL_VIS_DEFS.forEach(([key,navId])=>{
    const el=document.getElementById(navId);
    if(el)el.classList.toggle('hidden',!isAdmin && !PANEL_VIS[key]);
  });
}
function openPanelVisConfig(){
  if(!PANEL_VIS)loadPanelVisFromCache();
  document.getElementById('panelVisList').innerHTML=PANEL_VIS_DEFS.map(([key,navId,label])=>
    `<label class="config-item" style="cursor:pointer"><input type="checkbox" id="panelVis-${key}" ${PANEL_VIS[key]?'checked':''} style="width:18px;height:18px"> <span>${esc(label)}</span></label>`
  ).join('');
  document.getElementById('panelVisOverlay').classList.add('open');
  closeConfigDrawer();
}
function closePanelVisConfig(){document.getElementById('panelVisOverlay').classList.remove('open')}
async function savePanelVisConfig(){
  PANEL_VIS_DEFS.forEach(([key])=>{PANEL_VIS[key]=document.getElementById('panelVis-'+key).checked});
  applyPanelVis();
  closePanelVisConfig();
  toast('Painéis visíveis para a produção atualizados.','ok');
  await savePanelVis();
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
function loadTextosFromCache(){
  try{const raw=localStorage.getItem(TEXTOS_KEY);if(raw){TEXTOS={...DEFAULT_TEXTOS,...JSON.parse(raw)};return}}catch(e){}
  TEXTOS={...DEFAULT_TEXTOS};
}
async function loadTextos(){
  loadTextosFromCache();
  if(!sessionProfile)return;
  const remote=await loadAppSetting('textos');
  if(remote){TEXTOS={...TEXTOS,...remote};saveTextosToCache()}
}
function saveTextosToCache(){localStorage.setItem(TEXTOS_KEY,JSON.stringify(TEXTOS))}
async function saveTextos(){
  saveTextosToCache();
  await saveAppSetting('textos',TEXTOS);
}
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
async function submitTextEditor(){
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
  applyTextos();closeTextEditor();
  toast('Textos atualizados.','ok');
  await saveTextos();
}
async function resetTextos(){
  TEXTOS={...DEFAULT_TEXTOS};
  applyTextos();closeTextEditor();
  toast('Textos restaurados para o padrão.','ok');
  await saveTextos();
}
function closeChangePass(){document.getElementById('changePassOverlay').classList.remove('open')}
async function submitChangePass(){
  const n1=document.getElementById('newPass').value;
  const n2=document.getElementById('newPass2').value;
  if(n1.length<6){toast('Use ao menos 6 caracteres.','err');return}
  if(n1!==n2){toast('As novas senhas não coincidem.','err');return}
  const {error}=await supabase.auth.updateUser({password:n1});
  if(error){supaErrToast(error,'Não foi possível trocar a senha');return}
  closeChangePass();
  toast('Senha alterada com sucesso.','ok');
}
function openChangeCampoPass(){
  document.getElementById('campoNewPassInput').value='';
  document.getElementById('changeCampoPassOverlay').classList.add('open');
  closeConfigDrawer();
}
function closeChangeCampoPass(){document.getElementById('changeCampoPassOverlay').classList.remove('open')}
async function submitChangeCampoPass(){
  const senha=document.getElementById('campoNewPassInput').value;
  if(senha.length<6){toast('Use ao menos 6 caracteres.','err');return}
  const {data,error:findErr}=await supabase.from('user_profiles').select('id').eq('username',PROJETO_AVCB_USERNAME).maybeSingle();
  if(findErr||!data){toast('Conta do Projeto AVCB ainda não existe. Crie em Cadastro → Usuários (usuário "'+PROJETO_AVCB_USERNAME+'") antes.','err');return}
  const result=await callAdminUsersFunction({action:'reset_password',id:data.id,password:senha});
  if(!result)return;
  closeChangeCampoPass();
  toast('Senha do Projeto AVCB atualizada.','ok');
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
  const {data:{session}}=await supabase.auth.getSession();
  if(session)await loadSessionProfile();
  await loadAllAppData();
  await openDb();
  const all=await idbGetAll();
  pendingDraft=all.find(r=>r.status==='DRAFT')||null;
  updateConnUI();
  refreshSyncStatus();
  applyProfileUI();
  updateConfigPinBtn();
  if(configPinned && sessionProfile)openConfigDrawer();
  showView(sessionProfile?(sessionProfile==='ADMIN'?'dash':'campo-hub'):'login');
  supabase.auth.onAuthStateChange((event)=>{
    if(event==='SIGNED_OUT'){sessionProfile=null;sessionUser=null;applyProfileUI()}
  });
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

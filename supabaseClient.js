/* =========================================================
   Supabase — cliente e helpers compartilhados por todo o app
   ========================================================= */
const SUPABASE_URL='https://bspnnffthkfvpccceontc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_oGmSeQXhV1QCfW_4vZX4Lg_lGDFFT_a';

/* Algumas redes (ex.: firewall corporativo) não recusam a conexão na hora —
   ficam "engolindo" o pacote em silêncio, e o fetch normal do navegador só
   desiste depois de dezenas de segundos. Isso travava a tela em "Carregando
   dados..." por muito tempo sempre que o Supabase estava inacessível. Este
   fetch com AbortController força cada chamada a desistir em poucos
   segundos, para a tela nunca ficar presa — mesmo com a rede bloqueando. */
function fetchComTimeout(timeoutMs){
  return function(url,options){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeoutMs);
    return fetch(url,{...options,signal:controller.signal}).finally(()=>clearTimeout(timer));
  };
}

/* Sem "const"/"let" aqui de propósito: o CDN do supabase-js já expõe um
   global chamado "supabase" (a biblioteca) — declarar de novo com const/let
   dá SyntaxError "already been declared" (scripts clássicos compartilham o
   mesmo escopo global). Reatribuir sem palavra-chave reaproveita esse global,
   trocando a biblioteca pelo cliente já conectado — e todo o resto do app
   continua chamando supabase.from(...) normalmente. */
supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
  global:{fetch:fetchComTimeout(5000)}
});

/* ---------- teste único e rápido de conectividade ----------
   Cadastro/Solicitações fazem várias chamadas em paralelo ao mesmo
   servidor — se a rede estiver bloqueando, o navegador enfileira boa
   parte delas atrás do limite de conexões simultâneas por site, e cada
   uma ainda espera seu próprio timeout: a tela ficava presa por 40-50s.
   Este teste faz UMA chamada rápida primeiro; se falhar, todo o resto
   já sabe (por até 30s) que não vale a pena tentar e usa o cache local
   na hora, sem fila de timeouts. */
let __supaReachable=null, __supaCheckedAt=0;
async function isSupabaseReachable(){
  const now=Date.now();
  if(__supaReachable!==null && (now-__supaCheckedAt)<30000)return __supaReachable;
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),3000);
    await fetch(SUPABASE_URL+'/auth/v1/health',{signal:controller.signal});
    clearTimeout(timer);
    __supaReachable=true;
  }catch(e){
    __supaReachable=false;
  }
  __supaCheckedAt=now;
  return __supaReachable;
}

function supaErrToast(err,prefixo){
  console.error(prefixo||'Supabase',err);
  toast((prefixo?prefixo+': ':'')+(err?.message||'Erro ao falar com o servidor.'),'err');
}

/* Extrai o código (antes de " · ") de um valor de <select> preenchido por
   fillSelect() — os <option> guardam o rótulo composto "COD · Nome" como
   value, não só o código. */
function codFromLabel(label){return (label||'').split(' · ')[0]||null}

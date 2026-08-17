/* =========================================================
   Supabase — cliente e helpers compartilhados por todo o app
   ========================================================= */
const SUPABASE_URL='https://bspnnffthkfvpccceontc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_oGmSeQXhV1QCfW_4vZX4Lg_lGDFFT_a';
/* Sem "const"/"let" aqui de propósito: o CDN do supabase-js já expõe um
   global chamado "supabase" (a biblioteca) — declarar de novo com const/let
   dá SyntaxError "already been declared" (scripts clássicos compartilham o
   mesmo escopo global). Reatribuir sem palavra-chave reaproveita esse global,
   trocando a biblioteca pelo cliente já conectado — e todo o resto do app
   continua chamando supabase.from(...) normalmente. */
supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

function supaErrToast(err,prefixo){
  console.error(prefixo||'Supabase',err);
  toast((prefixo?prefixo+': ':'')+(err?.message||'Erro ao falar com o servidor.'),'err');
}

/* Extrai o código (antes de " · ") de um valor de <select> preenchido por
   fillSelect() — os <option> guardam o rótulo composto "COD · Nome" como
   value, não só o código. */
function codFromLabel(label){return (label||'').split(' · ')[0]||null}

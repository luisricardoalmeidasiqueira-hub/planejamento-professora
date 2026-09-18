// Essa função roda no servidor da Netlify, nunca no navegador da pessoa.
// Por isso as senhas guardadas aqui (via variável de ambiente) ficam escondidas de verdade.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, erro: 'Método não permitido' }) };
  }

  let senhaRecebida = '';
  try {
    const dados = JSON.parse(event.body || '{}');
    senhaRecebida = String(dados.senha || '').trim();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, erro: 'Requisição inválida' }) };
  }

  if (!senhaRecebida) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false }),
    };
  }

  // As senhas de verdade ficam na variável de ambiente SENHAS_PROFESSORAS,
  // configurada no painel da Netlify (Site settings > Environment variables).
  // Formato esperado (JSON): {"Adriana":"1234","Fulana":"5678"}
  let senhas = {};
  try {
    senhas = JSON.parse(process.env.SENHAS_PROFESSORAS || '{}');
  } catch (e) {
    senhas = {};
  }

  const nomeEncontrado = Object.keys(senhas).find((nome) => senhas[nome] === senhaRecebida);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      nomeEncontrado ? { ok: true, nome: nomeEncontrado } : { ok: false }
    ),
  };
};

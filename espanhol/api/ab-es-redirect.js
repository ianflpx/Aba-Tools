module.exports = (req, res) => {
  const cookieName = "ab_pat_es";
  const cookies = req.headers.cookie || "";

  // Verifica se o usuário já tem uma variante definida no cookie
  const match = cookies.match(new RegExp(`${cookieName}=([^;]+)`));
  let variant = match ? match[1] : null;

  // Se não tiver, define 50/50
  if (variant !== "v2" && variant !== "v3") {
    variant = Math.random() < 0.5 ? "v2" : "v3";
  }

  // --- O SEGREDO DA CORREÇÃO AQUI ---
  // Captura tudo o que vem depois da "?" na URL (UTMs, IDs, etc.)
  const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';

  // Define o destino base conforme a variante
  // Ajustei para "patv2" e "patv3" conforme você descreveu a estrutura de pastas
  const basePath = variant === "v2" ? "/patv2/" : "/patv3/";

  // Monta a URL final concatenando o caminho e os parâmetros originais
  const dest = basePath + queryString;

  // Define o cookie para manter o usuário na mesma página em visitas futuras
  res.setHeader(
    "Set-Cookie",
    `${cookieName}=${variant}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
  );

  // Executa o redirecionamento com as UTMs preservadas
  res.statusCode = 302;
  res.setHeader("Location", dest);
  res.end();
};

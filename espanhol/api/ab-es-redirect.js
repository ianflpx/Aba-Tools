module.exports = (req, res) => {
  const cookieName = "ab_pat_es";
  const cookies = req.headers.cookie || "";

  const match = cookies.match(new RegExp(`${cookieName}=([^;]+)`));
  let variant = match ? match[1] : null;

  if (variant !== "v2" && variant !== "v3") {
    variant = Math.random() < 0.5 ? "v2" : "v3";
  }

  const dest = variant === "v2" ? "/pat-v2/" : "/pat-v3/";

  res.setHeader(
    "Set-Cookie",
    `${cookieName}=${variant}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
  );

  res.statusCode = 302;
  res.setHeader("Location", dest);
  res.end();
};

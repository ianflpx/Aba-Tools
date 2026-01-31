export const config = { runtime: "edge" };

export default function handler(req) {
  const cookieName = "ab_pat_es";
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`));
  let variant = match ? match[1] : null;

  if (variant !== "v2" && variant !== "v3") {
    variant = Math.random() < 0.5 ? "v2" : "v3";
  }

  const dest = variant === "v2" ? "/pat-es-v2/" : "/pat-es-v3/";

  const res = Response.redirect(dest, 302);
  res.headers.set(
    "Set-Cookie",
    `${cookieName}=${variant}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
  );
  return res;
}

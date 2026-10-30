import { getStore } from "@netlify/blobs";
import { scryptSync, randomBytes, timingSafeEqual, createHmac, createHash } from "node:crypto";

export const config = { path: "/api/*" };

const st = () => getStore("conceptlab");
const hs = () => getStore("history");
const ss = () => getStore("sync");
const keyOf = (email) => createHash("sha256").update(String(email)).digest("hex").slice(0, 40);
const HISTORY_MAX = 20;
async function snapshot(content, by) {
  const idx = (await st().get("historyIndex", { type: "json" })) || [];
  const id = "v" + Date.now().toString(36) + randomBytes(2).toString("hex");
  await hs().setJSON(id, content);
  idx.unshift({ id, at: new Date().toISOString(), by: String(by || ""), bytes: JSON.stringify(content).length, chapters: Array.isArray(content.chapters) ? content.chapters.length : 0 });
  const drop = idx.splice(HISTORY_MAX);
  for (const d of drop) { try { await hs().delete(d.id); } catch {} }
  await st().setJSON("historyIndex", idx);
  return id;
}
const ms = () => getStore("media");
const J = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const H = (p, s) => scryptSync(p, s, 32).toString("hex");
const setupKeyMatches = (candidate, configured) => {
  const a = createHash("sha256").update(String(candidate || "")).digest();
  const b = createHash("sha256").update(String(configured || "")).digest();
  return timingSafeEqual(a, b);
};
const configuredSetupKey = () => {
  try {
    const runtimeValue = globalThis.Netlify?.env?.get?.("CONCEPTLAB_ADMIN_SETUP_KEY");
    if (runtimeValue != null) return String(runtimeValue);
  } catch {}
  return String(process.env.CONCEPTLAB_ADMIN_SETUP_KEY || "");
};
const users = async () => (await st().get("users", { type: "json" })) || {};
const students = async () => (await st().get("students", { type: "json" })) || {};
const saveU = (u) => st().setJSON("users", u);
async function secret() { let s = await st().get("secret"); if (!s) { s = randomBytes(32).toString("hex"); await st().set("secret", s); } return s; }
async function sign(u) { const b = Buffer.from(JSON.stringify({ u, e: Date.now() + 12 * 36e5 })).toString("base64url"); return b + "." + createHmac("sha256", await secret()).update(b).digest("base64url"); }
async function signStudent(email) { const b = Buffer.from(JSON.stringify({ student: email, e: Date.now() + 30 * 24 * 36e5 })).toString("base64url"); return b + "." + createHmac("sha256", await secret()).update(b).digest("base64url"); }
async function whoStudent(req) {
  try {
    const [b, g] = (req.headers.get("authorization") || "").replace("Bearer ", "").split(".");
    if (!b || !g) return null;
    const x = createHmac("sha256", await secret()).update(b).digest("base64url");
    if (g.length !== x.length || !timingSafeEqual(Buffer.from(g), Buffer.from(x))) return null;
    const o = JSON.parse(Buffer.from(b, "base64url").toString());
    if (!o.student || o.e < Date.now()) return null;
    return (await students())[o.student] ? o.student : null;
  } catch { return null; }
}
async function who(req) {
  try {
    const [b, g] = (req.headers.get("authorization") || "").replace("Bearer ", "").split(".");
    const x = createHmac("sha256", await secret()).update(b).digest("base64url");
    if (g.length !== x.length || !timingSafeEqual(Buffer.from(g), Buffer.from(x))) return null;
    const o = JSON.parse(Buffer.from(b, "base64url").toString());
    if (o.e < Date.now()) return null;
    return (await users())[o.u] ? o.u : null;
  } catch { return null; }
}
function mk(us, b) {
  const u = String(b.username || "").trim().toLowerCase(), p = String(b.password || "");
  if (!/^[a-z0-9_.-]{3,30}$/.test(u)) throw new Error("Username: 3-30 letters, numbers, . _ -");
  if (p.length < 8) throw new Error("Password must be at least 8 characters");
  if (us[u]) throw new Error("That username already exists");
  const s = randomBytes(16).toString("hex"); us[u] = { s, h: H(p, s) }; return u;
}
function users_ok(rec, p) { if (!rec) return false; const a = Buffer.from(H(p, rec.s)), b = Buffer.from(rec.h); return a.length === b.length && timingSafeEqual(a, b); }
const SIMS = ["bohr", "rutherford", "rutherfordModel", "line", "force", "flame", "wave", "projectile", "pendulum", "spring", "circuit", "gas", "vectors", "unit", "tangent", "matrix", "circle", "kinetics", "equilibrium", "ph", "titration", "electrochem", "optics", "magnetic", "periodic", "bond", "stoich", "integration", "probability", "dalton", "atomBasics", "atomCounting", "thomson", "cathode", "spectrum", "emissionLines", "planckQuantum", "deBroglie", "uncertainty", "quantumNumbers", "quantum", "quantumSpin", "spinOrbitalDiagram", "orbitals", "orbitalCapacity", "aufbau", "nplusl", "pauli", "isotope", "isotopeCompare", "atomicNotation", "atomicNotation2", "valence", "hund", "ionization", "electroncloud", "isotone", "shellCapacity", "orbitalCount", "aufbauOrder", "hundRule", "electronConfig", "valenceShell", "custom", "none"];
const SEC_TYPES = ["marquee", "stats", "goals", "stages", "lab", "arcade", "purpose", "features", "roadmap", "subjects", "faq", "cta", "text"];
const GAME_TYPES = ["blitz", "memory", "tf", "scramble", "balance", "cannon", "slope", "flame", "periodic", "massAtlas", "elementSprint", "trendDuel", "oddOne", "stepOrder"];
const MISSION_GOALS = ["stages", "quiz", "games", "sims", "daily", "xp", "perfect", "review"];
const BADGE_KINDS = ["xp", "stages", "sims", "games", "streak", "perfect"];
const isId = (v, n = 40) => typeof v === "string" && new RegExp("^[a-zA-Z0-9_-]{1,%d}$".replace("%d", n)).test(v);
function validateExtra(b) {
  if (b.home != null) {
    if (!b.home || !Array.isArray(b.home.sections) || b.home.sections.length > 60) throw new Error("Invalid home sections");
    for (const s of b.home.sections) {
      if (!s || !(SEC_TYPES.includes(s.type) || (typeof s.type === "string" && /^[A-Za-z][A-Za-z0-9_-]{0,39}$/.test(s.type))) || !isId(s.id, 60)) throw new Error("Invalid home section");
      if (s.items != null && (!Array.isArray(s.items) || s.items.length > 60)) throw new Error("Invalid section items");
    }
  }
  if (b.games != null) {
    if (!Array.isArray(b.games) || b.games.length > 40) throw new Error("Invalid games");
    const ids = new Set();
    for (const g of b.games) {
      if (!g || !GAME_TYPES.includes(g.type) || !isId(g.id) || ids.has(g.id) || typeof g.t !== "string") throw new Error("Invalid game");
      ids.add(g.id);
      if (g.data != null && typeof g.data !== "object") throw new Error("Invalid game data");
    }
  }
  if (b.labs != null) {
    if (!Array.isArray(b.labs) || b.labs.length > 250) throw new Error("Invalid simulations list");
    for (const l of b.labs) if (!l || !isId(l.id) || !SIMS.includes(l.sim) || typeof l.t !== "string") throw new Error("Invalid simulation entry");
  }
  if (b.deletedGames != null && (!Array.isArray(b.deletedGames) || b.deletedGames.length > 80 || b.deletedGames.some((x) => !isId(x)))) throw new Error("Invalid deleted games list");
  if (b.daily != null) {
    const d = b.daily;
    if (typeof d !== "object" || Array.isArray(d)) throw new Error("Invalid daily challenge settings");
    if (d.count != null && !(Number(d.count) >= 1 && Number(d.count) <= 20)) throw new Error("Daily question count must be 1-20");
    if (d.xp != null && !(Number(d.xp) >= 0 && Number(d.xp) <= 500)) throw new Error("Invalid daily XP");
    if (d.pinned != null && (!Array.isArray(d.pinned) || d.pinned.length > 40 || d.pinned.some((x) => typeof x !== "string" || x.length > 80))) throw new Error("Invalid pinned daily questions");
  }
  if (b.missions != null) {
    if (!Array.isArray(b.missions) || b.missions.length > 80) throw new Error("Invalid missions");
    const ids = new Set();
    for (const m of b.missions) {
      if (!m || !isId(m.id) || ids.has(m.id) || typeof m.t !== "string") throw new Error("Invalid mission");
      ids.add(m.id);
      if (m.goals != null && (!Array.isArray(m.goals) || m.goals.length > 12 || m.goals.some((g) => !g || !MISSION_GOALS.includes(g.k) || !(Number(g.n) >= 1 && Number(g.n) <= 1000)))) throw new Error("Invalid mission goal");
    }
  }
  if (b.practice != null) {
    const p = b.practice;
    if (typeof p !== "object" || Array.isArray(p)) throw new Error("Invalid practice settings");
    if (p.intervals != null && (!Array.isArray(p.intervals) || p.intervals.length < 1 || p.intervals.length > 8 || p.intervals.some((x) => !(Number(x) >= 0 && Number(x) <= 365)))) throw new Error("Revision intervals must be 1-8 numbers of days (0-365)");
    if (p.sessionSize != null && !(Number(p.sessionSize) >= 1 && Number(p.sessionSize) <= 50)) throw new Error("Practice session size must be 1-50");
  }
  if (b.gam != null) {
    if (typeof b.gam !== "object") throw new Error("Invalid rewards");
    for (const k of ["xpStage", "xpSim", "xpQuiz", "lvl"]) if (b.gam[k] != null && !(Number(b.gam[k]) >= 0)) throw new Error("Invalid XP number");
    if (b.gam.badges != null) {
      if (!Array.isArray(b.gam.badges) || b.gam.badges.length > 40) throw new Error("Invalid badges");
      for (const x of b.gam.badges) if (!x || !isId(x.id) || !BADGE_KINDS.includes(x.k) || typeof x.t !== "string") throw new Error("Invalid badge");
    }
  }
}
function validate(b) {
  if (!b || !Array.isArray(b.chapters) || !b.settings || !b.theme) throw new Error("Invalid content");
  if (JSON.stringify(b).length > 1500000) throw new Error("Content is too large");
  for (const k of ["p", "s", "a", "bg"]) if (!/^#[0-9a-f]{6}$/i.test(b.theme[k])) throw new Error("Invalid colour");
  if (b.theme.glow != null && !/^#[0-9a-f]{6}$/i.test(b.theme.glow)) throw new Error("Invalid glow colour");
  if (b.theme.fx != null && !["on", "off"].includes(b.theme.fx)) throw new Error("Invalid effects setting");
  const subs = Array.isArray(b.subjects) && b.subjects.length ? b.subjects : [{ id: "math", name: "" }, { id: "chem", name: "" }, { id: "phy", name: "" }];
  for (const s of subs) if (!/^[a-z0-9-]{2,30}$/.test(s.id) || typeof s.name !== "string") throw new Error("Invalid subject");
  if (b.texts && (typeof b.texts !== "object" || Object.values(b.texts).some((v) => typeof v !== "string"))) throw new Error("Invalid texts");
  validateExtra(b);
  const ids = new Set();
  for (const c of b.chapters) {
    if (!/^[a-z0-9-]{2,60}$/.test(c.id) || ids.has(c.id)) throw new Error("Invalid or duplicate chapter id");
    ids.add(c.id);
    if (!subs.some((s) => s.id === c.s)) throw new Error("Invalid subject");
    if (!["available", "soon"].includes(c.status)) throw new Error("Invalid status");
    if (!SIMS.includes(c.sim)) throw new Error("Invalid simulation");
    for (const f of ["t", "hook", "intu"]) if (typeof c[f] !== "string") throw new Error("Invalid text");
    if (c.blocks && (!Array.isArray(c.blocks) || c.blocks.some((x) => typeof x.v !== "string" || !["text", "head", "image", "video", "note", "pdf"].includes(x.t)))) throw new Error("Invalid content blocks");
    if (!Array.isArray(c.q)) throw new Error("Invalid questions");
    for (const q of c.q) if (typeof q.q !== "string" || !Array.isArray(q.o) || q.o.length !== 4 || ![0, 1, 2, 3].includes(+q.a)) throw new Error("Invalid question");
  }
}

export default async (req) => {
  const p = new URL(req.url).pathname.replace(/^\/api/, "").replace(/\/$/, "");
  const m = req.method;
  try {
    if (m === "GET" && p.startsWith("/media/") && /^[a-f0-9]{8,40}$/.test(p.slice(7))) {
      const r = await ms().getWithMetadata(p.slice(7), { type: "arrayBuffer" });
      if (!r) return J({ error: "Not found" }, 404);
      return new Response(r.data, { headers: { "content-type": r.metadata?.type || "image/webp", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }
    if (p === "/content" && m === "GET") return J((await st().get("content", { type: "json" })) || {}, 200, { "cache-control": "no-store, no-cache, must-revalidate, max-age=0" });
    if (p === "/student-leaderboard" && m === "GET") { const all = await students(); const rows = Object.values(all).map((u) => ({ name: String(u.name || "Student"), avatar: String(u.avatar || ""), xp: Math.max(0, Number(u.xp) || 0) })).sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name)); return J({ count: rows.length, students: rows }); }
    if (p === "/status" && m === "GET") {
      const setup = !Object.keys(await users()).length;
      return J({ setup, setupReady: !setup || configuredSetupKey().length >= 24 });
    }
    const body = m === "GET" ? {} : await req.json().catch(() => ({}));
    if (p === "/feedback" && m === "POST") {
      if (String(body.website || "").trim()) return J({ received: true });
      const message = String(body.message || "").trim();
      const name = String(body.name || "").trim().slice(0, 80);
      const email = String(body.email || "").trim().slice(0, 254);
      const page = String(body.page || "#/about").slice(0, 180);
      if (message.length < 5 || message.length > 2000) return J({ error: "Message must be 5–2000 characters" }, 400);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return J({ error: "Enter a valid email address or leave it blank" }, 400);
      const feedback = (await st().get("feedback", { type: "json" })) || [];
      if (!Array.isArray(feedback)) return J({ error: "Feedback storage is unavailable" }, 500);
      const now = Date.now();
      const recent = feedback.filter((x) => x && now - Date.parse(x.createdAt || 0) < 10 * 60 * 1000);
      if (recent.length >= 500) return J({ error: "Feedback is temporarily busy. Please try again later." }, 429);
      const item = { id: randomBytes(8).toString("hex"), name: name || "Anonymous", email, message, page, createdAt: new Date().toISOString(), read: false };
      feedback.unshift(item);
      await st().setJSON("feedback", feedback.slice(0, 1000));
      return J({ sent: true, id: item.id }, 201);
    }
    if (p === "/reviews" && m === "POST") {
      if (String(body.website || "").trim()) return J({ received: true });
      const message = String(body.message || "").trim();
      const suppliedName = String(body.name || "").trim().slice(0, 80);
      const rating = Number(body.rating);
      const page = String(body.page || "#/about").slice(0, 180);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return J({ error: "Choose a rating from 1 to 5 stars" }, 400);
      if (message.length < 10 || message.length > 1200) return J({ error: "Review must be 10–1200 characters" }, 400);
      const reviews = (await st().get("reviews", { type: "json" })) || [];
      if (!Array.isArray(reviews)) return J({ error: "Review storage is unavailable" }, 500);
      const now = Date.now();
      const recent = reviews.filter((x) => x && now - Date.parse(x.createdAt || 0) < 10 * 60 * 1000);
      if (recent.length >= 120) return J({ error: "Reviews are temporarily busy. Please try again later." }, 429);
      const studentEmail = await whoStudent(req);
      const studentRecord = studentEmail ? (await students())[studentEmail] : null;
      const verifiedStudent = !!studentRecord;
      const studentName = verifiedStudent ? String(studentRecord.name || "Student").slice(0, 80) : (suppliedName || "Anonymous");
      const item = {
        id: randomBytes(8).toString("hex"),
        name: studentName,
        reviewerType: verifiedStudent ? "student" : "guest",
        rating,
        message,
        page,
        createdAt: new Date().toISOString(),
        read: false
      };
      reviews.unshift(item);
      await st().setJSON("reviews", reviews.slice(0, 1500));
      return J({ sent: true, id: item.id }, 201);
    }
    if (p === "/student-signup" && m === "POST") {
      const name = String(body.name || "").trim(), school = String(body.school || "").trim(), email = String(body.email || "").trim().toLowerCase(), password = String(body.password || "");
      if (name.length < 2 || name.length > 80) return J({ error: "Name must be 2–80 characters" }, 400);
      if (school.length < 2 || school.length > 120) return J({ error: "Institute name must be 2–120 characters" }, 400);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return J({ error: "Enter a valid email address" }, 400);
      if (password.length < 8 || password.length > 200) return J({ error: "Password must be at least 8 characters" }, 400);
      const us = await students();
      if (us[email]) return J({ error: "An account with this email already exists" }, 409);
      const salt = randomBytes(16).toString("hex");
      us[email] = { name, email, school, s: salt, h: H(password, salt), createdAt: new Date().toISOString(), xp: 0 };
      await st().setJSON("students", us);
      return J({ token: await signStudent(email), user: { name, email, school, xp: 0 } }, 201);
    }
    if (p === "/student-login" && m === "POST") {
      const email = String(body.email || "").trim().toLowerCase(), password = String(body.password || ""), us = await students(), rec = us[email];
      if (!users_ok(rec, password)) { await new Promise((r) => setTimeout(r, 350)); return J({ error: "Incorrect email or password" }, 401); }
      return J({ token: await signStudent(email), user: { name: rec.name, email: rec.email, school: rec.school || "", avatar: rec.avatar || "", bio: rec.bio || "", location: rec.location || "", xp: rec.xp || 0 } });
    }
    if (p === "/setup" && m === "POST") {
      const us = await users();
      if (Object.keys(us).length) return J({ error: "Already set up" }, 403);
      const expected = configuredSetupKey();
      if (expected.length < 24) return J({ error: "Admin setup is locked. Set CONCEPTLAB_ADMIN_SETUP_KEY to a secret of at least 24 characters in Netlify environment variables, then redeploy." }, 503);
      if (!setupKeyMatches(body.setupKey, expected)) return J({ error: "The initial setup key is incorrect" }, 403);
      const u = mk(us, body); await saveU(us); return J({ token: await sign(u), user: u });
    }
    if (p === "/login" && m === "POST") {
      const us = await users(), u = String(body.username || "").trim().toLowerCase();
      if (!users_ok(us[u], String(body.password || ""))) { await new Promise((r) => setTimeout(r, 600)); return J({ error: "Wrong username or password" }, 401); }
      return J({ token: await sign(u), user: u });
    }
    if (p === "/student-profile" && (m === "GET" || m === "PUT")) {
      const email = await whoStudent(req);
      if (!email) return J({ error: "Please sign in again" }, 401);
      const all = await students(), rec = all[email];
      if (!rec) return J({ error: "Student account not found" }, 404);
      if (m === "GET") return J({ user: { name: rec.name, email: rec.email, school: rec.school || "", xp: Math.max(0, Number(rec.xp) || 0), avatar: rec.avatar || "", bio: rec.bio || "", location: rec.location || "" } });
      const name = String(body.name || "").trim();
      if (name.length < 2 || name.length > 80) return J({ error: "Name must be 2–80 characters" }, 400);
      const school = String(body.school || "").trim();
      if (school.length < 2 || school.length > 120) return J({ error: "Institute name must be 2–120 characters" }, 400);
      const avatar = String(body.avatar || "");
      if (avatar && (!/^data:image\/(jpeg|png|webp);base64,/.test(avatar) || avatar.length > 900000)) return J({ error: "Profile picture must be a JPG, PNG, or WebP under 650 KB" }, 400);
      rec.name = name; rec.avatar = avatar; rec.bio = String(body.bio || "").trim().slice(0, 240); rec.school = String(body.school || "").trim().slice(0, 120); rec.location = String(body.location || "").trim().slice(0, 120);
      all[email] = rec; await st().setJSON("students", all);
      return J({ user: { name: rec.name, email: rec.email, school: rec.school || "", xp: Math.max(0, Number(rec.xp) || 0), avatar: rec.avatar || "", bio: rec.bio || "", location: rec.location || "" } });
    }
    if (p === "/student-progress") {
      const email = await whoStudent(req);
      if (!email) return J({ error: "Please sign in again" }, 401);
      const all = await students(), rec = all[email];
      if (m === "GET") return J({ user: { name: rec.name, email: rec.email, xp: Math.max(0, Number(rec.xp) || 0) } });
      if (m === "POST") {
        const delta = Math.floor(Number(body.delta));
        if (!Number.isFinite(delta) || delta < 1 || delta > 600) return J({ error: "Invalid XP award" }, 400);
        rec.xp = Math.max(0, Number(rec.xp) || 0) + delta;
        all[email] = rec; await st().setJSON("students", all);
        return J({ xp: rec.xp });
      }
      return J({ error: "Method not allowed" }, 405);
    }
    if (p === "/student-sync") {
      const email = await whoStudent(req);
      if (!email) return J({ error: "Please sign in again" }, 401);
      if (m === "GET") {
        const row = await ss().get(keyOf(email), { type: "json" });
        return J({ sync: row || null });
      }
      if (m === "PUT") {
        const d = body && body.data;
        if (!d || typeof d !== "object" || Array.isArray(d)) return J({ error: "Invalid sync data" }, 400);
        const out = {};
        for (const k of ["cl", "cl2", "study", "mis"]) { if (d[k] != null) { if (typeof d[k] !== "object" || Array.isArray(d[k])) return J({ error: "Invalid sync data" }, 400); out[k] = d[k]; } }
        if (out.cl2) delete out.cl2.xp;
        if (JSON.stringify(out).length > 250000) return J({ error: "Progress data is too large to sync" }, 413);
        const row = { at: new Date().toISOString(), data: out };
        await ss().setJSON(keyOf(email), row);
        return J({ saved: true, at: row.at });
      }
      return J({ error: "Method not allowed" }, 405);
    }
    const me = await who(req);
    if (!me) return J({ error: "Please sign in again" }, 401);
    if (p === "/me" && m === "GET") return J({ user: me });
    if (p === "/feedback" && m === "GET") {
      const feedback = (await st().get("feedback", { type: "json" })) || [];
      return J({ count: feedback.length, unread: feedback.filter((x) => !x.read).length, feedback: feedback.slice().sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))) });
    }
    if (p === "/reviews" && m === "GET") {
      const reviews = (await st().get("reviews", { type: "json" })) || [];
      const list = Array.isArray(reviews) ? reviews : [];
      const ratingTotal = list.reduce((sum, item) => sum + Math.max(0, Math.min(5, Number(item.rating) || 0)), 0);
      return J({
        count: list.length,
        unread: list.filter((x) => !x.read).length,
        average: list.length ? Math.round((ratingTotal / list.length) * 10) / 10 : 0,
        reviews: list.slice().sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      });
    }
    if (p === "/reviews" && m === "PUT") {
      const id = String(body.id || "");
      if (!/^[a-f0-9]{16}$/.test(id)) return J({ error: "Invalid review ID" }, 400);
      const reviews = (await st().get("reviews", { type: "json" })) || [];
      const item = reviews.find((x) => x.id === id);
      if (!item) return J({ error: "Review not found" }, 404);
      item.read = !!body.read;
      await st().setJSON("reviews", reviews);
      return J({ updated: true });
    }
    if (p === "/reviews" && m === "DELETE") {
      const id = String(body.id || "");
      if (!/^[a-f0-9]{16}$/.test(id)) return J({ error: "Invalid review ID" }, 400);
      const reviews = (await st().get("reviews", { type: "json" })) || [];
      const next = reviews.filter((x) => x.id !== id);
      if (next.length === reviews.length) return J({ error: "Review not found" }, 404);
      await st().setJSON("reviews", next);
      return J({ removed: true });
    }
    if (p === "/feedback" && m === "PUT") {
      const id = String(body.id || "");
      if (!/^[a-f0-9]{16}$/.test(id)) return J({ error: "Invalid feedback ID" }, 400);
      const feedback = (await st().get("feedback", { type: "json" })) || [];
      const item = feedback.find((x) => x.id === id);
      if (!item) return J({ error: "Feedback not found" }, 404);
      item.read = !!body.read;
      await st().setJSON("feedback", feedback);
      return J({ updated: true });
    }
    if (p === "/feedback" && m === "DELETE") {
      const id = String(body.id || "");
      if (!/^[a-f0-9]{16}$/.test(id)) return J({ error: "Invalid feedback ID" }, 400);
      const feedback = (await st().get("feedback", { type: "json" })) || [];
      const next = feedback.filter((x) => x.id !== id);
      if (next.length === feedback.length) return J({ error: "Feedback not found" }, 404);
      await st().setJSON("feedback", next);
      return J({ removed: true });
    }
    if (p === "/student-stats" && m === "GET") { const all = await students(); const rows = Object.values(all).map((u) => ({ name: String(u.name || "Student"), email: String(u.email || ""), school: String(u.school || ""), xp: Math.max(0, Number(u.xp) || 0), createdAt: u.createdAt || null })).sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))); return J({ count: rows.length, students: rows }); }
    if (p === "/content" && m === "PUT") {
      validate(body);
      const prev = await st().get("content", { type: "json" });
      if (prev && Object.keys(prev).length) { try { await snapshot(prev, me); } catch {} }
      await st().setJSON("content", body);
      return J({ saved: true });
    }
    if (p === "/content-history" && m === "GET") return J({ items: (await st().get("historyIndex", { type: "json" })) || [] });
    if (p === "/content-history" && m === "POST") {
      const id = String(body.id || "");
      if (!/^v[a-z0-9]{4,30}$/.test(id)) throw new Error("Invalid version id");
      const old = await hs().get(id, { type: "json" });
      if (!old) throw new Error("That version no longer exists");
      validate(old);
      const cur = await st().get("content", { type: "json" });
      if (cur && Object.keys(cur).length) { try { await snapshot(cur, me + " (before restore)"); } catch {} }
      await st().setJSON("content", old);
      return J({ restored: true });
    }
    if (p === "/student-insights" && m === "GET") {
      const all = Object.values(await students()).slice(0, 400);
      let withSync = 0, active7 = 0, attempts = 0, accSum = 0, accN = 0, streakBest = 0;
      const missed = {}, dayCount = {};
      const since = Date.now() - 7 * 864e5;
      for (const u of all) {
        const row = await ss().get(keyOf(u.email), { type: "json" }).catch(() => null);
        if (!row || !row.data) continue;
        withSync++;
        if (Date.parse(row.at || 0) >= since) active7++;
        const study = row.data.study || {};
        (study.history || []).forEach((h) => { attempts++; if (Number.isFinite(h.accuracy)) { accSum += h.accuracy; accN++; } });
        (study.review || []).forEach((r) => { if (r && r.conceptId) missed[r.conceptId] = (missed[r.conceptId] || 0) + (Number(r.wrongCount) || 1); });
        streakBest = Math.max(streakBest, Number((row.data.cl2 || {}).streak) || 0);
      }
      const top = Object.entries(missed).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([conceptId, wrong]) => ({ conceptId, wrong }));
      return J({ students: all.length, withSync, active7, attempts, avgAccuracy: accN ? Math.round(accSum / accN) : null, bestStreak: streakBest, topMissed: top, dayCount });
    }
    if (p === "/media-list" && m === "GET") {
      const { blobs } = await ms().list();
      return J({ items: await Promise.all(blobs.map(async (b) => ({ id: b.key, name: (await ms().getMetadata(b.key))?.metadata?.name || b.key, url: "/api/media/" + b.key }))) });
    }
    if (p === "/media" && m === "POST") {
      if (!["image/webp", "image/jpeg", "image/png", "image/gif", "application/pdf"].includes(body.type)) throw new Error("Only images and PDF files are allowed");
      const buf = Buffer.from(String(body.data || ""), "base64");
      if (!buf.length || buf.length > 4.2e6) throw new Error("File is empty or too large (max 4 MB)");
      const id = randomBytes(8).toString("hex");
      await ms().set(id, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), { metadata: { name: String(body.name || "image").slice(0, 80), type: body.type } });
      return J({ id, url: "/api/media/" + id });
    }
    if (p === "/media" && m === "DELETE") { if (!/^[a-f0-9]{8,40}$/.test(String(body.id))) throw new Error("Bad id"); await ms().delete(body.id); return J({ removed: true }); }
    if (p === "/users" && m === "GET") return J({ users: Object.keys(await users()), me });
    if (p === "/users" && m === "POST") { const us = await users(); const u = mk(us, body); await saveU(us); return J({ added: u }); }
    if (p === "/users" && m === "DELETE") {
      const us = await users(), u = String(body.username || "");
      if (u === me) throw new Error("You cannot remove yourself");
      if (!us[u]) throw new Error("User not found");
      delete us[u]; await saveU(us); return J({ removed: u });
    }
    if (p === "/password" && m === "POST") {
      const us = await users();
      if (!users_ok(us[me], String(body.old || ""))) throw new Error("Current password is wrong");
      if (String(body.new || "").length < 8) throw new Error("New password must be at least 8 characters");
      const s = randomBytes(16).toString("hex"); us[me] = { s, h: H(String(body.new), s) }; await saveU(us); return J({ changed: true });
    }
    return J({ error: "Not found" }, 404);
  } catch (e) { return J({ error: e.message || "Server error" }, 400); }
};

import api from "../../cloudflare/api.mjs";

export async function onRequest({ request, env }) {
  return api(request, env);
}

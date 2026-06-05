import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Public signup endpoint for parents and tutors.
 *
 * Why this exists: the project has email confirmation enabled, so a plain
 * client-side supabase.auth.signUp() does not return a session and the user
 * cannot proceed. This function uses the service role to create an
 * already-confirmed auth user and insert the matching profile row, then the
 * client signs in normally. The service role key NEVER leaves the server.
 *
 * Body: { role: 'parent'|'tutor', email, password, full_name, phone?,
 *         subjects?: string[], qualifications?, bio? }
 */

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const role = String(payload.role || "");
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const full_name = String(payload.full_name || "").trim();

  if (role !== "parent" && role !== "tutor") {
    return json({ error: "invalid_role" }, 400);
  }
  if (!email || !email.includes("@")) {
    return json({ error: "invalid_email" }, 400);
  }
  if (password.length < 6) {
    return json({ error: "weak_password" }, 400);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Create an already-confirmed auth user.
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });

  if (createErr || !created?.user) {
    return json({ error: createErr?.message || "create_failed" }, 400);
  }

  const userId = created.user.id;

  // Insert the matching profile row with the service role (bypasses RLS).
  let insertErr;
  if (role === "parent") {
    const { error } = await admin.from("parents").insert({
      id: userId,
      email,
      full_name,
      phone: payload.phone ? String(payload.phone).trim() : null,
    });
    insertErr = error;
  } else {
    const subjects = Array.isArray(payload.subjects)
      ? (payload.subjects as unknown[]).map((s) => String(s)).filter(Boolean)
      : [];
    const { error } = await admin.from("tutors").insert({
      id: userId,
      email,
      full_name,
      subjects,
      qualifications: payload.qualifications
        ? String(payload.qualifications).trim()
        : null,
      bio: payload.bio ? String(payload.bio).trim() : null,
      status: "pending_approval",
    });
    insertErr = error;
  }

  if (insertErr) {
    // Roll back the auth user so a retry can succeed cleanly.
    await admin.auth.admin.deleteUser(userId);
    return json({ error: insertErr.message }, 400);
  }

  return json({ ok: true, user_id: userId });
});

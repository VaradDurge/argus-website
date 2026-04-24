import { google } from "googleapis";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function pruneRateLimitStore(now: number) {
  for (const [ip, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const ip = getClientIp(request);

  if (rateLimitStore.size > 500) {
    pruneRateLimitStore(now);
  }

  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  rateLimitStore.set(ip, { ...existing, count: existing.count + 1 });
  return false;
}

function validateWaitlistInput(input: unknown) {
  if (!input || typeof input !== "object") {
    return { error: "Invalid request body." };
  }

  const body = input as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return { error: "Invalid request body." };
  }

  if (name.length < 2 || name.length > 80) {
    return { error: "Please enter a valid name." };
  }

  if (!EMAIL_RE.test(email) || email.length > 160) {
    return { error: "Please enter a valid email." };
  }

  return { value: { name, email } };
}

/** A1 range for a tab: names with hyphens/spaces/etc. must be wrapped in quotes. */
function sheetRange(sheetName: string, cellRange: string) {
  const escaped = sheetName.replace(/'/g, "''");
  return `'${escaped}'!${cellRange}`;
}

function getGoogleErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { error?: { message?: string; errors?: { message?: string }[] } } } })
      .response?.data;
    const msg = data?.error?.message;
    if (msg) return msg;
    const first = data?.error?.errors?.[0]?.message;
    if (first) return first;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(request)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const parsed = validateWaitlistInput(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = process.env.GOOGLE_SHEET_NAME ?? "Waitlist";

    if (!clientEmail || !privateKey || !spreadsheetId) {
      const missing = [
        !clientEmail && "GOOGLE_SERVICE_ACCOUNT_EMAIL",
        !privateKey && "GOOGLE_PRIVATE_KEY",
        !spreadsheetId && "GOOGLE_SHEET_ID",
      ].filter(Boolean) as string[];
      console.error("[waitlist] Missing env:", missing.join(", ") || "(unknown)");
      return NextResponse.json(
        {
          error: "Unable to join the waitlist right now.",
          ...(process.env.NODE_ENV === "development" && {
            detail: `Server env not loaded or empty: ${missing.join(", ")}. Restart dev after editing .env.local.`,
          }),
        },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetRange(sheetName, "A:C"),
      valueInputOption: "RAW",
      requestBody: {
        values: [[parsed.value.name, parsed.value.email, new Date().toISOString()]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const detail = getGoogleErrorMessage(err);
    console.error("[waitlist] Google Sheets append failed:", detail, err);
    return NextResponse.json(
      {
        error: "Unable to join the waitlist right now.",
        ...(process.env.NODE_ENV === "development" && { detail }),
      },
      { status: 500 }
    );
  }
}

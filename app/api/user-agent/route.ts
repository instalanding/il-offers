import { userAgent } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    console.log(request.headers.get('user-agent'), "User-Agent Header");
    const { os, cpu, isBot, ua, browser, device, engine } = userAgent(request);
    return Response.json({ os, cpu, isBot, ua, browser, device, engine });
  }
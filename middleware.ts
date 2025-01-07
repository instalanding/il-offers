import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { os, cpu, isBot, ua, browser, device, engine } = userAgent(request);
  
    url.searchParams.set('os', JSON.stringify(os));
    url.searchParams.set('cpu', JSON.stringify(cpu));
    url.searchParams.set('isBot', isBot.toString());
    url.searchParams.set('ua', ua);
    url.searchParams.set('browser', JSON.stringify(browser));
    url.searchParams.set('device', JSON.stringify(device));
    url.searchParams.set('engine', JSON.stringify(engine));
  
    return NextResponse.rewrite(url);
  }
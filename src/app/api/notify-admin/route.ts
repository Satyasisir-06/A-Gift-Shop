import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram credentials not set. Notification skipped.");
      return NextResponse.json({ success: false, message: 'API key not configured' }, { status: 500 });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in notify-admin route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

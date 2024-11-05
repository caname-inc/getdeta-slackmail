import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';

// Slackクライアントの初期化
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function GET() {
  const channelID = process.env.SLACK_CHANNEL_ID;

  if (!channelID) {
    return NextResponse.json({ error: 'SLACK_CHANNEL_ID is missing' }, { status: 500 });
  }

  try {
    // conversations.historyエンドポイントを使用してメッセージを取得
    const response = await slackClient.conversations.history({
      channel: channelID,
    });

    // レスポンス型を使ってチェック
    if (!response.ok) {
      throw new Error(response.error || 'Failed to fetch Slack messages');
    }

    return NextResponse.json({ messages: response.messages });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { channel, text } = await request.json();

  if (!channel || !text) {
    return NextResponse.json({ error: 'Channel and text are required' }, { status: 400 });
  }

  try {
    // Slackにメッセージを送信
    const response = await slackClient.chat.postMessage({
      channel: channel,
      text: text,
    });

    // レスポンスのチェック
    if (!response.ok) {
      throw new Error(response.error || 'Failed to send message');
    }

    return NextResponse.json({ message: 'Message sent successfully', ts: response.ts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
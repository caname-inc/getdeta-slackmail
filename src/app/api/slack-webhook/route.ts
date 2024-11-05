// src/app/api/slack-webhook/route.js
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    //console.log("Received Slack webhook:", data);
    console.dir(data, { depth: null });

    if (data.challenge) {
      // Slackのイベントの検証
      return NextResponse.json({ challenge: data.challenge });
    }

    // Slackのイベントを確認し、特定のチャンネルのメッセージを処理
    if (
      data.event &&
      data.event.type === "message" &&
      data.event.channel === process.env.SLACK_CHANNEL_ID
    ) {
      const message = data.event.text;
      const user = data.event.user;

      // 必要な処理をここで行う（例えばデータベースに保存、通知など）
      console.log(`New message from ${user}: ${message}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error processing Slack webhook:", error);
      return NextResponse.json(
        { status: "error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("予期しないエラーが発生しました", error);
    }
  }
}

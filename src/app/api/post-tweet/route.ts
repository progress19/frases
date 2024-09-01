import { TwitterApi } from 'twitter-api-v2';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ message: 'El cuerpo de la solicitud debe contener un status' }, { status: 400 });
    }

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const tweet = await twitterClient.v1.tweet(status);

    return NextResponse.json({ message: 'Tweet publicado exitosamente', tweet }, { status: 200 });
  } catch (error) {
    console.error('Error al publicar el tweet:', error);
    return NextResponse.json({ message: 'Error al publicar el tweet', error: error.message }, { status: 500 });
  }
}

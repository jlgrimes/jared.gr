import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface PreviewData {
  title: string;
  description?: string;
  image?: string;
}

async function fetchPreview(url: string): Promise<PreviewData> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Load HTML with Cheerio
    const $ = cheerio.load(html);

    // Get title
    const title =
      $('title').text() ||
      $('meta[property="og:title"]').attr('content') ||
      new URL(url).hostname;

    // Get description
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      undefined;

    // Get image - only return if it exists and is valid
    const imageUrl = $('meta[property="og:image"]').attr('content');
    const image = imageUrl ? imageUrl : undefined;

    return {
      title,
      description,
      image,
    };
  } catch (error) {
    console.error('Error fetching preview:', error);
    return {
      title: new URL(url).hostname,
      description: 'Failed to load preview',
      image: undefined,
    };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const preview = await fetchPreview(url);
    return NextResponse.json(preview);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview' },
      { status: 500 }
    );
  }
}

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) return new NextResponse('ID File tidak ditemukan', { status: 400 });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    // Ambil token akses secara manual
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    // Gunakan fungsi Fetch bawaan Next.js (Native Web Stream)
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const imageResponse = await fetch(driveUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!imageResponse.ok) {
      console.error("Gagal menarik dari Google Drive:", imageResponse.status);
      return new NextResponse('Gagal dari Google Drive', { status: imageResponse.status });
    }

    // Teruskan Web Stream langsung ke Client
    return new NextResponse(imageResponse.body, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error("Error API:", error);
    return new NextResponse('Gagal memproses gambar', { status: 500 });
  }
}
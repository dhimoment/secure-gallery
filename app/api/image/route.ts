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

    const drive = google.drive({ version: 'v3', auth });

    // PERBAIKAN: Menggunakan 'stream' agar Vercel tidak crash karena foto besar
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new NextResponse(response.data as any, {
      headers: {
        'Content-Type': 'image/jpeg',
        // Cache gambar selama 1 jam agar loading selanjutnya jauh lebih cepat
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error("Error image fetch:", error);
    return new NextResponse('Gagal memproses gambar', { status: 500 });
  }
}
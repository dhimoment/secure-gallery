// app/api/image/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('File ID tidak ditemukan', { status: 400 });
  }

  // Endpoint rahasia untuk mengambil gambar langsung dari Drive
  const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const response = await fetch(driveUrl);
    
    if (!response.ok) throw new Error('Gagal fetch dari Drive');

    // Ubah gambar menjadi buffer
    const arrayBuffer = await response.arrayBuffer();

    // Kirimkan buffer tersebut ke frontend sebagai file gambar
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        // Cegah browser menyimpan gambar di cache memori yang mudah diekstrak
        'Cache-Control': 'no-store, max-age=0', 
      },
    });
  } catch (error) {
    return new NextResponse('Gagal memproses gambar', { status: 500 });
  }
}
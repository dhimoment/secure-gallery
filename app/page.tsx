import SecureImage from '@/components/SecureImage';
import { google } from 'googleapis';

async function getFolderImages(folderId: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name)',
    });

    const files = response.data.files || [];
    
    // PERBAIKAN TYPESCRIPT: 
    // Menyaring file yang kosong, lalu memaksa (cast) tipe datanya menjadi string pasti.
    return files
      .filter((file) => file.id && file.name)
      .map((file) => ({
        id: file.id as string,
        name: file.name as string,
      }));

  } catch (error) {
    console.error("Gagal memuat folder:", error);
    return [];
  }
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { folder?: string };
}) {
  const folderId = searchParams.folder;
  const images = folderId ? await getFolderImages(folderId) : [];

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-widest uppercase text-white">
            Dhi Memories
          </h1>
          <p className="text-neutral-400 text-sm">Client Preview Gallery</p>
        </div>

        {folderId ? (
          images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* PERBAIKAN TYPESCRIPT: Karena data dari atas sudah pasti string, 
                  kita tidak perlu mendeklarasikan tipe manual di dalam .map() */}
              {images.map((img) => (
                <div key={img.id} className="bg-black p-2 rounded-xl shadow-xl ring-1 ring-neutral-800 flex flex-col justify-between">
                  <div className="relative overflow-hidden rounded-lg bg-neutral-950 flex justify-center items-center aspect-[3/4]">
                    <SecureImage imageUrl={`/api/image?id=${img.id}`} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 text-center truncate px-2">{img.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-12">Tidak ada foto ditemukan.</p>
          )
        ) : (
          <p className="text-neutral-500 text-center py-12">Silakan masukkan ID Folder pada URL.</p>
        )}
      </div>
    </main>
  );
}
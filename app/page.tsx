import SecureImage from '@/components/SecureImage';

// Menambahkan searchParams agar Next.js bisa membaca parameter URL
export default function GalleryPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  // Mengambil ID file dari parameter URL (misal: ?id=XYZ)
  const driveFileId = searchParams.id;

  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header / Branding */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
            Dhi Memories
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Client Preview Gallery
          </p>
        </div>
        
        {/* Kontainer Gambar */}
        <div className="bg-black p-2 rounded-xl shadow-2xl relative overflow-hidden ring-1 ring-neutral-800 border-4 border-neutral-800 flex justify-center min-h-[300px] items-center">
          {driveFileId ? (
            <SecureImage imageUrl={`/api/image?id=${driveFileId}`} />
          ) : (
            <p className="text-neutral-500 text-sm text-center p-8">
              Tidak ada foto yang dimuat.<br/>Pastikan link yang Anda buka sudah menyertakan ID foto.
            </p>
          )}
        </div>
        
        {/* Peringatan Klien */}
        <div className="bg-neutral-800/50 p-4 rounded-lg text-center border border-neutral-700">
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Tangkapan layar (screenshot) sistem dimatikan untuk melindungi hak cipta. <br />
            Silakan pilih foto yang Anda inginkan dan hubungi admin untuk mendapatkan versi resolusi tinggi tanpa watermark.
          </p>
        </div>

      </div>
    </main>
  );
}
'use client';

import { useEffect, useRef, useState } from 'react';

export default function SecureImage({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Load gambar ke dalam objek Image
    const img = new Image();
    // Penting: Izinkan CORS jika mengambil dari Google Drive/API Eksternal
    img.crossOrigin = 'anonymous'; 
    img.src = imageUrl;

    img.onload = () => {
      // Sesuaikan ukuran kanvas dengan gambar
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    // --- PROTEKSI ANTI-SCREENSHOT (Simulasi) ---
    
    // 1. Deteksi saat jendela kehilangan fokus (Alt+Tab atau Snipping Tool aktif)
    const handleBlur = () => setIsSecure(false);
    const handleFocus = () => setIsSecure(true);

    // 2. Deteksi tombol keyboard (Print Screen, Command+Shift+4)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' || 
        (e.metaKey && e.shiftKey) // Deteksi Mac screenshot
      ) {
        setIsSecure(false);
        // Kembalikan gambar setelah 2 detik
        setTimeout(() => setIsSecure(true), 2000); 
      }
    };

    // 3. Matikan Klik Kanan
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [imageUrl]);

  return (
    <div className="relative inline-block select-none">
      {/* Jika terdeteksi tidak aman (blur/screenshot), tutupi dengan div hitam */}
      {!isSecure && (
        <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
          <span className="text-white font-bold">Screenshot Terdeteksi</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto pointer-events-none"
      />
      
      {/* Watermark Transparan Dinamis di atas kanvas */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <span className="text-4xl font-bold text-white uppercase transform -rotate-45">
          PREVIEW ONLY
        </span>
      </div>
    </div>
  );
}
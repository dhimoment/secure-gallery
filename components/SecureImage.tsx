'use client';

import { useEffect, useRef, useState } from 'react';

export default function SecureImage({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSecure, setIsSecure] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false); // Status loading

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setIsLoaded(true); // Gambar selesai dimuat, hilangkan tulisan loading
    };

    img.onerror = () => {
      console.error("Gambar gagal dimuat dari server!");
    };

    // Deteksi keamanan
    const handleBlur = () => setIsSecure(false);
    const handleFocus = () => setIsSecure(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey)) {
        setIsSecure(false);
        setTimeout(() => setIsSecure(true), 2000); 
      }
    };
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
    <div className="relative inline-block select-none w-full h-full">
      
      {/* Tampilan Loading (Sebelum gambar muncul) */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-neutral-500 text-sm animate-pulse">Memuat foto...</span>
        </div>
      )}

      {/* Tampilan Terdeteksi Screenshot */}
      {!isSecure && (
        <div className="absolute inset-0 bg-black z-20 flex items-center justify-center">
          <span className="text-white font-bold text-sm">Screenshot Terdeteksi</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className={`max-w-full h-auto pointer-events-none transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Watermark Transparan */}
      {isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none z-10">
          <span className="text-4xl sm:text-6xl font-bold text-white uppercase transform -rotate-45">
            PREVIEW ONLY
          </span>
        </div>
      )}
    </div>
  );
}
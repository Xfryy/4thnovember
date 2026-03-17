// lib/assetPreloader.ts

/**
 * Asset Preloader
 * Preload semua aset dari folder public sebelum game dimulai
 */

export interface PreloadProgress {
  loaded: number;
  total: number;
  current: string;
  percentage: number;
}

// Daftar ekstensi file yang akan dipreload
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];

// Cache untuk menyimpan status preload
let preloadCache: Record<string, boolean> = {};
let totalAssets = 0;
let loadedAssets = 0;

/**
 * Mendapatkan semua aset dari folder public
 * Catatan: Karena kita tidak bisa membaca filesystem di client,
 * kita perlu mendefinisikan daftar aset secara manual atau
 * menggunakan API endpoint
 */
export async function getAllPublicAssets(): Promise<string[]> {
  // =========== METHOD 1: Manual list (recommended) ===========
  // Daftar semua aset di folder public secara manual
  // Ini paling reliable untuk production
  return [
    // Backgrounds
    '/Image/GameBG/Bg-1.jpg',
    '/Image/GameBG/Exit.png',
    '/Image/GameBG/Hallway.png',
    '/Image/GameBG/road.jpg',

    // Character sprites - Rin
    '/Image/Rinn/defal-smile-Photoroom.png',
    '/Image/Rinn/eye-close-smile.png',
    '/Image/Rinn/confident-Photoroom.png',
    '/Image/Rinn/cemberut.png',
    '/Image/Rinn/cemberut-nengok.png',
    '/Image/Rinn/kecewa.png',
    '/Image/Rinn/memohon.png',
    '/Image/Rinn/kaget-santay.png',
    '/Image/Rinn/mikir.png',
    '/Image/Rinn/sombong.png',
    '/Image/Rinn/pointing.png',
    '/Image/Rinn/hai.png',
    '/Image/Rinn/menguap.png',

    // NPCs
    '/Image/NPC/doctor/doctor.png',
    '/Image/NPC/doctor/Reception.png',

    // Scene images - Act 1
    '/Image/scenes/Act_1/scene_1.jpeg',
    '/Image/scenes/Act_1/scene_1-2.jpeg',
    '/Image/scenes/Act_1/scene-doctor.jpeg',

    // Scene images - Act 2
    '/Image/scenes/Act_2/scene_1.png',
    '/Image/scenes/Act_2/scene_2.png',
    '/Image/scenes/Act_2/scene_3.png',
    '/Image/scenes/Act_2/scene_4.png',

    // Audio files (optional - audio bisa di-preload atau tidak)
    // '/audio/sfx/knocking-door.mp3',
  ];
  
  // =========== METHOD 2: API Endpoint (lebih dinamis) ===========
  // Buat API route di /api/assets.ts yang membaca folder public
  /*
  try {
    const response = await fetch('/api/assets');
    if (response.ok) {
      const data = await response.json();
      return data.assets;
    }
  } catch (error) {
    console.error('Failed to fetch asset list:', error);
  }
  return [];
  */
}

/**
 * Preload gambar
 */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Cek cache
    if (preloadCache[src]) {
      resolve();
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      preloadCache[src] = true;
      loadedAssets++;
      resolve();
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      loadedAssets++; // Tetap increment agar progress jalan
      reject(new Error(`Failed to load: ${src}`));
    };
    img.src = src;
  });
}

/**
 * Preload audio (opsional, karena audio bisa di-stream)
 */
function preloadAudio(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (preloadCache[src]) {
      resolve();
      return;
    }
    
    const audio = new Audio();
    audio.preload = 'auto';
    audio.onloadeddata = () => {
      preloadCache[src] = true;
      loadedAssets++;
      resolve();
    };
    audio.onerror = () => {
      // Abaikan error audio, tetap lanjut
      loadedAssets++;
      resolve();
    };
    audio.src = src;
  });
}

/**
 * Preload semua aset dengan progress callback
 */
export async function preloadAllAssets(
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> {
  // Reset counter
  loadedAssets = 0;
  preloadCache = {};
  
  // Dapatkan daftar aset
  const assets = await getAllPublicAssets();
  totalAssets = assets.length;
  
  if (totalAssets === 0) {
    console.warn('No assets to preload');
    onProgress?.({
      loaded: 100,
      total: 100,
      current: 'Complete',
      percentage: 100,
    });
    return;
  }
  
  // Progress update
  const updateProgress = (currentFile: string) => {
    const percentage = Math.floor((loadedAssets / totalAssets) * 100);
    onProgress?.({
      loaded: loadedAssets,
      total: totalAssets,
      current: currentFile,
      percentage,
    });
  };
  
  // Preload semua aset dengan concurrency control
  const concurrency = 5; // Load 5 aset sekaligus
  const chunks = [];
  
  for (let i = 0; i < assets.length; i += concurrency) {
    chunks.push(assets.slice(i, i + concurrency));
  }
  
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (asset) => {
        const extension = asset.substring(asset.lastIndexOf('.')).toLowerCase();
        
        try {
          if (IMAGE_EXTENSIONS.includes(extension)) {
            await preloadImage(asset);
          } else if (AUDIO_EXTENSIONS.includes(extension)) {
            await preloadAudio(asset);
          }
          
          updateProgress(asset);
        } catch (error) {
          // Abaikan error, lanjut ke aset berikutnya
          updateProgress(asset);
        }
      })
    );
  }
  
  // Final progress
  onProgress?.({
    loaded: totalAssets,
    total: totalAssets,
    current: 'Complete',
    percentage: 100,
  });
}

/**
 * Preload spesifik untuk scene (fallback jika preload all gagal)
 */
// export async function preloadSceneAssets(
//   sceneId: string,
//   depth: number = 5,
//   onProgress?: (progress: PreloadProgress) => void
// ): Promise<void> {
  // Implementasi preload scene spesifik
  // Ini bisa dipanggil dari preloadAllAssets sebagai tambahan
// }
import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Sparkles, Star, Palette, Share2, AlertCircle } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showRickroll, setShowRickroll] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const processingStages = [
    "analyzing your vibe rn... 🧐",
    "adding that anime rizz... 💅",
    "making you look fire... 🔥",
    "adding those kawaii effects... 🎀",
    "finishing up to make you slay... ✨"
  ];

  // Preload video
  useEffect(() => {
    const video = document.createElement('video');
    video.preload = "auto";
    
    const sources = [
      "https://raw.githubusercontent.com/vaibhavmule/anime/main/video.mp4", // Primary GitHub source
      "https://github.com/vaibhavmule/anime/raw/main/video.mp4" // Fallback GitHub source
    ];

    video.addEventListener('canplaythrough', () => {
      setIsVideoReady(true);
    });

    video.addEventListener('error', () => {
      console.error('Video loading failed');
      setIsVideoReady(true); // Still show the video even if preloading fails
    });

    // Try loading the first source
    video.src = sources[0];

    return () => {
      video.removeEventListener('canplaythrough', () => {});
      video.removeEventListener('error', () => {});
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            setShowRickroll(true);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      const stageInterval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= processingStages.length - 1) {
            clearInterval(stageInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "file too big! keep it under 10MB 💅";
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "we only accept PNG, JPG, GIF, or WEBP! 💅";
    }
    return null;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsLoading(true);
      setProgress(0);
      setCurrentStage(0);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Gibhili Style Photo Image for Free 🎨',
      text: 'Turn your photo into a cute anime picture! Just upload your photo and watch the magic happen ✨',
      url: 'https://anime-vibe.vercel.app/'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText('https://anime-vibe.vercel.app/');
        alert('Link copied! Share this fun app! ✨');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (showRickroll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex flex-col items-center justify-center p-4 text-center relative">
        <div className="animate-bounce">
          <h1 className="text-4xl font-black mb-4 text-white drop-shadow-lg bg-black/20 px-8 py-4 rounded-2xl backdrop-blur-sm">
            OMG! You got rickrolled! 🤪
          </h1>
        </div>
        {isVideoReady ? (
          <video 
            autoPlay 
            loop
            controls
            className="w-full max-w-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/30"
            src="https://raw.githubusercontent.com/vaibhavmule/anime/main/video.mp4"
            aria-label="Anime transformation video"
          />
        ) : (
          <div className="w-full max-w-lg h-[300px] bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}
        <div className="mt-6 text-xl font-bold text-white bg-black/30 px-8 py-4 rounded-2xl backdrop-blur-sm flex items-center gap-3 animate-pulse">
          <span>Happy April Fools Day!</span>
          <span className="text-2xl animate-bounce">🎉</span>
        </div>

        <button
          onClick={handleShare}
          className="mt-6 group flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
          aria-label="Share this prank"
        >
          <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          <span>Share this prank!</span>
          <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🤳</span>
        </button>

        <div className="mt-6 text-center max-w-md">
          <p className="text-sm text-white/90 bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <span role="img" aria-label="lock" className="mr-2 text-lg">🔒</span>
            Disclaimer: We don't store or use your images. Everything happens in your browser!
          </p>
        </div>
        
        {/* Built by Link */}
        <a 
          href="https://instagram.com/vaibhavmule" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          made with 🫰 by @vaibhavmule
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ Anime-ify Your Selfie! ✨
          </h1>
          <p className="text-purple-600 mt-2 font-medium">
            this AI be bussin no cap 🔥
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-white/50 hover:bg-white/80 transition-all duration-300">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="text-purple-600 font-bold text-center">
                    {processingStages[currentStage]}
                  </p>
                  <p className="text-sm text-purple-400 text-center">
                    {progress}% complete
                  </p>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center space-y-4">
                <div className="relative">
                  <Upload className="w-16 h-16 text-purple-500" />
                  <Star className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <p className="text-purple-800 font-bold text-lg">drop your selfie here! 📸</p>
                  <p className="text-sm text-purple-500">click or drag n drop</p>
                  <p className="text-xs text-purple-400">PNG or JPG under 10MB ✌️</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  aria-label="Upload your selfie"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                <img 
                  src="https://raw.githubusercontent.com/vaibhavmule/anime/33351955e29682c4aa72bd5c802ea901e2dcb050/IMG_9A9532D025FC-1.jpeg" 
                  alt="Example of a regular selfie before anime transformation"
                  className="absolute inset-0 w-full h-full object-cover object-[center_70%]"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">before 📸</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-red-100 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                <img 
                  src="https://github.com/vaibhavmule/anime/blob/main/ChatGPT%20Image%20Apr%201,%202025,%2012_37_23%20AM.png?raw=true" 
                  alt="Example of an anime-style transformed selfie"
                  className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Palette className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-pink-700">after ✨</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-purple-50 rounded-2xl p-6">
          <h2 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            why this slaps: 💅
          </h2>
          <ul className="text-sm text-purple-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-lg">🎨</span> amazing anime conversion fr fr
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✨</span> multiple aesthetic styles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">⚡</span> takes 2 secs bestie
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">💅</span> free to use periodt!
            </li>
          </ul>
        </div>
      </div>
      
      {/* Built by Link */}
      <a 
        href="https://instagram.com/vaibhavmule" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-6 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 shadow-lg"
      >
        made with 🫰 by @vaibhavmule
      </a>
    </div>
  );
}

export default App;
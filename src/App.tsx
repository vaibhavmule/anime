import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Sparkles, Star, Palette, Share2, AlertCircle } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showRickroll, setShowRickroll] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isBeforeImageLoaded, setIsBeforeImageLoaded] = useState(false);
  const [isAfterImageLoaded, setIsAfterImageLoaded] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const processingStages = [
    "analyzing your vibe rn... 🧐",
    "adding that anime rizz... 💅",
    "making you look fire... 🔥",
    "adding those kawaii effects... 🎀",
    "finishing up to make you slay... ✨"
  ];

  const sources = [
    "https://res.cloudinary.com/lifemaker/video/upload/v1743460689/video_u3ddgz.mp4", // Primary Cloudinary source
    "https://ia801509.us.archive.org/10/items/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4", // Archive.org backup
    "/video.mp4" // Local backup
  ];

  const tryNextSource = () => {
    if (currentSourceIndex < sources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
    } else {
      console.error('All video sources failed to load');
      setIsVideoReady(true); // Still show the video even if all sources fail
    }
  };

  // Preload video
  useEffect(() => {
    const video = document.createElement('video');
    video.preload = "auto";
    
    const handleError = (e: Event) => {
      console.error('Video loading failed:', e);
      tryNextSource();
    };

    video.addEventListener('canplaythrough', () => {
      setIsVideoReady(true);
    });

    video.addEventListener('error', handleError);

    // Try loading the current source
    video.src = sources[currentSourceIndex];

    return () => {
      video.removeEventListener('canplaythrough', () => {});
      video.removeEventListener('error', handleError);
    };
  }, [currentSourceIndex]);

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRickroll) {
        setShowRickroll(false);
        setIsLoading(false);
        setProgress(0);
        setCurrentStage(0);
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showRickroll]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "file too big! keep it under 10MB 💅";
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "we only accept PNG, JPG, GIF, or WEBP! 💅";
    }
    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
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
            crossOrigin="anonymous"
            className="w-full max-w-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/30"
            src={sources[currentSourceIndex]}
            onError={(e) => {
              console.error('Video playback error:', e);
              tryNextSource();
            }}
            aria-label="Anime transformation video"
          />
        ) : (
          <div className="w-full max-w-lg h-[300px] bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white/80 text-sm">Loading the surprise...</p>
            <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="w-full h-full bg-white/40 animate-pulse" />
            </div>
          </div>
        )}
        <div className="mt-8 text-xl font-bold text-white bg-black/30 px-8 py-4 rounded-2xl backdrop-blur-sm flex items-center gap-3 animate-pulse">
          <span>Happy April Fools Day!</span>
          <span className="text-2xl animate-bounce">🎉</span>
        </div>

        <p className="hidden md:block mt-4 text-sm text-white/80">
          Press <kbd className="px-2 py-1 bg-white/20 rounded-md">ESC</kbd> to try again
        </p>

        <button
          onClick={handleShare}
          className="mt-6 group flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
          aria-label="Share this prank"
        >
          <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          <span>Share this prank!</span>
          <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🤳</span>
        </button>

        {/* Built by Link */}
        <a 
          href="https://instagram.com/vaibhavmule" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 shadow-lg z-50"
        >
          made with 🫰 by @vaibhavmule
        </a>

        <div className="mt-10 text-center max-w-md">
          <p className="text-xs text-white/90 bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <span role="img" aria-label="lock" className="mr-2 text-xs">🔒</span>
            Disclaimer: We don't store or use your images. Everything happens in your browser!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex flex-col items-center justify-center p-4 relative">
      <Analytics />
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
              <label 
                className={`cursor-pointer flex flex-col items-center space-y-4 transition-all duration-300 ${
                  isDragging ? 'bg-purple-50 scale-105' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
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
                {!isBeforeImageLoaded && (
                  <div className="absolute inset-0 bg-purple-100 animate-pulse" />
                )}
                <img 
                  src="https://res.cloudinary.com/lifemaker/image/upload/v1743460662/IMG_9A9532D025FC-1_qvi0kl.jpg" 
                  alt="Example of a regular selfie before anime transformation"
                  className={`absolute inset-0 w-full h-full object-cover object-[center_70%] transition-opacity duration-300 ${
                    isBeforeImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setIsBeforeImageLoaded(true)}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">before 📸</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-red-100 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                {!isAfterImageLoaded && (
                  <div className="absolute inset-0 bg-pink-100 animate-pulse" />
                )}
                <img 
                  src="https://res.cloudinary.com/lifemaker/image/upload/v1743460664/ChatGPT_Image_Apr_1_2025_12_37_23_AM_fmvyh1.png" 
                  alt="Example of an anime-style transformed selfie"
                  className={`absolute inset-0 w-full h-full object-cover object-[center_60%] transition-opacity duration-300 ${
                    isAfterImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setIsAfterImageLoaded(true)}
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
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 shadow-lg z-50"
      >
        made with 🫰 by @vaibhavmule
      </a>
    </div>
  );
}

export default App;
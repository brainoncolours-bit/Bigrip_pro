import React, { useState } from 'react';

const artistsData = [
  {
    title: 'Direction & Motion',
    artists: [
      { 
        name: 'Suhail', 
        images: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
        ] 
      },
      {
        name: 'Michael Bailey-Gates',
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    title: 'Styling',
    artists: [
      { 
        name: 'Miyako Bellizzi', 
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80', 
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80'
        ] 
      },
    ],
  },
  {
    title: 'Casting',
    artists: [
      { 
        name: 'Je Suis Casting', 
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80', 
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop&q=80'
        ] 
      },
    ],
  },
  {
    title: 'Set Design',
    artists: [
      { 
        name: 'Noemi Bonazzi', 
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'] 
      },
      { 
        name: 'Rachel Thomas', 
        images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'] 
      },
    ],
  },
];

const Artists = () => {
  const [activeArtist, setActiveArtist] = useState(null);

  // Split images into left and right groups if there are many, keeping layout balanced
  const getDistributedImages = (images) => {
    if (!images) return { leftImages: [], rightImages: [] };
    const mid = Math.ceil(images.length / 2);
    // If there's a lot of images, split them; otherwise keep them on the natural side
    return {
      leftImages: images.slice(0, mid),
      rightImages: images.slice(mid)
    };
  };

  return (
    <main className="min-h-screen bg-white text-black font-serif px-12 py-8 relative selection:bg-neutral-200 overflow-x-hidden">
      
      {/* Top Navigation Links */}
      <nav className="flex justify-between items-center text-sm font-sans mb-16">
        <div className="flex gap-8">
          <a href="#" className="text-black hover:opacity-60 transition-opacity">News</a>
          <a href="#" className="text-black hover:opacity-60 transition-opacity">Artists</a>
          <a href="#" className="text-black hover:opacity-60 transition-opacity">Info</a>
        </div>
        <span className="text-red-600 font-medium">ARTISTS</span>
      </nav>

      {/* Main Container */}
      <div className="grid grid-cols-12 gap-6 items-start relative">
        
        {/* Logo / Title Column */}
        <div className="col-span-2">
          <h1 className="text-2xl font-bold font-sans tracking-tight leading-none text-black">
            mini title
          </h1>
        </div>

        {/* Categories & Artists Grid */}
        <div 
          className="col-span-10 grid grid-cols-4 gap-8 font-sans relative"
          onMouseLeave={() => setActiveArtist(null)}
        >
          {artistsData.map((category) => (
            <div key={category.title} className="flex flex-col gap-4">
              <h2 className="text-[12px] font-normal text-neutral-800 tracking-wide">
                {category.title}
              </h2>
              <ul className="flex flex-col gap-1.5 text-[13px]">
                {category.artists.map((artist) => {
                  const isActive = activeArtist?.name === artist.name;
                  const { leftImages, rightImages } = getDistributedImages(artist.images);

                  return (
                    <li key={artist.name} className="relative">
                      <button
                        onMouseEnter={() => setActiveArtist(artist)}
                        className={`text-left transition-colors duration-150 block w-full leading-snug ${
                          isActive
                            ? 'text-red-600 font-medium'
                            : 'text-black hover:text-red-600'
                        }`}
                      >
                        {artist.name}
                      </button>

                      {/* Left Side Overflow Images */}
                      {isActive && leftImages.length > 0 && (
                        <div className="absolute top-0 right-full mr-6 z-30 flex items-start gap-3 pointer-events-none transition-all duration-300 ease-out opacity-100">
                          {leftImages.map((imgSrc, idx) => (
                            <div
                              key={`left-${artist.name}-${idx}`}
                              className="flex-shrink-0 bg-neutral-100 shadow-sm"
                              style={{ width: '150px', height: '200px' }}
                            >
                              <img
                                src={imgSrc}
                                alt={`${artist.name} work preview`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Right Side Images */}
                      {isActive && rightImages.length > 0 && (
                        <div className="absolute top-0 left-full ml-6 z-30 flex items-start gap-3 pointer-events-none transition-all duration-300 ease-out opacity-100">
                          {rightImages.map((imgSrc, idx) => (
                            <div
                              key={`right-${artist.name}-${idx}`}
                              className="flex-shrink-0 bg-neutral-100 shadow-sm"
                              style={{ width: '150px', height: '200px' }}
                            >
                              <img
                                src={imgSrc}
                                alt={`${artist.name} work preview`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
};

export default Artists;
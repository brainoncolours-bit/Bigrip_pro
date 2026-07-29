import React, { useState } from 'react';

const artistsData = [
  {
    title: 'Photography & Motion',
    artists: [
      { name: 'Andrea Artemisio', images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Michael Bailey-Gates', images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Clara Balzary', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Jack Davison', images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Bobby Doherty', images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Lisa Jahovic', images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Tom Johnson', images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Paul Kooiker', images: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Arnaud Lajeunie', images: ['https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Jackie Nickerson', images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Tanya & Zhenya Posternak', images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Daniel Shea', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Alec Soth', images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Jet Swan', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Charlotte Wales', images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Sam Youkilis', images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80'] },
      { name: 'John Yuyi', images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'] },
    ],
  },
  {
    title: 'Styling',
    artists: [
      { name: 'Miyako Bellizzi', images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80'] },
    ],
  },
  {
    title: 'Casting',
    artists: [
      { name: 'Je Suis Casting', images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop&q=80'] },
    ],
  },
  {
    title: 'Set Design',
    artists: [
      { name: 'Noemi Bonazzi', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'] },
      { name: 'Rachel Thomas', images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'] },
    ],
  },
];

const Artists = () => {
  const [activeArtist, setActiveArtist] = useState(null);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-200 selection:text-neutral-950">
      {/* Clean, Minimalist Header */}
      

      {/* Main Layout Container */}
      <div className="max-w-[1700px] mx-auto px-10 pt-36 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Side: Editorial Typography Directory */}
        <div 
          className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12"
          onMouseLeave={() => setActiveArtist(null)}
        >
          {artistsData.map((category) => (
            <div key={category.title} className="flex flex-col gap-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-medium">
                {category.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {category.artists.map((artist) => {
                  const isActive = activeArtist?.name === artist.name;
                  return (
                    <li key={artist.name}>
                      <button
                        onMouseEnter={() => setActiveArtist(artist)}
                        className={`text-left text-sm tracking-tight transition-all duration-300 block w-full py-0.5 font-light ${
                          isActive
                            ? 'text-white translate-x-1 font-normal'
                            : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {artist.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Right Side: Floating High-Fashion Preview Stage */}
        <div className="lg:col-span-4 sticky top-36 h-[calc(100vh-12rem)] hidden lg:flex items-center justify-end pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-end overflow-hidden">
            {activeArtist ? (
              <div className="absolute inset-0 flex items-center justify-end gap-5 animate-fade-in transition-all duration-700 ease-out">
                {activeArtist.images.map((imgSrc, idx) => (
                  <div
                    key={`${activeArtist.name}-${idx}`}
                    className="relative overflow-hidden rounded-none shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-neutral-900 border border-neutral-800/50 transition-all duration-500 ease-out"
                    style={{
                      height: idx === 0 ? '480px' : '380px',
                      width: idx === 0 ? '340px' : '260px',
                      marginTop: idx === 1 ? '60px' : '0px',
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`${activeArtist.name} work`}
                      className="w-full h-full object-cover filter grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-700 text-xs uppercase tracking-[0.2em] font-light">
                Select an artist
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Artists;
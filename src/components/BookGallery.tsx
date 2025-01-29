import React, { useState } from 'react';
import Image from 'next/image';

const BookGallery = ({ images }:any ) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipPage = (direction:any) => {
    setIsFlipping(true);
    setTimeout(() => {
      if (direction === 'next' && currentPage < images.length - 2) {
        setCurrentPage(prev => prev + 2);
      } else if (direction === 'prev' && currentPage > 0) {
        setCurrentPage(prev => prev - 2);
      }
      setIsFlipping(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 relative">
      <div className="flex justify-center items-center">
        <button
          onClick={() => flipPage('prev')}
          disabled={currentPage === 0}
          className="absolute left-4 z-10 bg-white/80 p-2 rounded-full shadow-lg disabled:opacity-50"
        >
          ←
        </button>
        
        <div className="relative w-full aspect-[2/1] bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className={`flex transition-transform duration-300 ease-in-out ${isFlipping ? 'scale-95' : ''}`}>
            {/* Left Page */}
            <div className="w-1/2 p-4 border-r border-gray-200">
              {images[currentPage] && (
                <div className="relative aspect-square">
                  <Image
                    src={images[currentPage]}
                    alt={`Memory ${currentPage + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
            
            {/* Right Page */}
            <div className="w-1/2 p-4">
              {images[currentPage + 1] && (
                <div className="relative aspect-square">
                  <Image
                    src={images[currentPage + 1]}
                    alt={`Memory ${currentPage + 2}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Page curl effect */}
          <div className={`absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/10 to-transparent transform origin-right transition-all duration-300 ${isFlipping ? 'scale-y-95' : ''}`} />
        </div>
        
        <button
          onClick={() => flipPage('next')}
          disabled={currentPage >= images.length - 2}
          className="absolute right-4 z-10 bg-white/80 p-2 rounded-full shadow-lg disabled:opacity-50"
        >
          →
        </button>
      </div>
      
      <div className="text-center mt-4 text-sm text-gray-500">
        Page {Math.floor(currentPage / 2) + 1} of {Math.ceil(images.length / 2)}
      </div>
    </div>
  );
};

export default BookGallery;
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import type { PostImage } from '../types';

interface PostImageCarouselProps {
  images: PostImage[];
}

export default function PostImageCarousel({ images }: PostImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="post-detail-image">
        <img
          src={images[0].url}
          alt="Imagen del post"
          className="img-fluid post-detail-img"
        />
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeIndex];

  const goPrev = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goNext = () => {
    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <div className="post-detail-gallery">
      <div className="post-detail-gallery-main">
        <button
          type="button"
          className="post-detail-gallery-nav post-detail-gallery-nav-prev"
          onClick={goPrev}
          aria-label="Imagen anterior"
        >
          <ChevronLeftIcon className="post-detail-gallery-nav-icon" />
        </button>

        <div className="post-detail-image">
          <img
            key={activeImage.id}
            src={activeImage.url}
            alt={`Imagen ${safeIndex + 1} del post`}
            className="img-fluid post-detail-img"
          />
        </div>

        <button
          type="button"
          className="post-detail-gallery-nav post-detail-gallery-nav-next"
          onClick={goNext}
          aria-label="Imagen siguiente"
        >
          <ChevronRightIcon className="post-detail-gallery-nav-icon" />
        </button>
      </div>

      <div className="post-detail-gallery-thumbs" role="tablist" aria-label="Imágenes del post">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            role="tab"
            aria-selected={index === safeIndex}
            aria-label={`Ver imagen ${index + 1}`}
            className={`post-detail-gallery-thumb ${index === safeIndex ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <img src={image.url} alt="" />
          </button>
        ))}
      </div>

      <p className="text-muted small text-center mb-0 mt-2">
        {safeIndex + 1} / {images.length}
      </p>
    </div>
  );
}

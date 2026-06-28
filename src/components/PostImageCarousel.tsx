import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import type { PostImage } from '../types';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { sortPostImages } from '../utils/postImages';

interface PostImageCarouselProps {
  images: PostImage[];
  variant?: 'detail' | 'card';
}

export default function PostImageCarousel({
  images: rawImages,
  variant = 'detail',
}: PostImageCarouselProps) {
  const images = sortPostImages(rawImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const isCard = variant === 'card';
  const galleryClassName = isCard ? 'post-card-gallery' : undefined;
  const imageClassName = `img-fluid ${isCard ? 'post-card-gallery-img' : 'post-detail-img'}`;

  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className={`post-detail-image ${galleryClassName ?? ''}`.trim()}>
        <img
          src={resolveMediaUrl(images[0].url)}
          alt="Imagen del post"
          className={imageClassName}
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
    <div className={`post-detail-gallery ${galleryClassName ?? ''}`.trim()}>
      <div
        className={`post-detail-gallery-main ${isCard ? 'post-card-gallery-stage' : ''}`.trim()}
      >
        <button
          type="button"
          className="post-detail-gallery-nav post-detail-gallery-nav-prev"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          aria-label="Imagen anterior"
        >
          <ChevronLeftIcon className="post-detail-gallery-nav-icon" />
        </button>

        <div
          className={
            isCard ? 'post-card-gallery-viewport' : 'post-detail-image'
          }
        >
          {isCard ? (
            <div className="post-detail-image post-card-gallery-image-frame">
              <img
                key={activeImage.id}
                src={resolveMediaUrl(activeImage.url)}
                alt={`Imagen ${safeIndex + 1} del post`}
                className={imageClassName}
              />
            </div>
          ) : (
            <img
              key={activeImage.id}
              src={resolveMediaUrl(activeImage.url)}
              alt={`Imagen ${safeIndex + 1} del post`}
              className={imageClassName}
            />
          )}
        </div>

        <button
          type="button"
          className="post-detail-gallery-nav post-detail-gallery-nav-next"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
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
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(index);
            }}
          >
            <img src={resolveMediaUrl(image.url)} alt="" />
          </button>
        ))}
      </div>

      <p className="text-muted small text-center mb-0 mt-2">
        {safeIndex + 1} / {images.length}
      </p>
    </div>
  );
}

import { useEffect, useMemo, type ChangeEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import type { PostImage } from '../types';
import { resolveMediaUrl } from '../utils/mediaUrl';

interface PostImageEditorProps {
  existingImages: PostImage[];
  newFiles: File[];
  onRemoveExisting: (imageId: number) => void;
  onRemoveNew: (index: number) => void;
  onAddFiles: (files: File[]) => void;
  imageError?: string;
  inputId: string;
}

export default function PostImageEditor({
  existingImages,
  newFiles,
  onRemoveExisting,
  onRemoveNew,
  onAddFiles,
  imageError,
  inputId,
}: PostImageEditorProps) {
  const newPreviews = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles],
  );

  useEffect(() => {
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newPreviews]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      onAddFiles(files);
    }
    event.target.value = '';
  }

  const hasImages = existingImages.length > 0 || newFiles.length > 0;

  return (
    <Form.Group className="mb-3" controlId={inputId}>
      <Form.Label>Imágenes</Form.Label>

      {!hasImages && (
        <p className="text-muted small mb-2">Este post no tiene imágenes todavía.</p>
      )}

      {hasImages && (
        <div className="post-image-editor-grid mb-3">
          {existingImages.map((image) => (
            <div key={image.id} className="post-image-editor-item">
              <img src={resolveMediaUrl(image.url)} alt="" className="post-image-editor-thumb" />
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                className="post-image-editor-remove"
                onClick={() => onRemoveExisting(image.id)}
              >
                Quitar
              </Button>
            </div>
          ))}

          {newPreviews.map((preview, index) => (
            <div key={`${preview.file.name}-${index}`} className="post-image-editor-item is-new">
              <img src={preview.url} alt="" className="post-image-editor-thumb" />
              <span className="post-image-editor-badge">Nueva</span>
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                className="post-image-editor-remove"
                onClick={() => onRemoveNew(index)}
              >
                Quitar
              </Button>
            </div>
          ))}
        </div>
      )}

      <Form.Label className="small text-muted d-block">Agregar imágenes</Form.Label>
      <Form.Control
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        isInvalid={!!imageError}
      />
      <Form.Control.Feedback type="invalid">{imageError}</Form.Control.Feedback>
      <Form.Text>JPG, PNG o WEBP. Las nuevas se suben al guardar; las que quites se eliminan al guardar.</Form.Text>
    </Form.Group>
  );
}

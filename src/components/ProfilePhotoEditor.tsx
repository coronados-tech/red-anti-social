import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import {
  PROFILE_PHOTO_VIEWPORT,
  clampOffset,
  cropProfilePhoto,
  getCoverLayout,
  loadImageElement,
} from '../utils/cropProfilePhoto';

interface ProfilePhotoEditorProps {
  show: boolean;
  imageSource: string | File | null;
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
}

export default function ProfilePhotoEditor({
  show,
  imageSource,
  onClose,
  onSave,
}: ProfilePhotoEditorProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    let cancelled = false;
    let previewUrlToRevoke: string | null = null;

    if (!show || !imageSource) {
      setImage(null);
      setPreviewUrl(null);
      setLoadError('');
      setSaveError('');
      setOffsetX(0);
      setOffsetY(0);
      setZoom(1);
      return;
    }

    setLoadingImage(true);
    setLoadError('');

    loadImageElement(imageSource)
      .then(({ image: loadedImage, previewUrl: loadedPreviewUrl }) => {
        if (cancelled) {
          URL.revokeObjectURL(loadedPreviewUrl);
          return;
        }

        previewUrlToRevoke = loadedPreviewUrl;
        setImage(loadedImage);
        setPreviewUrl(loadedPreviewUrl);
        setOffsetX(0);
        setOffsetY(0);
        setZoom(1);
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingImage(false);
      });

    return () => {
      cancelled = true;
      if (previewUrlToRevoke) {
        URL.revokeObjectURL(previewUrlToRevoke);
      }
    };
  }, [show, imageSource]);

  const layout = image
    ? getCoverLayout(image.naturalWidth, image.naturalHeight, PROFILE_PHOTO_VIEWPORT)
    : null;

  useEffect(() => {
    if (!layout) return;

    const clamped = clampOffset(offsetX, offsetY, layout, zoom, PROFILE_PHOTO_VIEWPORT);
    if (clamped.x !== offsetX || clamped.y !== offsetY) {
      setOffsetX(clamped.x);
      setOffsetY(clamped.y);
    }
  }, [layout, offsetX, offsetY, zoom]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX,
      offsetY,
    };
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || !layout) return;

    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    const next = clampOffset(
      dragStart.current.offsetX + deltaX,
      dragStart.current.offsetY + deltaY,
      layout,
      zoom,
      PROFILE_PHOTO_VIEWPORT,
    );

    setOffsetX(next.x);
    setOffsetY(next.y);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  function handleZoomChange(value: number) {
    if (!layout) return;

    const clamped = clampOffset(offsetX, offsetY, layout, value, PROFILE_PHOTO_VIEWPORT);
    setZoom(value);
    setOffsetX(clamped.x);
    setOffsetY(clamped.y);
  }

  async function handleSave() {
    if (!image) return;

    setSaving(true);
    setSaveError('');

    try {
      const file = await cropProfilePhoto(image, offsetX, offsetY, zoom);
      await onSave(file);
      onClose();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'No se pudo guardar la foto');
    } finally {
      setSaving(false);
    }
  }

  const scaledWidth = layout ? layout.displayWidth * zoom : 0;
  const scaledHeight = layout ? layout.displayHeight * zoom : 0;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajustar foto de perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small mb-3">
          Arrastrá la imagen para moverla y usá el zoom para acercar o alejar.
        </p>

        {loadError && <Alert variant="danger">{loadError}</Alert>}
        {saveError && <Alert variant="danger">{saveError}</Alert>}

        {loadingImage && (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" /> Cargando imagen...
          </div>
        )}

        {!loadingImage && image && layout && (
          <>
            <div
              className={`profile-photo-editor-viewport${dragging ? ' is-dragging' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <img
                src={previewUrl ?? undefined}
                alt="Vista previa"
                className="profile-photo-editor-image"
                style={{
                  width: scaledWidth,
                  height: scaledHeight,
                  transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                }}
                draggable={false}
              />
            </div>

            <Form.Group className="mt-4" controlId="profile-photo-zoom">
              <Form.Label className="small">Zoom</Form.Label>
              <Form.Range
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!image || saving || loadingImage}>
          {saving ? 'Guardando...' : 'Guardar foto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

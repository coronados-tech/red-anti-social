import { useRef, useState, type KeyboardEvent } from 'react';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { CloseIcon } from './Icons';
import type { Tag } from '../types';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import { validarNuevoTag } from '../utils/validacionPost';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onToggle: (tagName: string) => void;
  onChangeSelected: (tags: string[]) => void;
}

function normalizeTagName(name: string) {
  return name.trim().toLowerCase();
}

export default function TagSelector({
  availableTags,
  selectedTags,
  onToggle,
  onChangeSelected,
}: TagSelectorProps) {
  const [newTag, setNewTag] = useState('');
  const [tagError, setTagError] = useState('');
  const groupRef = useRef<HTMLDivElement>(null);

  const customTags = selectedTags.filter(
    (name) => !availableTags.some((tag) => tag.name === name),
  );

  function handleAddTag() {
    const error = validarNuevoTag(newTag);
    if (error) {
      setTagError(error);
      focusPrimerCampoConError(groupRef.current);
      return;
    }

    const normalized = normalizeTagName(newTag);

    if (selectedTags.includes(normalized)) {
      setNewTag('');
      setTagError('');
      return;
    }

    onChangeSelected([...selectedTags, normalized]);
    setNewTag('');
    setTagError('');
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  }

  function removeCustomTag(tagName: string) {
    onChangeSelected(selectedTags.filter((name) => name !== tagName));
  }

  return (
    <Form.Group ref={groupRef} className="mb-3">
      <Form.Label>Etiquetas</Form.Label>

      {availableTags.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {availableTags.map((tag) => (
            <Form.Check
              key={tag.id}
              type="checkbox"
              id={`tag-${tag.id}-${tag.name}`}
              label={`#${tag.name}`}
              checked={selectedTags.includes(tag.name)}
              onChange={() => onToggle(tag.name)}
            />
          ))}
        </div>
      )}

      <Form.Label className="small text-muted">Agregar etiqueta nueva</Form.Label>
      <InputGroup className="mb-2">
        <Form.Control
          value={newTag}
          onChange={(e) => {
            setNewTag(e.target.value);
            setTagError('');
          }}
          onKeyDown={handleTagKeyDown}
          placeholder="Ej: gaming, viajes..."
          maxLength={50}
          isInvalid={!!tagError}
        />
        <Button type="button" variant="outline-accent" onClick={handleAddTag}>
          Agregar
        </Button>
      </InputGroup>
      {tagError && <div className="invalid-feedback d-block mb-2">{tagError}</div>}
      <Form.Text>Si la etiqueta no existe, el backend la crea al guardar el post.</Form.Text>

      {customTags.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {customTags.map((tagName) => (
            <Badge key={tagName} bg="primary" className="tag-badge-removable">
              #{tagName}
              <button
                type="button"
                className="tag-remove-btn"
                onClick={() => removeCustomTag(tagName)}
                aria-label={`Quitar etiqueta ${tagName}`}
              >
                <CloseIcon className="tag-remove-icon" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </Form.Group>
  );
}

import { useState, type FormEvent } from 'react';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';
import type { Tag } from '../types';

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

  const customTags = selectedTags.filter(
    (name) => !availableTags.some((tag) => tag.name === name),
  );

  function handleAddTag(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeTagName(newTag);

    if (!normalized) return;
    if (selectedTags.includes(normalized)) {
      setNewTag('');
      return;
    }

    onChangeSelected([...selectedTags, normalized]);
    setNewTag('');
  }

  function removeCustomTag(tagName: string) {
    onChangeSelected(selectedTags.filter((name) => name !== tagName));
  }

  return (
    <Form.Group className="mb-3">
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
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Ej: gaming, viajes..."
        />
        <Button type="button" variant="outline-accent" onClick={handleAddTag}>
          Agregar
        </Button>
      </InputGroup>
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
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </Form.Group>
  );
}
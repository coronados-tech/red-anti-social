import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

export interface SearchableUser {
  id: number;
  nickname: string;
  name: string;
  lastName: string;
  profilePicture?: string | null;
}

interface UserSearchProps {
  mode?: "search" | "select";
  selectedUser?: SearchableUser | null;
  onSelectUser?: (user: SearchableUser) => void;
  onClearSelection?: () => void;
  placeholder?: string;
  controlId?: string;
}

export default function UserSearch({
  mode = "search",
  selectedUser = null,
  onSelectUser,
  onClearSelection,
  placeholder = "Buscar usuarios...",
  controlId,
}: UserSearchProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <InputGroup>
      <Form.Control
        id={controlId}
        placeholder={placeholder}
        onFocus={() => setSearchOpen(true)}
        onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
      />
      {mode === "select" && selectedUser && onClearSelection && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onClearSelection}
        >
          ✕
        </button>
      )}
    </InputGroup>
  );
}

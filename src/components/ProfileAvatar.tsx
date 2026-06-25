import { Form } from "react-bootstrap";

interface ProfileAvatarProps {
  url?: string | null;
  alt?: string;
}

export default function ProfileAvatar({
  url,
  alt = "Perfil",
}: ProfileAvatarProps) {
  return (
    <img
      src={url || "https://via.placeholder.com/32?text=:)"}
      alt={alt}
      className="rounded-circle"
      style={{
        width: "32px",
        height: "32px",
        objectFit: "cover",
        marginRight: "8px",
      }}
    />
  );
}

import { Card } from "react-bootstrap";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const author = post.user || { nickname: "Anónimo" };
  const createdDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("es-ES")
    : "Sin fecha";

  return (
    <Card className="h-100 shadow-sm">
      {post.postImages && post.postImages.length > 0 && (
        <Card.Img
          variant="top"
          src={post.postImages[0].url}
          alt={post.titulo}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title className="text-truncate">{post.titulo}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {author.nickname || author.name} — {createdDate}
        </Card.Text>
        <Card.Text
          className="text-break"
          style={{ maxHeight: "100px", overflow: "hidden" }}
        >
          {post.description}
        </Card.Text>
      </Card.Body>
      {post.tags && post.tags.length > 0 && (
        <Card.Footer className="bg-light">
          <div className="d-flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span key={tag.id} className="badge bg-secondary">
                {tag.name}
              </span>
            ))}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}

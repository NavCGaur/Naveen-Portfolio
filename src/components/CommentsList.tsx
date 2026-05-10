import { readApprovedComments } from "@/lib/github-comments";

export default function CommentsList({ slug }: { slug: string }) {
  const comments = readApprovedComments(slug);

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: "#0D0D0D",
          marginBottom: comments.length ? "24px" : "0",
          fontFamily: "var(--font-dm-serif)",
        }}
      >
        {comments.length === 0
          ? null
          : `${comments.length} Comment${comments.length > 1 ? "s" : ""}`}
      </h3>

      {comments.length === 0 ? null : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                background: "rgba(13,13,13,0.02)",
                border: "1px solid rgba(13,13,13,0.07)",
                borderRadius: "10px",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                {/* Avatar — initial */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(196,163,90,0.15)",
                    border: "1px solid rgba(196,163,90,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#C4A35A",
                    flexShrink: 0,
                  }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#0D0D0D" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(13,13,13,0.40)" }}>
                    {new Date(c.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(13,13,13,0.75)",
                  lineHeight: "1.65",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface JsonLdProps {
  data: object
}

// Renders schema.org JSON-LD safely
// Only rendered server-side, no client JS cost
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is safe here because:
      // 1. `data` comes from our own build-time functions, never from user input
      // 2. We use JSON.stringify which escapes special chars
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  )
}

import { MUTE } from "../theme";

// Body copy under a page caption. The pages reserve vertical room for this by
// measuring the caption (see Room's onCaptionHeight), so it can wrap freely.
export default function Note({ children }) {
  return (
    <p style={{ maxWidth: 560, margin: "12px auto 0", fontSize: 13.5, lineHeight: 1.6, color: MUTE }}>
      {children}
    </p>
  );
}

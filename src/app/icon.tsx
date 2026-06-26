import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1B2A",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#C9972B",
            letterSpacing: -0.5,
          }}
        >
          JM
        </span>
      </div>
    ),
    { ...size }
  );
}

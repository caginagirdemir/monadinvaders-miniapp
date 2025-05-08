import React from "react";

export default function IframeGame() {
  return (
    <iframe
      src="/game/index.html"
      style={{
        width: "100%",
        height: "600px",
        border: "none",
        backgroundColor: "black",
      }}
      title="Game"
    />
  );
}

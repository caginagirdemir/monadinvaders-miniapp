import React from "react";

export default function IframeGame() {
  return (
    <iframe
      src="/game/index.html"
      sandbox="allow-scripts allow-same-origin allow-modals"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        backgroundColor: "black",
      }}
      title="Game"
    />
  );
}

import React from "react";

export default function IframeGame() {
  return (
    <iframe
      src="/game/index.html"
      sandbox="allow-scripts allow-same-origin allow-modals"
      style={{
        width: "100%",
        aspectRatio: "3 / 2",
        border: "none",
        backgroundColor: "black",
        display: "block"
      }}
      
      title="Game"
    />
  );
}

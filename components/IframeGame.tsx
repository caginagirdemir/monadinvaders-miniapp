import Head from "next/head";

export default function IframeGame() {
  return (
    <>
      <Head>
        <meta name="fc:frame" content='{
          "version": "vNext",
          "imageUrl": "https://monadinvaders-miniapp-dev.vercel.app/images/feed.png",
          "buttons": [
            {
              "title": "Play Game",
              "action": {
                "type": "link",
                "url": "https://monadinvaders.xyz"
              }
            }
          ]
        }' />
      </Head>

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
    </>
  );
}

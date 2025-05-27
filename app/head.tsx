export default function Head() {
  return (
    <>
      <title>Monad Invaders</title>
      <meta name="description" content="Monad Invaders" />

      <meta
        property="fc:frame"
        content='{
          "version": "next",
          "imageUrl": "https://monadinvaders-miniapp.vercel.app/images/feed.png",
          "iconUrl": "https://monadinvaders-miniapp.vercel.app/images/splash.png",
          "name": "Monad Invaders",
          "button": {
            "title": "Play Game",
            "action": {
              "type": "launch_frame",
              "name": "Monad Invaders",
              "url": "https://monadinvaders-miniapp.vercel.app",
              "splashImageUrl": "https://monadinvaders-miniapp.vercel.app/images/splash.png",
              "splashBackgroundColor": "#000000"
            }
          }
        }'
      />
    </>
  );
}

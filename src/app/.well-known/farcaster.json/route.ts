export async function GET() {
    const appUrl = process.env.NEXT_PUBLIC_URL;
  
    const config = {
      accountAssociation: {
        header:
          "",
        payload: "",
        signature:
          "",
      },
      frame: {
        version: "1",
        name: "BlockDrop",
        iconUrl: `https://blockdrop-nine.vercel.app/icon.png`,
        homeUrl: appUrl,
        imageUrl: `https://blockdrop-nine.vercel.app/frames/hello/opengraph-image`,
        buttonTitle: "Launch Frame",
        splashImageUrl: `https://blockdrop-nine.vercel.app/splash.png`,
        splashBackgroundColor: "#f7f7f7",
        webhookUrl: `${appUrl}/api/webhook`,
      },
    };
  
    return Response.json(config);
  }
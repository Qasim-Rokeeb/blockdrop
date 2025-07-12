export async function GET() {
    const appUrl = process.env.NEXT_PUBLIC_URL;
  
    const config = {
     "accountAssociation": {
          "header": "eyJmaWQiOjg3MjkzNSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEFEMDYzMjVEMjExODhEQ2FlMEJFRDMxODQ0ZDg3MjllQ0Y3MDQxRGIifQ",
          "payload": "eyJkb21haW4iOiJibG9ja2Ryb3AtbmluZS52ZXJjZWwuYXBwIn0",
          "signature": "MHhiM2M4YmVmYWNiMTg3YzZjNGQyNjViNjFlMDliZWYwNDNmZGI1ZDg0OGRjZDBhYjY0ZmNlYzk5MDk2OWM4Yzg1N2EzZTUzODFmYmZjYzRkYmQ4NDk2OWQwZTIxMmViNTA3YjNmMDIwMTE1MWFkMGQzYTM5OThlYmJiMTMxN2YxZDFj"
        },

      frame: {
        version: "1",
        name: "BlockDrop",
        iconUrl: `https://blockdrop-nine.vercel.app/icon.png`,
        homeUrl: 'https://blockdrop-nine.vercel.app',
        imageUrl: `https://blockdrop-nine.vercel.app/frames/hello/opengraph-image`,
        buttonTitle: "Launch Frame",
        splashImageUrl: `https://blockdrop-nine.vercel.app/splash.png`,
        splashBackgroundColor: "#f7f7f7",
        webhookUrl: `https://blockdrop-nine.vercel.app/api/webhook`,
      },
    };
  
    return Response.json(config);
  }
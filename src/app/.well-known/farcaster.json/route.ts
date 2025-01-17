import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAic3RlcGhhbmNpbGwtc2t5Y2FzdC52ZXJjZWwuYXBwIn0",
      signature: "MHhiNGY3Yzk2ODU5NjEwYjMwOTFhODExYjc2MjVhNTkwYWY4ZWVmYzhlOWM1ZDI5OGFkMDJjMmVkMWZiNjZkYzAyMDIyMGEyNjA2NzdhNGRlNDVhNzJhM2M0ZDNiMWE2NTg1ODExNjBiZDljODZmNWNlZWMwMTNmOTY3ZGMzMzA0ZjFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}

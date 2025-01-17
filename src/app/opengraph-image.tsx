import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-gradient-to-b from-sky-400 to-blue-600">
        <div tw="flex flex-col items-center bg-white/90 p-8 rounded-2xl shadow-2xl">
          <h1 tw="text-6xl font-bold text-blue-900 mb-4">{PROJECT_TITLE}</h1>
          <h3 tw="text-2xl text-blue-800 text-center max-w-[80%]">{PROJECT_DESCRIPTION}</h3>
          <div tw="mt-6 flex items-center">
            <img 
              src="https://openweathermap.org/img/wn/02d@2x.png" 
              tw="w-20 h-20 mr-4" 
              alt="Weather Icon"
            />
            <span tw="text-3xl text-blue-900">☀️ 24°C</span>
          </div>
          <div tw="mt-8 text-blue-700 text-lg">Powered by Farcaster Frames</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

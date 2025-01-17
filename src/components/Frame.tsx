"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function WeatherCard({ weather }: { weather: any }) {
  if (!weather) return null;

  const temp = Math.round(weather.main.temp - 273.15); // Convert from Kelvin to Celsius
  const icon = weather.weather[0].icon;
  const description = weather.weather[0].description;

  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Current Weather</CardTitle>
        <CardDescription className="text-neutral-600">
          {weather.name}, {weather.sys.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-800">
        <div className="flex items-center gap-4">
          <img 
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-16 h-16"
          />
          <div>
            <p className="text-2xl font-bold">{temp}°C</p>
            <p className="capitalize">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [added, setAdded] = useState(false);
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchWeather = useCallback(async (loc: string) => {
    try {
      const response = await fetch(
        `${OPENWEATHER_API_URL}?q=${encodeURIComponent(loc)}&appid=${OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError(data.message || "Failed to fetch weather");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error(err);
    }
  }, []);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        
        <div className="mb-4">
          <Label htmlFor="location" className="block mb-2 text-neutral-700">
            Enter Location
          </Label>
          <div className="flex gap-2">
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="City, Country"
            />
            <PurpleButton 
              onClick={() => fetchWeather(location)}
              disabled={!location.trim()}
            >
              Get Weather
            </PurpleButton>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

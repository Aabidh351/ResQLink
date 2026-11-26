
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

import {
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

import { authClient } from "../lib/auth-client";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { data: session, isPending } = authClient.useSession();

  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded || isPending) return;

    const currentScreen = segments[0];
    const isAuthenticated = !!session?.user;

    const isAuthScreen =
      currentScreen === "sign-in" || currentScreen === "sign-up";

    if (!isAuthenticated && currentScreen === "home") {
      router.replace("/");
    }

    if (isAuthenticated && (isAuthScreen || !currentScreen)) {
      router.replace("/home");
    }
  }, [fontsLoaded, isPending, session, segments, router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#F4F0E6",
          },
        }}
      />
    </>
  );
}

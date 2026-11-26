
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "../lib/auth-client";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);

      const { error } = await authClient.signOut();

      if (error) {
        Alert.alert("Logout failed", error.message);
        return;
      }

      router.replace("/");
    } catch {
      Alert.alert("Error", "Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.brand}>ResQLink</Text>
        <Text style={styles.heading}>
          Welcome, {session?.user.name || "User"}!
        </Text>
        <Text style={styles.description}>
          You're successfully signed in.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={handleSignOut}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.onPrimary} />
        ) : (
          <Text style={styles.buttonText}>Sign out</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: "space-between",
  },
  brand: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.primary,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 34,
    color: COLORS.text,
    marginTop: SPACING.xl,
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.muted,
    marginTop: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.onPrimary,
  },
});

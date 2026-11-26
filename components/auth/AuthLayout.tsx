
import { ReactNode } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONTS, SPACING, RADIUS } from "../../constants/theme";

type AuthLayoutProps = {
  mode: "sign-in" | "sign-up";
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthLayout({
  mode,
  title,
  description,
  children,
}: AuthLayoutProps) {
  const isSignIn = mode === "sign-in";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brand}>ResQLink</Text>
            <Text style={styles.tagline}>
              Connecting People, Resources, and Emergency Support.
            </Text>

            <View style={styles.card}>
              <View style={styles.toggle}>
                <Pressable
                  onPress={() => router.replace("/sign-in")}
                  style={[
                    styles.toggleOption,
                    isSignIn && styles.activeToggle,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      isSignIn && styles.activeToggleText,
                    ]}
                  >
                    Sign In
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/sign-up")}
                  style={[
                    styles.toggleOption,
                    !isSignIn && styles.activeToggle,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !isSignIn && styles.activeToggleText,
                    ]}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.heading}>{title}</Text>
              <Text style={styles.description}>{description}</Text>

              {children}
            </View>

            <Text style={styles.footer}>
              PEOPLE FIRST. COMMUNITY ALWAYS.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  brand: {
    fontFamily: FONTS.heading,
    fontSize: 38,
    color: COLORS.primary,
  },
  tagline: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 2,
    marginBottom: SPACING.xl,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    elevation: 5,
    shadowColor: "#514B3F",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: RADIUS.full,
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toggleText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.muted,
  },
  activeToggleText: {
    fontFamily: FONTS.semibold,
    color: COLORS.onPrimary,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.text,
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    marginTop: 3,
    marginBottom: SPACING.lg,
  },
  footer: {
    fontFamily: FONTS.semibold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.muted,
    marginTop: SPACING.xl,
  },
});

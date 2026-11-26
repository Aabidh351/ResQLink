import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";
import { Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/resqlink-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>
        Connecting People, Resources, and Emergency Support.
      </Text>
      <Pressable
  onPress={() => router.push("/sign-up")}
  style={{
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 24,
  }}
>
  <Text
    style={{
      color: COLORS.onPrimary,
      fontFamily: FONTS.semibold,
      fontSize: 15,
    }}
  >
    Create an account
  </Text>
</Pressable>
<Pressable
  onPress={() => router.push("/sign-in")}
  style={{ marginTop: 16 }}
>
  <Text
    style={{
      color: COLORS.primary,
      fontFamily: FONTS.semibold,
      fontSize: 15,
    }}
  >
    Already have an account? Sign in
  </Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  logo: {
    width: 280,
    height: 280,
  },
  title: {
    color: COLORS.primary,
    fontFamily: FONTS.heading,
    fontSize: 42,
  },
  subtitle: {
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 15,
    textAlign: "center",
    marginTop: SPACING.md,
  },
});
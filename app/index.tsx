import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

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
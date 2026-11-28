
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { COLORS, FONTS, RADIUS, SPACING } from "../../constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "destructive";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? COLORS.primary : COLORS.onPrimary}
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 5,
  },

  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  outline: {
  backgroundColor: "transparent",
  borderWidth: 1.5,
  borderColor: COLORS.primary,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
},

  destructive: {
    backgroundColor: COLORS.critical,
    shadowColor: COLORS.critical,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 3,
  },

  text: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    textAlign: "center",
  },

  primaryText: {
    color: COLORS.onPrimary,
  },

  secondaryText: {
    color: COLORS.primary,
  },

  outlineText: {
    color: COLORS.primary,
  },

  destructiveText: {
    color: COLORS.white,
  },

  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
});

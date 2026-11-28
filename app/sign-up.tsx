
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import AuthLayout from "../components/auth/AuthLayout";
import { authClient } from "../lib/auth-client";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";
import { router } from "expo-router";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      });

      if (error) {
        Alert.alert("Registration failed", error.message);
        return;
      }

      Alert.alert(
        "Account created",
        "Your ResQLink account has been created successfully.",
        [{ text: "Continue", onPress: () => router.replace("/home") }]
      );
    } catch {
      Alert.alert(
        "Something went wrong",
        "Unable to create your account. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="sign-up"
      title="Create your account"
      description="Join your community and stay connected to emergency support."
    >
      <View style={styles.form}>
        <Text style={styles.label}>FULL NAME *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor={COLORS.muted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>EMAIL ADDRESS *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>PHONE NUMBER (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor={COLORS.muted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>PASSWORD *</Text>
        <TextInput
          style={styles.input}
          placeholder="At least 8 characters"
          placeholderTextColor={COLORS.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>CONFIRM PASSWORD *</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter your password"
          placeholderTextColor={COLORS.muted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          )}
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    height: 49,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: "#514B3F",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  button: {
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: COLORS.onPrimary,
  },
});

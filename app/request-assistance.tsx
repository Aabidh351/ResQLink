
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "../lib/auth-client";
import Button from "../components/ui/Button";
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
} from "../constants/theme";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const assistanceTypes = [
  "Medical Assistance",
  "Food & Water",
  "Rescue",
  "Shelter",
  "Other",
];

export default function RequestAssistanceScreen() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [peopleCount, setPeopleCount] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type || !description.trim() || !location.trim()) {
      Alert.alert(
        "Incomplete Information",
        "Please complete all the required fields."
      );
      return;
    }

    const count = Number(peopleCount);

    if (!Number.isInteger(count) || count < 1) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid number of people."
      );
      return;
    }

    try {
      setLoading(true);

      // Retrieve the JWT from Better Auth.
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Unable to retrieve your authentication token.");
      }

      // Submit the assistance request.
      const response = await fetch(
        `${API_URL}/api/assistance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            type,
            description: description.trim(),
            location: location.trim(),
            peopleCount: count,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit your request."
        );
      }

      Alert.alert(
        "Request Submitted",
        "Your assistance request has been submitted successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/home"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.headingSection}>
            <Text style={styles.label}>
              EMERGENCY ASSISTANCE
            </Text>

            <Text style={styles.title}>
              How can we help?
            </Text>

            <Text style={styles.subtitle}>
              Tell us what is happening so our community
              can connect you with the right support.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.fieldLabel}>
              What kind of help do you need?
            </Text>

            <View style={styles.typeContainer}>
              {assistanceTypes.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setType(item)}
                  style={[
                    styles.typeOption,
                    type === item && styles.selectedType,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      type === item && styles.selectedTypeText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>
              Describe your situation
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Explain what happened and what help you need..."
              placeholderTextColor={COLORS.muted}
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.descriptionInput]}
            />

            <Text style={styles.fieldLabel}>
              Your current location
            </Text>

            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter your area, city or address"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>
              Number of people needing assistance
            </Text>

            <TextInput
              value={peopleCount}
              onChangeText={setPeopleCount}
              placeholder="1"
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
              style={styles.input}
            />

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                Important
              </Text>

              <Text style={styles.noticeText}>
                Please provide accurate information so
                responders can understand your situation.
              </Text>
            </View>

            <Button
              title="Submit Assistance Request  →"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            />

            <Text style={styles.footerText}>
              ResQLink • Connecting People, Resources & Support
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: SPACING.sm,
  },

  backText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.primary,
  },

  headingSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  label: {
    fontFamily: FONTS.semibold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: COLORS.accent,
  },

  title: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },

  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.muted,
    marginTop: SPACING.xs,
  },

  form: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  fieldLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },

  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  typeOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  selectedType: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  typeText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.text,
  },

  selectedTypeText: {
    color: COLORS.onPrimary,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.text,
  },

  descriptionInput: {
    minHeight: 125,
    paddingTop: SPACING.md,
  },

  notice: {
    backgroundColor: "#EAE5D7",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },

  noticeTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.primary,
  },

  noticeText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },

  submitButton: {
    marginTop: SPACING.lg,
  },

  footerText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
});

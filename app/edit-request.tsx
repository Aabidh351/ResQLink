
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { authClient } from "../lib/auth-client";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";
import Button from "../components/ui/Button";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type AssistanceRequest = {
  _id: string;
  description: string;
  location: string;
  peopleCount: number;
  status: string;
};

export default function EditRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [request, setRequest] = useState<AssistanceRequest | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [peopleCount, setPeopleCount] = useState("1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  async function fetchRequest() {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(`${API_URL}/api/assistance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load request.");
      }

      const currentRequest = data.request;

      if (currentRequest.status !== "pending") {
        throw new Error("Only pending requests can be edited.");
      }

      setRequest(currentRequest);
      setDescription(currentRequest.description);
      setLocation(currentRequest.location);
      setPeopleCount(String(currentRequest.peopleCount));
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Something went wrong."
      );
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!description.trim() || !location.trim() || !peopleCount.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const count = Number(peopleCount);

    if (!Number.isInteger(count) || count < 1) {
      Alert.alert("Invalid Number", "Enter a valid number of people.");
      return;
    }

    try {
      setSaving(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(`${API_URL}/api/assistance/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          location,
          peopleCount: count,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update request.");
      }

      Alert.alert("Success", "Your request has been updated.", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/request-details",
              params: { id },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!request) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Request</Text>
      <Text style={styles.subtitle}>
        Update the information in your assistance request.
      </Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Describe your situation"
        placeholderTextColor={COLORS.muted}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter your location"
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Number of People</Text>
      <TextInput
        style={styles.input}
        value={peopleCount}
        onChangeText={setPeopleCount}
        keyboardType="number-pad"
        placeholder="Number of people"
        placeholderTextColor={COLORS.muted}
      />

      <Button
        title="Save Changes"
        onPress={handleUpdate}
        loading={saving}
        disabled={saving}
        style={styles.saveButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.muted,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  textArea: {
    minHeight: 120,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

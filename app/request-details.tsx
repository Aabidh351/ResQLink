
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { authClient } from "../lib/auth-client";
import Button from "../components/ui/Button";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type AssistanceRequest = {
  _id: string;
  type: string;
  description: string;
  location: string;
  peopleCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  requester?: {
    name: string;
    email: string;
    phone?: string | null;
  };
};

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [request, setRequest] = useState<AssistanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequest();
  }, [id]);

  async function fetchRequest() {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/assistance/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load request.");
      }

      setRequest(data.request);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "completed":
        return COLORS.success;
      case "rejected":
        return COLORS.critical;
      case "in-progress":
      case "accepted":
        return COLORS.medium;
      default:
        return COLORS.muted;
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !request) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Request not found."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Request Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Request Type</Text>
        <Text style={styles.value}>{request.type}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Status</Text>
        <Text
          style={[
            styles.value,
            { color: getStatusColor(request.status) },
          ]}
        >
          {request.status.toUpperCase()}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{request.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{request.location}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>People Affected</Text>
        <Text style={styles.value}>{request.peopleCount}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Submitted On</Text>
        <Text style={styles.value}>
          {new Date(request.createdAt).toLocaleString()}
        </Text>

        {request.updatedAt !== request.createdAt && (
          <>
            <View style={styles.divider} />
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.value}>
              {new Date(request.updatedAt).toLocaleString()}
            </Text>
          </>
        )}

        {request.requester && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionHeading}>Requester Information</Text>

            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{request.requester.name}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{request.requester.email}</Text>

            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>
              {request.requester.phone || "Not provided"}
            </Text>
          </>
        )}
        {request.status.toLowerCase() === "pending" && (
  <Button
    title="Edit Request"
    variant="outline"
    onPress={() =>
      router.push({
        pathname: "/edit-request",
        params: { id: request._id },
      })
    }
    style={styles.editButton}
  />
)}
      </View>
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
    padding: SPACING.lg,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  value: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sectionHeading: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.critical,
    textAlign: "center",
  },
  editButton: {
  marginTop: SPACING.md,
},
});

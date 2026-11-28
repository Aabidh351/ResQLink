
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
  View,
} from "react-native";
import { authClient } from "../lib/auth-client";
import { router } from "expo-router";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";
import Button from "../components/ui/Button";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type AssistanceRequest = {
  _id: string;
  type: string;
  description: string;
  location: string;
  peopleCount: number;
  status: string;
  createdAt: string;
};

export default function MyRequestsScreen() {
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/api/assistance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load your requests.");
      }

      setRequests(data.requests);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }
  async function cancelRequest(id: string) {
  Alert.alert(
    "Cancel Request",
    "Are you sure you want to cancel this assistance request?",
    [
      { text: "Keep Request", style: "cancel" },
      {
        text: "Cancel Request",
        style: "destructive",
        onPress: async () => {
          try {
            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (!token) {
              throw new Error("Please sign in again.");
            }

            const response = await fetch(
              `${API_URL}/api/assistance/${id}/cancel`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || "Unable to cancel request.");
            }

            await fetchRequests();

            Alert.alert("Success", "Your request has been cancelled.");
          } catch (err) {
            Alert.alert(
              "Error",
              err instanceof Error ? err.message : "Something went wrong."
            );
          }
        },
      },
    ]
  );
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

  function renderRequest({ item }: { item: AssistanceRequest }) {
    return (
      <Pressable
  style={styles.card}
  onPress={() =>
    router.push({
      pathname: "/request-details",
      params: { id: item._id },
    })
  }>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{item.type}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <Text style={styles.detail}>Location: {item.location}</Text>
        <Text style={styles.detail}>
          People affected: {item.peopleCount}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.status.toLowerCase() === "pending" && (
  <Button
    title="Cancel Request"
    variant="destructive"
    onPress={() => cancelRequest(item._id)}
    style={styles.cancelButton}
  />
)}
      </ Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Requests</Text>
      <Text style={styles.subtitle}>
        Track the assistance requests you've submitted.
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptyText}>
            Your submitted assistance requests will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequest}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchRequests}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
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
    marginBottom: SPACING.lg,
  },
  loader: {
    marginTop: SPACING.xl,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.sm,
  },
  type: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    textTransform: "capitalize",
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  detail: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.muted,
    marginTop: SPACING.sm,
  },
  date: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.muted,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
  },
  cancelButton: {
  marginTop: SPACING.md,
},
});

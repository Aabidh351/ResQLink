
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable
} from "react-native";
import { authClient } from "../lib/auth-client";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type AssistanceRequest = {
  _id: string;
  requester?: {
    name?: string;
    email?: string;
    phone?: string | null;
  };
  type: string;
  description: string;
  location: string;
  peopleCount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

export default function OrganizationHistory() {
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/assistance/organization-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load request history.");
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

  function renderRequest({ item }: { item: AssistanceRequest }) {
    const isCompleted = item.status === "completed";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{item.type}</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompleted
                  ? "#2F7D4F20"
                  : "#B4231820",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isCompleted
                    ? COLORS.success
                    : COLORS.critical,
                },
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Requester Information</Text>

        <Text style={styles.detail}>
          Name: {item.requester?.name || "Not available"}
        </Text>

        <Text style={styles.detail}>
          Email: {item.requester?.email || "Not available"}
        </Text>

        <Text style={styles.detail}>
          Phone: {item.requester?.phone || "Not provided"}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.detail}>Location: {item.location}</Text>
        <Text style={styles.detail}>
          People affected: {item.peopleCount}
        </Text>

        <Text style={styles.date}>
          Submitted: {new Date(item.createdAt).toLocaleString()}
        </Text>

        {item.updatedAt && (
          <Text style={styles.date}>
            Last updated: {new Date(item.updatedAt).toLocaleString()}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Request History</Text>
      <Text style={styles.subtitle}>
        Review previously completed and rejected requests.
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={fetchHistory} style={styles.retryButton}>
  <Text style={styles.retryButtonText}>Try Again</Text>
</Pressable>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No request history</Text>
          <Text style={styles.emptyText}>
            Completed and rejected requests will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequest}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchHistory}
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
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  sectionHeading: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  detail: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.muted,
    marginTop: SPACING.xs,
  },
  date: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.muted,
    marginTop: SPACING.md,
  },
  retryButton: {
    marginTop: SPACING.md,
    minWidth: 140,
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
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.critical,
    textAlign: "center",
  },
  retryButton: {
  marginTop: SPACING.md,
  minWidth: 140,
  minHeight: 50,
  borderRadius: RADIUS.full,
  backgroundColor: COLORS.primary,
  justifyContent: "center",
  alignItems: "center",
},

retryButtonText: {
  fontFamily: FONTS.semibold,
  color: COLORS.onPrimary,
  fontSize: 14,
},
});

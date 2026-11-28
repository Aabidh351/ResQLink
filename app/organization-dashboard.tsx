
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { authClient } from "../lib/auth-client";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";
import Button from "../components/ui/Button";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type AssistanceRequest = {
  _id: string;
  requester: {
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
};

type RequestStatus =
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed";

export default function OrganizationDashboard() {
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<{
    id: string;
    status: RequestStatus;
  } | null>(null);

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  async function fetchIncomingRequests() {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/assistance/incoming`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load incoming requests."
        );
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

  async function updateRequestStatus(
    id: string,
    status: RequestStatus
  ) {
    try {
      setProcessing({ id, status });

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/assistance/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update request.");
      }

      setRequests((current) =>
  current.map((request) =>
    request._id === id
      ? { ...request, status }
      : request
  )
);

      Alert.alert(
        "Success",
        `Request ${status} successfully.`
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setProcessing(null);
    }
  }

  function renderRequest({ item }: { item: AssistanceRequest }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{item.type}</Text>

          <View
  style={[
    styles.statusBadge,
    {
      backgroundColor:
        item.status === "completed" || item.status === "accepted"
          ? "#2F7D4F20"
          : item.status === "rejected"
            ? "#B4231820"
            : item.status === "in-progress"
              ? "#1E4D5A20"
              : "#A1620720",
    },
  ]}
>
  <Text
    style={[
      styles.statusText,
      {
        color:
          item.status === "completed" || item.status === "accepted"
            ? COLORS.success
            : item.status === "rejected"
              ? COLORS.critical
              : item.status === "in-progress"
                ? COLORS.primary
                : COLORS.medium,
      },
    ]}
  >
    {item.status.replace("-", " ").toUpperCase()}
  </Text>
</View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Requester Information</Text>
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

        
{item.status === "pending" && (
  <View style={styles.actions}>
    <Button
      title="Accept"
      onPress={() =>
        updateRequestStatus(item._id, "accepted")
      }
      loading={
        processing?.id === item._id &&
        processing.status === "accepted"
      }
      disabled={processing !== null}
      style={styles.actionButton}
    />

    <Button
      title="Reject"
      variant="destructive"
      onPress={() =>
        updateRequestStatus(item._id, "rejected")
      }
      loading={
        processing?.id === item._id &&
        processing.status === "rejected"
      }
      disabled={processing !== null}
      style={styles.actionButton}
    />
  </View>
)}

{item.status === "accepted" && (
  <Button
    title="Start Assistance"
    onPress={() =>
      updateRequestStatus(item._id, "in-progress")
    }
    loading={
      processing?.id === item._id &&
      processing.status === "in-progress"
    }
    disabled={processing !== null}
    style={styles.actionButton}
  />
)}

{item.status === "in-progress" && (
  <Button
    title="Mark as Completed"
    onPress={() =>
      updateRequestStatus(item._id, "completed")
    }
    loading={
      processing?.id === item._id &&
      processing.status === "completed"
    }
    disabled={processing !== null}
    style={styles.actionButton}
  />
)}

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Organization Dashboard</Text>
      <Text style={styles.subtitle}>
        Review incoming assistance requests.
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
          <Button
            title="Try Again"
            onPress={fetchIncomingRequests}
            style={styles.retryButton}
          />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No incoming requests</Text>
          <Text style={styles.emptyText}>
            New pending assistance requests will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequest}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchIncomingRequests}
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
    backgroundColor: "#A1620720",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.medium,
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
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
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
});

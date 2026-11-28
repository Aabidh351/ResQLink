
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "../lib/auth-client";
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
} from "../constants/theme";
import Button from "../components/ui/Button";

// Dashboard service card
type ServiceCardProps = {
  number: string;
  title: string;
  description: string;
  onPress: () => void;
};

function ServiceCard({
  number,
  title,
  description,
  onPress,
}: ServiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.serviceCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.serviceIcon}>
        <Text style={styles.serviceNumber}>{number}</Text>
      </View>

      <Text style={styles.serviceTitle}>{title}</Text>

      <Text style={styles.serviceDescription}>
        {description}
      </Text>

      <Text style={styles.cardArrow}>Explore {"→"}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const displayName = session?.user.name?.trim() || "there";

  const firstName = displayName.split(" ")[0];

  // Temporary notice until individual screens are developed.
  const handleComingSoon = (feature: string) => {
    Alert.alert(
      feature,
      "This section is being developed and will be available soon."
    );
  };

  // Existing authentication functionality preserved.
  const handleSignOut = async () => {
    try {
      setLoading(true);

      const { error } = await authClient.signOut();

      if (error) {
        Alert.alert("Logout failed", error.message);
        return;
      }

      router.replace("/");
    } catch {
      Alert.alert(
        "Error",
        "Unable to sign out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/resqlink-logo-horizontal.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="ResQLink logo"
          />

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* WELCOME SECTION */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>
            YOUR COMMUNITY SUPPORT PLATFORM
          </Text>

          <Text style={styles.welcomeTitle}>
            Hello, {firstName}!
          </Text>

          <Text style={styles.welcomeDescription}>
            We're here to connect you with the help and
            support you need.
          </Text>
        </View>

        {/* EMERGENCY ASSISTANCE CARD */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.emergencyBadgeText}>
              EMERGENCY SUPPORT
            </Text>
          </View>

          <Text style={styles.emergencyTitle}>
            Need immediate assistance?
          </Text>

          <Text style={styles.emergencyDescription}>
            Let us know what happened. Connect with
            volunteers and relief organizations.
          </Text>

          <Button
  title="Request Assistance  →"
  onPress={() => handleComingSoon("Emergency Assistance")}
  style={styles.emergencyButton}
/>
        </View>

        {/* QUICK ACCESS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Quick Access
            </Text>

            <Text style={styles.sectionSubtitle}>
              Explore ResQLink services
            </Text>
          </View>
        </View>

        <View style={styles.serviceGrid}>
          <ServiceCard
            number="01"
            title="My Requests"
            description="Track your emergency assistance requests."
            onPress={() =>
              handleComingSoon("My Requests")
            }
          />

          <ServiceCard
            number="02"
            title="Find Shelters"
            description="Discover nearby emergency shelters."
            onPress={() =>
              handleComingSoon("Find Shelters")
            }
          />

          <ServiceCard
            number="03"
            title="Accommodation"
            description="Request temporary shelter and accommodation."
            onPress={() =>
              handleComingSoon("Accommodation")
            }
          />

          <ServiceCard
            number="04"
            title="Relief Resources"
            description="Explore available essential relief resources."
            onPress={() =>
              handleComingSoon("Relief Resources")
            }
          />
        </View>

        {/* INFORMATION CARD */}
        <View style={styles.informationCard}>
          <Text style={styles.informationTitle}>
            A little preparedness goes a long way.
          </Text>

          <Text style={styles.informationDescription}>
            Keep your contact information and location
            details updated so responders can assist you
            more effectively.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Connecting People, Resources & Support.
          </Text>

          <Text style={styles.versionText}>
            ResQLink • Community Support
          </Text>
        </View>

      </ScrollView>

      {/* SIGN OUT */}
      <View style={styles.logoutContainer}>
        <Button
  title="Sign out"
  variant="secondary"
  onPress={handleSignOut}
  loading={loading}
  style={styles.logoutButton}
/>
      </View>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 185,
    height: 65,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.onPrimary,
  },

  // Welcome
  welcomeSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  welcomeLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: COLORS.accent,
  },

  welcomeTitle: {
    fontFamily: FONTS.heading,
    fontSize: 38,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },

  welcomeDescription: {
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
    marginTop: SPACING.xs,
  },

  // Emergency card
  emergencyCard: {
  backgroundColor: COLORS.primary,
  borderRadius: RADIUS.xl,
  padding: SPACING.lg,
  marginBottom: SPACING.xl,
  shadowColor: "#173B43",
  shadowOffset: { width: 0, height: 7 },
  shadowOpacity: 0.16,
  shadowRadius: 14,
  elevation: 5,
},

  emergencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.13)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },

  statusDot: {
    width: 7,
    height: 7,
    backgroundColor: "#D8BC79",
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },

  emergencyBadgeText: {
    fontFamily: FONTS.semibold,
    color: COLORS.onPrimary,
    fontSize: 10,
    letterSpacing: 1,
  },

  emergencyTitle: {
    fontFamily: FONTS.heading,
    fontSize: 29,
    lineHeight: 35,
    color: COLORS.white,
    marginTop: SPACING.md,
  },

  emergencyDescription: {
    fontFamily: FONTS.body,
    fontSize: 13,
    lineHeight: 21,
    color: "#E5E9E5",
    marginTop: SPACING.sm,
  },

  emergencyButton: {
  backgroundColor: COLORS.accent,
  borderWidth: 0,
  borderRadius: RADIUS.full,
  minHeight: 54,
  paddingHorizontal: SPACING.lg,
  marginTop: SPACING.lg,
  shadowColor: "#102F36",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 8,
  elevation: 4,
},

  emergencyButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.white,
  },

  emergencyArrow: {
    fontSize: 22,
    color: COLORS.white,
  },

  // Quick access
  sectionHeader: {
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.text,
  },

  sectionSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },

  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceCard: {
  width: "48%",
  minHeight: 170,
  backgroundColor: COLORS.surface,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.lg,
  padding: SPACING.md,
  marginBottom: SPACING.md,
  shadowColor: "#244D55",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 9,
  elevation: 2,
},

  cardPressed: {
  opacity: 0.88,
  transform: [{ scale: 0.98 }],
},

  serviceIcon: {
  width: 40,
  height: 40,
  backgroundColor: COLORS.background,
  borderRadius: RADIUS.md,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: SPACING.md,
},

  serviceNumber: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.primary,
  },

  serviceTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
  },

  serviceDescription: {
  fontFamily: FONTS.body,
  fontSize: 12,
  lineHeight: 18,
  color: COLORS.muted,
  marginTop: SPACING.xs,
},

  cardArrow: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: COLORS.accent,
    marginTop: SPACING.sm,
  },

  // Information
  informationCard: {
  backgroundColor: "#EAE5D7",
  borderRadius: RADIUS.lg,
  padding: SPACING.lg,
  marginTop: SPACING.sm,
  borderWidth: 1,
  borderColor: "rgba(36, 77, 64, 0.08)",
},

  informationTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.primary,
  },

  informationDescription: {
    fontFamily: FONTS.body,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.text,
    marginTop: SPACING.sm,
  },

  // Footer
  footer: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },

  footerText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.muted,
  },

  versionText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.muted,
    marginTop: SPACING.xs,
  },

  // Logout
  logoutContainer: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  logoutButton: {
  minHeight: 50,
  borderRadius: RADIUS.full,
  borderWidth: 1,
  borderColor: COLORS.border,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.surface,
  shadowColor: "#244D55",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 2,
},

  logoutText: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.primary,
  },

  buttonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.985 }],
},
});

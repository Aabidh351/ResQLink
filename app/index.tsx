import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ResQLink</Text>
      <Text style={styles.subtitle}>
        Connecting People, Resources, and Emergency Support.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F0E6",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#1E4D5A",
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#292D23",
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
  },
});
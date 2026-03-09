import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/features/auth/components/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { colors } from "@/shared/theme/colors";

export function HomeScreen() {
	const { user, logout, isLoading } = useAuth();

	const userName = user?.name ?? "-";
	const userEmail = user?.email ?? "-";

	const handleLogout = useCallback(async () => {
		await logout();
	}, [logout]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.profileRow}>
					<Ionicons
						name="person-circle-outline"
						size={48}
						color={colors.text}
					/>
					<View style={styles.profileInfo}>
						<Text style={styles.userName}>Name: {userName}</Text>
						<Text style={styles.userEmail}>Email: {userEmail}</Text>
					</View>
				</View>

				<Button onPress={handleLogout} isLoading={isLoading} label="Logout" />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: colors.background,
		flex: 1,
	},
	container: {
		flex: 1,
		padding: 24,
		gap: 24,
		justifyContent: "center",
	},
	profileRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 16,
	},
	profileInfo: {
		flex: 1,
		gap: 2,
	},
	userName: {
		color: colors.text,
		fontSize: 17,
		fontWeight: "600",
	},
	userEmail: {
		color: colors.textSecondary,
		fontSize: 15,
	},
	logoutButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 12,
		justifyContent: "center",
		marginBottom: 8,
		minHeight: 52,
		paddingHorizontal: 20,
	},
	logoutButtonText: {
		color: colors.surface,
		fontSize: 16,
		fontWeight: "600",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
});

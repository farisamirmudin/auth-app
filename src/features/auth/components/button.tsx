import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/shared/theme/colors";

export function Button({
	onPress,
	isLoading,
	label,
	variant = "primary",
}: {
	onPress: () => void;
	isLoading: boolean;
	label: string;
	variant?: "primary" | "link";
}) {
	return (
		<Pressable
			accessibilityRole="button"
			style={[
				variant === "primary" ? styles.primaryButton : styles.link,
				isLoading ? styles.buttonDisabled : null,
			]}
			onPress={onPress}
			disabled={isLoading}
		>
			{isLoading ? (
				<ActivityIndicator size="small" color={colors.surface} />
			) : (
				<Text
					style={
						variant === "primary" ? styles.primaryButtonText : styles.linkText
					}
				>
					{label}
				</Text>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	primaryButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 12,
		minHeight: 52,
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	primaryButtonText: {
		color: colors.surface,
		fontSize: 16,
		fontWeight: "600",
	},
	link: {
		alignItems: "center",
		minHeight: 52,
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	linkText: {
		color: colors.textSecondary,
		fontSize: 16,
		fontWeight: "600",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
});

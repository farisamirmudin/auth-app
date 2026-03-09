import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/shared/theme/colors";

export function Layout({
	title,
	description,
	children,
}: PropsWithChildren<{
	title: string;
	description: string;
}>) {
	return (
		<SafeAreaView edges={["top"]} style={styles.safeArea}>
			<KeyboardAwareScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				bottomOffset={20}
			>
				<View style={styles.card}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
					<View style={styles.formFields}>{children}</View>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: colors.background,
		flex: 1,
	},
	scroll: { flex: 1 },
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 24,
	},
	card: {
		backgroundColor: colors.surface,
		borderRadius: 20,
		padding: 28,
		gap: 6,
	},
	title: {
		color: colors.text,
		fontSize: 32,
		fontWeight: "700",
		letterSpacing: -0.5,
	},
	description: {
		color: colors.textSecondary,
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 20,
	},
	formFields: {
		gap: 20,
	},
});

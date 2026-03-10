import { useCallback, useMemo, useState } from "react";
import { useController } from "react-hook-form";
import { Pressable, StyleSheet, Text } from "react-native";
import { AppTextInput } from "@/shared/components/app-text-input";
import { colors } from "@/shared/theme/colors";

function PasswordToggle({
	onPress,
	label,
}: {
	onPress: () => void;
	label: string;
}) {
	return (
		<Pressable
			testID="password-toggle"
			accessibilityRole="button"
			accessibilityLabel={`${label} password`}
			accessibilityHint="Toggle password visibility"
			style={styles.passwordToggleButton}
			onPress={onPress}
		>
			<Text style={styles.passwordToggleText}>{label}</Text>
		</Pressable>
	);
}

export function PasswordInput({
	textContentType,
}: {
	textContentType: "password" | "newPassword";
}) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const {
		field: passwordField,
		fieldState: { error },
	} = useController<{ password: string }>({
		name: "password",
	});

	const handleToggle = useCallback(() => {
		setIsPasswordVisible((prev) => !prev);
	}, []);

	const rightAdornment = useMemo(
		() => (
			<PasswordToggle
				onPress={handleToggle}
				label={isPasswordVisible ? "Hide" : "Show"}
			/>
		),
		[handleToggle, isPasswordVisible],
	);

	return (
		<AppTextInput
			secureTextEntry={!isPasswordVisible}
			testID="password-input"
			label="Password"
			textContentType={textContentType}
			value={passwordField.value}
			onChangeText={passwordField.onChange}
			onBlur={passwordField.onBlur}
			rightAdornment={rightAdornment}
			errorMessage={error?.message}
		/>
	);
}

const styles = StyleSheet.create({
	passwordToggleButton: {
		alignItems: "center",
		justifyContent: "center",
		minHeight: 36,
		minWidth: 48,
		paddingHorizontal: 4,
	},
	passwordToggleText: {
		color: colors.primary,
		fontSize: 13,
		fontWeight: "600",
	},
});

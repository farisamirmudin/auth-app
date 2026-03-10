import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useController } from "react-hook-form";
import { Pressable, StyleSheet } from "react-native";
import { AppTextInput } from "@/shared/components/app-text-input";
import { colors } from "@/shared/theme/colors";

function PasswordToggle({
	onPress,
	isVisible,
}: {
	onPress: () => void;
	isVisible: boolean;
}) {
	return (
		<Pressable
			testID="password-toggle"
			accessibilityRole="button"
			accessibilityLabel={isVisible ? "Hide password" : "Show password"}
			style={styles.passwordToggleButton}
			onPress={onPress}
		>
			<Ionicons
				name={isVisible ? "eye-off-outline" : "eye-outline"}
				size={20}
				color={colors.textMuted}
			/>
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

	const handleToggle = () => {
		setIsPasswordVisible((prev) => !prev);
	};

	const rightAdornment = (
		<PasswordToggle onPress={handleToggle} isVisible={isPasswordVisible} />
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
});

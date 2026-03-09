import { useCallback, useMemo, useState } from "react";
import { useController } from "react-hook-form";
import type { TextInputProps } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { AppTextInput } from "@/shared/components/app-text-input";
import { colors } from "@/shared/theme/colors";

const BULLET = "\u2022";

function PasswordToggle({
	onPress,
	label,
}: {
	onPress: () => void;
	label: string;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel="Toggle password visibility"
			style={styles.passwordToggleButton}
			onPress={onPress}
		>
			<Text style={styles.passwordToggleText}>{label}</Text>
		</Pressable>
	);
}

export function PasswordInput() {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const {
		field: passwordField,
		fieldState: { error },
	} = useController({
		name: "password",
	});

	const password = passwordField.value ?? "";

	const handleToggle = useCallback(() => {
		setIsPasswordVisible((prev) => !prev);
	}, []);

	const handleChangeText = useCallback(
		(text: string) => {
			const realPart = text.replace(/\u2022/g, "");
			if (realPart.length > 0) {
				const bulletCount = text.length - realPart.length;
				passwordField.onChange(password.slice(0, bulletCount) + realPart);
				return;
			}
			if (text.length < password.length) {
				passwordField.onChange(password.slice(0, text.length));
			}
		},
		[password, passwordField],
	);

	const handleKeyPress = useCallback(
		(e: Parameters<NonNullable<TextInputProps["onKeyPress"]>>[0]) => {
			const key = e.nativeEvent.key;
			if (key === "Backspace") {
				passwordField.onChange(password.slice(0, -1));
			} else if (key.length === 1) {
				passwordField.onChange(password + key);
			}
		},
		[password, passwordField],
	);

	const displayValue = isPasswordVisible
		? password
		: BULLET.repeat(password.length);
	const handleTextChange = isPasswordVisible
		? passwordField.onChange
		: handleChangeText;
	const handleKeyPressProp = isPasswordVisible ? undefined : handleKeyPress;

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
			label="Password"
			textContentType="password"
			// secureTextEntry={!isPasswordVisible} UI fps drops from 60 to 30 https://github.com/facebook/react-native/issues/28911
			value={displayValue}
			onChangeText={handleTextChange}
			onKeyPress={handleKeyPressProp}
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

import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	type TextInputProps,
	View,
} from "react-native";
import { colors } from "@/shared/theme/colors";

type AppTextInputProps = {
	label: string;
	errorMessage?: string;
	rightAdornment?: ReactNode;
} & Omit<TextInputProps, "style">;

export function AppTextInput({
	label,
	errorMessage,
	rightAdornment,
	onFocus,
	onBlur,
	...textInputProps
}: AppTextInputProps) {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = useCallback(
		(event: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
			setIsFocused(true);
			onFocus?.(event);
		},
		[onFocus],
	);

	const handleBlur = useCallback(
		(event: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) => {
			setIsFocused(false);
			onBlur?.(event);
		},
		[onBlur],
	);

	const inputContainerStyle = useMemo(
		() => [
			styles.inputContainer,
			isFocused ? styles.inputContainerFocused : null,
			errorMessage ? styles.inputContainerError : null,
		],
		[errorMessage, isFocused],
	);

	return (
		<View style={styles.fieldContainer}>
			<Text style={styles.label}>{label}</Text>
			<View style={inputContainerStyle}>
				<TextInput
					{...textInputProps}
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholderTextColor={colors.textMuted}
				/>
				{rightAdornment}
			</View>
			{errorMessage ? (
				<Text style={styles.errorText}>{errorMessage}</Text>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	fieldContainer: {
		gap: 6,
		width: "100%",
	},
	label: {
		color: colors.text,
		fontSize: 14,
		fontWeight: "600",
	},
	inputContainer: {
		alignItems: "center",
		backgroundColor: colors.inputBg,
		borderColor: colors.border,
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: "row",
		minHeight: 52,
		paddingHorizontal: 16,
	},
	inputContainerFocused: {
		borderColor: colors.borderFocus,
		borderWidth: 2,
	},
	inputContainerError: {
		borderColor: colors.error,
	},
	input: {
		color: colors.text,
		flex: 1,
		fontSize: 16,
		minHeight: 50,
		paddingVertical: 12,
	},
	errorText: {
		color: colors.error,
		fontSize: 12,
	},
});

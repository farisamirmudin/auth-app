import { useController } from "react-hook-form";
import { AppTextInput } from "@/shared/components/app-text-input";

export function EmailInput() {
	const {
		field: emailField,
		fieldState: { error },
	} = useController({
		name: "email",
	});

	return (
		<AppTextInput
			testID="email-input"
			label="Email"
			textContentType="emailAddress"
			keyboardType="email-address"
			value={emailField.value ?? ""}
			onChangeText={emailField.onChange}
			onBlur={emailField.onBlur}
			errorMessage={error?.message}
		/>
	);
}

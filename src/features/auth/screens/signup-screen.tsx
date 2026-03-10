import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { FormProvider, useController, useForm } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import { EmailInput } from "@/features/auth/components/email-input";
import { Layout } from "@/features/auth/components/layout";
import { PasswordInput } from "@/features/auth/components/password-input";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
	type SignupFormValues,
	signupSchema,
} from "@/features/auth/validation/auth";
import type { AuthStackParamList } from "@/navigation/types";
import { AppButton } from "@/shared/components/app-button";
import { AppTextInput } from "@/shared/components/app-text-input";
import { colors } from "@/shared/theme/colors";

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, "signup">;

export function SignupScreen({ navigation }: SignupScreenProps) {
	const { signup, authError, clearAuthError, isLoading } = useAuth();

	const methods = useForm<SignupFormValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		resolver: zodResolver(signupSchema),
	});

	const { handleSubmit } = methods;

	const {
		field: nameField,
		fieldState: { error },
	} = useController({
		control: methods.control,
		name: "name",
	});

	const handleNavigateToLogin = useCallback(() => {
		clearAuthError();
		navigation.replace("login");
	}, [clearAuthError, navigation]);

	const signupButtonLabel = useMemo(
		() => (isLoading ? "Signing up..." : "Signup"),
		[isLoading],
	);
	const onSubmit = useCallback(
		async (values: SignupFormValues) => {
			clearAuthError();
			await signup(values);
		},
		[clearAuthError, signup],
	);

	return (
		<Layout title="Signup" description="Create your account to get started.">
			<FormProvider {...methods}>
				<AppTextInput
					testID="name-input"
					label="Name"
					textContentType="name"
					value={nameField.value ?? ""}
					onChangeText={nameField.onChange}
					onBlur={nameField.onBlur}
					errorMessage={error?.message}
				/>
				<EmailInput />
				<PasswordInput textContentType="newPassword" />

				{authError ? (
					<Text style={styles.authErrorText}>{authError}</Text>
				) : null}

				<AppButton
					testID="signup-button"
					onPress={handleSubmit(onSubmit)}
					isLoading={isLoading}
					label={signupButtonLabel}
					variant="primary"
				/>
				<AppButton
					testID="goto-login-button"
					onPress={handleNavigateToLogin}
					isLoading={isLoading}
					label="Go to Login"
					variant="link"
				/>
			</FormProvider>
		</Layout>
	);
}

const styles = StyleSheet.create({
	authErrorText: {
		color: colors.error,
		fontSize: 13,
	},
});

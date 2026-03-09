import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import { EmailInput } from "@/features/auth/components/email-input";
import { Layout } from "@/features/auth/components/layout";
import { PasswordInput } from "@/features/auth/components/password-input";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
	type LoginFormValues,
	loginSchema,
} from "@/features/auth/validation/auth";
import type { AuthStackParamList } from "@/navigation/types";
import { colors } from "@/shared/theme/colors";
import { Button } from "../components/button";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "login">;

export function LoginScreen({ navigation }: LoginScreenProps) {
	const { login, authError, clearAuthError, isLoading } = useAuth();

	const methods = useForm<LoginFormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginSchema),
	});

	const { handleSubmit } = methods;

	const handleNavigateToSignup = useCallback(() => {
		clearAuthError();
		navigation.replace("signup");
	}, [clearAuthError, navigation]);

	const loginButtonLabel = useMemo(
		() => (isLoading ? "Logging in..." : "Login"),
		[isLoading],
	);
	const onSubmit = useCallback(
		async (values: LoginFormValues) => {
			clearAuthError();
			await login(values);
		},
		[clearAuthError, login],
	);

	return (
		<Layout
			title="Login"
			description="Welcome back. Sign in to continue your flow."
		>
			<FormProvider {...methods}>
				<EmailInput />
				<PasswordInput />

				{authError ? (
					<Text style={styles.authErrorText}>{authError}</Text>
				) : null}

				<Button
					onPress={handleSubmit(onSubmit)}
					isLoading={isLoading}
					label={loginButtonLabel}
					variant="primary"
				/>
				<Button
					onPress={handleNavigateToSignup}
					isLoading={isLoading}
					label="Go to Signup"
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

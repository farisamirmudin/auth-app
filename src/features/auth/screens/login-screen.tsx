import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
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
import { AppButton } from "@/shared/components/app-button";
import { colors } from "@/shared/theme/colors";

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

	const handleNavigateToSignup = () => {
		clearAuthError();
		navigation.replace("signup");
	};

	const onSubmit = async (values: LoginFormValues) => {
		clearAuthError();
		// should have called a useMutation hook here, but requirement says
		// to "triggers the login function from the AuthContext."
		await login(values);
	};

	return (
		<Layout
			title="Login"
			description="Welcome back. Sign in to continue your flow."
		>
			<FormProvider {...methods}>
				<EmailInput />
				<PasswordInput textContentType="password" />

				{authError ? (
					<Text style={styles.authErrorText}>{authError}</Text>
				) : null}

				<AppButton
					testID="login-button"
					onPress={handleSubmit(onSubmit)}
					isLoading={isLoading}
					label="Login"
					variant="primary"
				/>
				<AppButton
					testID="goto-signup-button"
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

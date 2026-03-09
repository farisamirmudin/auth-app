import { useMutation } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { authStorageService } from "@/features/auth/services/auth-storage-service";
import type { AuthContextValue, User } from "@/features/auth/types";
import type {
	LoginFormValues,
	SignupFormValues,
} from "@/features/auth/validation/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(
	undefined,
);

export function AuthProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<User | null>(null);
	const [authError, setAuthError] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	const loginMutation = useMutation({
		mutationFn: authStorageService.login,
	});

	const signupMutation = useMutation({
		mutationFn: authStorageService.signup,
	});

	const logoutMutation = useMutation({
		mutationFn: authStorageService.logout,
	});

	const clearAuthError = useCallback(() => {
		setAuthError(null);
	}, []);

	const login = useCallback(
		async (payload: LoginFormValues) => {
			setAuthError(null);
			const loginResult = await loginMutation.mutateAsync(payload);

			if (!loginResult.ok) {
				setAuthError(loginResult.error);
				return;
			}

			setUser(loginResult.value);
		},
		[loginMutation],
	);

	const signup = useCallback(
		async (payload: SignupFormValues) => {
			setAuthError(null);
			const signupResult = await signupMutation.mutateAsync(payload);

			if (!signupResult.ok) {
				setAuthError(signupResult.error);
				return;
			}

			setUser(signupResult.value);
		},
		[signupMutation],
	);

	const logout = useCallback(async () => {
		setAuthError(null);
		const logoutResult = await logoutMutation.mutateAsync();

		if (!logoutResult.ok) {
			setAuthError(logoutResult.error);
			return;
		}

		setUser(null);
	}, [logoutMutation]);

	useEffect(() => {
		let isMounted = true;

		const restoreSession = async () => {
			const restoreSessionResult = await authStorageService.restoreSession();

			if (!isMounted) {
				return;
			}

			if (!restoreSessionResult.ok) {
				setUser(null);
				setIsInitializing(false);
				return;
			}

			setUser(restoreSessionResult.value);
			setIsInitializing(false);
		};

		restoreSession();

		return () => {
			isMounted = false;
		};
	}, []);

	const isLoading =
		loginMutation.isPending ||
		signupMutation.isPending ||
		logoutMutation.isPending;

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isAuthenticated: user !== null,
			isInitializing,
			isLoading,
			authError,
			login,
			signup,
			logout,
			clearAuthError,
		}),
		[
			authError,
			clearAuthError,
			isInitializing,
			isLoading,
			login,
			logout,
			signup,
			user,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

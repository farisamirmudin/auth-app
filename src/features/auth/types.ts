import type {
	LoginFormValues,
	SignupFormValues,
} from "@/features/auth/validation/auth";
import type { Result } from "@/shared/utils/result";

export type User = {
	name: string;
	email: string;
};

export type StoredUser = {
	email: string;
	name: string;
	password: string;
};

export type AuthResult<T> = Result<T, string>;

export type AuthContextValue = {
	user: User | null;
	isAuthenticated: boolean;
	isInitializing: boolean;
	isLoading: boolean;
	authError: string | null;
	login: (payload: LoginFormValues) => Promise<void>;
	signup: (payload: SignupFormValues) => Promise<void>;
	logout: () => Promise<void>;
	clearAuthError: () => void;
};

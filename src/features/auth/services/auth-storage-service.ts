import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthResult, StoredUser, User } from "@/features/auth/types";
import type {
	LoginFormValues,
	SignupFormValues,
} from "@/features/auth/validation/auth";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { result } from "@/shared/utils/result";

const SESSION_EMAIL_KEY = "auth:session-email";
const USER_KEY_PREFIX = "auth:user:";

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

function getUserKey(email: string): string {
	return `${USER_KEY_PREFIX}${normalizeEmail(email)}`;
}

async function toStoredUser(payload: SignupFormValues): Promise<StoredUser> {
	return {
		name: payload.name.trim(),
		email: normalizeEmail(payload.email),
		password: await hashPassword(payload.password),
	};
}

function toUser(storedUser: StoredUser): User {
	return {
		name: storedUser.name,
		email: storedUser.email,
	};
}

function parseStoredUser(serializedUser: string): StoredUser | null {
	try {
		const parsed = JSON.parse(serializedUser) as Partial<StoredUser>;

		return {
			name: parsed.name ?? "",
			email: parsed.email ?? "",
			password: parsed.password ?? "",
		};
	} catch {
		return null;
	}
}

export const authStorageService = {
	async signup(payload: SignupFormValues): Promise<AuthResult<User>> {
		try {
			const normalizedEmail = normalizeEmail(payload.email);
			const userKey = getUserKey(normalizedEmail);
			const existingUser = await AsyncStorage.getItem(userKey);

			if (existingUser) {
				return result.err("Email is already registered.");
			}

			const nextStoredUser = await toStoredUser(payload);

			await AsyncStorage.setItem(userKey, JSON.stringify(nextStoredUser));
			await AsyncStorage.setItem(SESSION_EMAIL_KEY, normalizedEmail);

			return result.ok(toUser(nextStoredUser));
		} catch (error: unknown) {
			console.error("Error signing up", error);
			return result.err("Something went wrong. Please try again.");
		}
	},

	async login(payload: LoginFormValues): Promise<AuthResult<User>> {
		try {
			const normalizedEmail = normalizeEmail(payload.email);
			const userKey = getUserKey(normalizedEmail);
			const serializedUser = await AsyncStorage.getItem(userKey);

			if (!serializedUser) {
				return result.err("Incorrect email or password.");
			}

			const storedUser = parseStoredUser(serializedUser);

			if (!storedUser) {
				return result.err("Incorrect email or password.");
			}

			const isPasswordValid = await verifyPassword(
				payload.password,
				storedUser.password,
			);

			if (!isPasswordValid) {
				return result.err("Incorrect email or password.");
			}

			await AsyncStorage.setItem(SESSION_EMAIL_KEY, normalizedEmail);

			return result.ok(toUser(storedUser));
		} catch (error: unknown) {
			console.error("Error logging in", error);
			return result.err("Something went wrong. Please try again.");
		}
	},

	async logout(): Promise<AuthResult<null>> {
		try {
			await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
			return result.ok(null);
		} catch (error: unknown) {
			console.error("Error logging out", error);
			return result.err("Something went wrong. Please try again.");
		}
	},

	async restoreSession(): Promise<AuthResult<User | null>> {
		try {
			const sessionEmail = await AsyncStorage.getItem(SESSION_EMAIL_KEY);

			if (!sessionEmail) {
				return result.ok(null);
			}

			const normalizedEmail = normalizeEmail(sessionEmail);
			const userKey = getUserKey(normalizedEmail);
			const serializedUser = await AsyncStorage.getItem(userKey);

			if (!serializedUser) {
				await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
				return result.ok(null);
			}

			const storedUser = parseStoredUser(serializedUser);

			if (!storedUser) {
				await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
				await AsyncStorage.removeItem(userKey);
				return result.ok(null);
			}

			return result.ok(toUser(storedUser));
		} catch (error: unknown) {
			console.error("Error restoring session", error);
			return result.err("Failed to restore session. Please login again.");
		}
	},
};

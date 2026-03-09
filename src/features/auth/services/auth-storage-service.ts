import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthResult, StoredUser, User } from "@/features/auth/types";
import type {
	LoginFormValues,
	SignupFormValues,
} from "@/features/auth/validation/auth";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { tryCatch, tryCatchSync } from "@/shared/utils/result";

const SESSION_EMAIL_KEY = "auth:session-email";
const USER_KEY_PREFIX = "auth:user:";

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

function getUserKey(email: string): string {
	return `${USER_KEY_PREFIX}${normalizeEmail(email)}`;
}

function toUser(storedUser: StoredUser): User {
	return {
		name: storedUser.name,
		email: storedUser.email,
	};
}

function parseStoredUser(serializedUser: string): AuthResult<StoredUser> {
	return tryCatchSync(
		() => {
			const parsed = JSON.parse(serializedUser) as Partial<StoredUser>;

			return {
				name: parsed.name ?? "",
				email: parsed.email ?? "",
				password: parsed.password ?? "",
			};
		},
		() => "Incorrect email or password.",
	);
}

export const authStorageService = {
	async signup(payload: SignupFormValues): Promise<AuthResult<User>> {
		return tryCatch(
			async () => {
				const normalizedEmail = normalizeEmail(payload.email);
				const userKey = getUserKey(normalizedEmail);
				const existingUser = await AsyncStorage.getItem(userKey);

				if (existingUser) {
					throw new Error("Email is already registered.");
				}

				const hashResult = await hashPassword(payload.password);

				if (!hashResult.ok) {
					throw new Error(hashResult.error);
				}

				const nextStoredUser: StoredUser = {
					name: payload.name.trim(),
					email: normalizedEmail,
					password: hashResult.value,
				};

				await AsyncStorage.setItem(userKey, JSON.stringify(nextStoredUser));
				await AsyncStorage.setItem(SESSION_EMAIL_KEY, normalizedEmail);

				return toUser(nextStoredUser);
			},
			(error) =>
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.",
		);
	},

	async login(payload: LoginFormValues): Promise<AuthResult<User>> {
		return tryCatch(
			async () => {
				const normalizedEmail = normalizeEmail(payload.email);
				const userKey = getUserKey(normalizedEmail);
				const serializedUser = await AsyncStorage.getItem(userKey);

				if (!serializedUser) {
					throw new Error("Incorrect email or password.");
				}

				const parseResult = parseStoredUser(serializedUser);

				if (!parseResult.ok) {
					throw new Error(parseResult.error);
				}

				const verifyResult = await verifyPassword(
					payload.password,
					parseResult.value.password,
				);

				if (!verifyResult.ok) {
					throw new Error(verifyResult.error);
				}

				if (!verifyResult.value) {
					throw new Error("Incorrect email or password.");
				}

				await AsyncStorage.setItem(SESSION_EMAIL_KEY, normalizedEmail);

				return toUser(parseResult.value);
			},
			(error) =>
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.",
		);
	},

	async logout(): Promise<AuthResult<null>> {
		return tryCatch(
			async () => {
				await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
				return null;
			},
			() => "Something went wrong. Please try again.",
		);
	},

	async restoreSession(): Promise<AuthResult<User | null>> {
		return tryCatch(
			async () => {
				const sessionEmail = await AsyncStorage.getItem(SESSION_EMAIL_KEY);

				if (!sessionEmail) {
					return null;
				}

				const normalizedEmail = normalizeEmail(sessionEmail);
				const userKey = getUserKey(normalizedEmail);
				const serializedUser = await AsyncStorage.getItem(userKey);

				if (!serializedUser) {
					await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
					return null;
				}

				const parseResult = parseStoredUser(serializedUser);

				if (!parseResult.ok) {
					await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
					await AsyncStorage.removeItem(userKey);
					return null;
				}

				return toUser(parseResult.value);
			},
			() => "Failed to restore session. Please login again.",
		);
	},
};

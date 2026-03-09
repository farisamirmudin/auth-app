import * as Crypto from "expo-crypto";
import type { Result } from "@/shared/utils/result";
import { tryCatch } from "@/shared/utils/result";

const SALT_BYTE_LENGTH = 16;

function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashWithSalt(password: string, salt: string): Promise<string> {
	const digest = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		salt + password,
	);
	return `${salt}$${digest}`;
}

export async function hashPassword(
	password: string,
): Promise<Result<string, string>> {
	return tryCatch(
		async () => {
			const saltBytes = Crypto.getRandomBytes(SALT_BYTE_LENGTH);
			const salt = bytesToHex(saltBytes);
			return hashWithSalt(password, salt);
		},
		() => "Failed to hash password.",
	);
}

export async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<Result<boolean, string>> {
	return tryCatch(
		async () => {
			const [salt] = storedHash.split("$");
			const hashedAttempt = await hashWithSalt(password, salt);
			return hashedAttempt === storedHash;
		},
		() => "Failed to verify password.",
	);
}

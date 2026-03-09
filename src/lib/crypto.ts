import * as Crypto from "expo-crypto";

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

export async function hashPassword(password: string): Promise<string> {
	const saltBytes = Crypto.getRandomBytes(SALT_BYTE_LENGTH);
	const salt = bytesToHex(saltBytes);
	return hashWithSalt(password, salt);
}

export async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<boolean> {
	const [salt] = storedHash.split("$");
	const hashedAttempt = await hashWithSalt(password, salt);
	return hashedAttempt === storedHash;
}

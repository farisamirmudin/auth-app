export type Ok<T> = {
	ok: true;
	value: T;
};

export type Err<E> = {
	ok: false;
	error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export const result = {
	ok<T>(value: T): Ok<T> {
		return {
			ok: true,
			value,
		};
	},

	err<E>(error: E): Err<E> {
		return {
			ok: false,
			error,
		};
	},
};

export async function tryCatch<T, E>(
	fn: () => Promise<T>,
	mapError: (error: unknown) => E,
): Promise<Result<T, E>> {
	try {
		return { ok: true, value: await fn() };
	} catch (error) {
		return { ok: false, error: mapError(error) };
	}
}

export function tryCatchSync<T, E>(
	fn: () => T,
	mapError: (error: unknown) => E,
): Result<T, E> {
	try {
		return { ok: true, value: fn() };
	} catch (error) {
		return { ok: false, error: mapError(error) };
	}
}

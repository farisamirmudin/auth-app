import { use } from "react";
import { AuthContext } from "@/features/auth/context/auth-context";
import type { AuthContextValue } from "@/features/auth/types";

export function useAuth(): AuthContextValue {
	const context = use(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return context;
}

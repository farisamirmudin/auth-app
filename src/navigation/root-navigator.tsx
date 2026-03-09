import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AppStack } from "@/navigation/app-stack";
import { AuthStack } from "@/navigation/auth-stack";

export function RootNavigator() {
	const { isAuthenticated, isInitializing } = useAuth();

	useEffect(() => {
		if (!isInitializing) {
			SplashScreen.hideAsync();
		}
	}, [isInitializing]);

	if (isInitializing) {
		return null;
	}

	return isAuthenticated ? <AppStack /> : <AuthStack />;
}

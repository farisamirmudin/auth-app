import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "@/navigation/root-navigator";
import { AppProviders } from "@/providers/app-providers";

SplashScreen.preventAutoHideAsync();

export function App() {
	return (
		<AppProviders>
			<StatusBar style="dark" />
			<NavigationContainer>
				<RootNavigator />
			</NavigationContainer>
		</AppProviders>
	);
}

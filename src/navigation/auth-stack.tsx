import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@/features/auth/screens/login-screen";
import { SignupScreen } from "@/features/auth/screens/signup-screen";
import type { AuthStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
	return (
		<Stack.Navigator
			initialRouteName="login"
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="login" component={LoginScreen} />
			<Stack.Screen name="signup" component={SignupScreen} />
		</Stack.Navigator>
	);
}

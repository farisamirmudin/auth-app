import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@/features/home/screens/home-screen";
import type { AppStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
	return (
		<Stack.Navigator
			initialRouteName="home"
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="home" component={HomeScreen} />
		</Stack.Navigator>
	);
}

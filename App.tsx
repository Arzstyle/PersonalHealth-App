import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { UIProvider } from './src/context/UIContext';
import { UserProfileProvider } from './src/context/UserProfileContext';



export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthProvider>
        <UserProfileProvider>
          <UIProvider>
            <AppNavigator />
          </UIProvider>
        </UserProfileProvider>
      </AuthProvider>
    </>
  );
}

import './global.css';
import React from 'react';
import { UserProvider } from './presentation/context/userContext';
import { RootNavigator } from './presentation/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
}

export default App;
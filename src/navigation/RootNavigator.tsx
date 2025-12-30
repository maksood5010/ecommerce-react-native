import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { linkingConfig } from './linking';

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer linking={linkingConfig}>
      <TabNavigator />
    </NavigationContainer>
  );
};


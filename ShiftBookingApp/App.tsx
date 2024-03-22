import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyShiftsScreen from './source/MyShiftsScreen';
import AvailableShiftsScreen from './source/AvailableShiftsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 20 },
          tabBarShowLabel: true, 
        }}
      >
        <Tab.Screen name="MyShifts" component={MyShiftsScreen} options={{ title: 'My Shifts' }} />
        <Tab.Screen name="AvailableShifts" component={AvailableShiftsScreen} options={{ title: 'Available Shifts' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

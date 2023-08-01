import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { IconButton, } from 'react-native-paper';

import ExpenseList from '../screens/ExpenseList';
import ExpenseForm from '../screens/ExpenseForm';
import LoginScreen from '../screens/Login';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

const AppNavigator = () => {

  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          !isLoggedIn && <>
            <Stack.Screen name="Login" component={LoginScreen} options={{
              headerShown: false
            }} />
          </>
        }
        {
          isLoggedIn && <>
            <Stack.Screen
              name="Expense List" component={ExpenseList}
              options={({ navigation }) => ({
                title: 'Expense Tracker',
                headerLeft: () => (
                  <IconButton
                    icon='logout'
                    color="black"
                    size={24}
                    style={{ transform: [{ scaleX: -1 }] }}
                    onPress={() => dispatch({ type: 'user/logout' })}
                  />
                ),
                headerRight: () => (
                  <IconButton
                    icon='plus'
                    color="black"
                    size={24}
                    onPress={() => navigation.navigate('Add Expense')}
                  />
                ),
              })}
            />
            <Stack.Screen name="Add Expense" component={ExpenseForm} />
            <Stack.Screen name="Edit Expense" component={ExpenseForm} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

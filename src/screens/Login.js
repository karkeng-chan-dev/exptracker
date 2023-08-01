// src/screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

const LoginScreen = () => {
  const [username, setUsername] = useState('Tester');
  const [password, setPassword] = useState('test');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'user/checkToken' });
  }, []);

  const loginError = useSelector((state) => state.user.authError);

  const handleLogin = () => {
    dispatch({ type: 'user/login', payload: { username, password } });
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="currency-usd"
        size={64}
        onPress={() => { }}
      />
      <Text style={styles.title}>Expense Tracker</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode='outlined'
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode='outlined'
      />
      {loginError && <Text style={styles.errorText}>{loginError}</Text>}
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 4,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;

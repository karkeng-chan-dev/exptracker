import React, { useEffect, useState } from 'react';
import { View, Text, } from 'react-native';
import { Button, TextInput as PaperTextInput, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { resetUpsertError } from '../redux/expenseSlice';

const ExpenseForm = (props) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [id, setId] = useState(null); // for editing expense
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const expenseData = props.route?.params?.expenseData;
    if (expenseData) {
      const { id, amount, name, } = JSON.parse(expenseData);
      setId(id);
      setAmount((amount || 0).toFixed(2));
      setName(name);
    }
  }, [props.route?.params?.expenseData]);


  // error handling
  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');

  const upsertSuccess = useSelector((state) => state.expenses.upsertSuccess);
  const upsertError = useSelector((state) => state.expenses.upsertError);
  useEffect(() => {
    if (upsertSuccess || upsertError) {
      setIsLoading(false);
      
      if (upsertSuccess) {
        if (!id) resetForm();
        setTimeout(() => {
          dispatch({ type: 'expenses/resetUpsertSuccess' });
          props.navigation.goBack();
        }, 1000);
      }
    } 
  }, [upsertSuccess, upsertError, id]);

  const dispatch = useDispatch();

  const isFormInvalid = () => {
    if (!name) {
      setNameError('Name is required');
      return true
    } else {
      setNameError('');
    }

    if (!amount) {
      setAmountError('Amount is required');
      return true
    } else if (isNaN(amount)) {
      setAmountError('Amount must be a number');
      return true
    } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      setAmountError('Amount must be 2 decimal places or less');
      return true
    } else {
      setAmountError('');
    }
  }

  const resetForm = () => {
    setName('');
    setAmount('');
    setId(null);
  }

  const handleSubmit = () => {
    if (isFormInvalid()) {
      __DEV__ && console.log('form is invalid');
      return;
    }

    dispatch(resetUpsertError());
    setIsLoading(true);
    const formValues = {
      name,
      amount: parseFloat(amount),
    };
    
    if (id) {
      dispatch({ type: 'expenses/updateExpense', payload: { id, ...formValues } });
    } else {
      dispatch({ type: 'expenses/addExpense', payload: formValues });
    }
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ paddingHorizontal: 16, flex: 1, flexGrow: 1 }}>
      <>
        <PaperTextInput
          label="Expense Name"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 16 }}
          mode='outlined'
          error={nameError}
          disabled={isLoading}
        />
        <PaperTextInput
          label="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{ marginBottom: 16 }}
          mode='outlined'
          error={amountError}
          disabled={isLoading}
        />
      </>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 16, alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 16 }}>
          {nameError || amountError || upsertError || ""}
        </Text>
        <Button
          disabled={isLoading}
          style={{ width: '100%' }}
          mode="contained"
          onPress={handleSubmit}
        >
          {
            !!id ? 'Update Expense' : 'Add Expense'
          }
        </Button>
        <Snackbar
          style={{ marginBottom: 32 }}
          visible={upsertSuccess}
        >
          {
            !!id ? 'Expense edited successfully' : 'Expense added successfully'
          }
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export default ExpenseForm;

import React, { useEffect } from 'react';
import { View, Text, Alert, SectionList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button, IconButton, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { removeExpense } from '../redux/expenseSlice';

const ExpenseList = () => {
  const expenses = useSelector((state) => state.expenses.expenses);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleEditExpense = (expenseData) => {
    navigation.navigate('Edit Expense', { expenseData });
  };

  const handleRemoveExpense = (expenseId) => {
    // add confirmation alert here
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => dispatch(removeExpense(expenseId)),
        },
      ],
    );
  };

  // fetch expense list from server on mount
  useEffect(() => {
    dispatch({ type: 'expenses/fetchExpenses' });
  }, []);

  const renderItem = ({ item }) => (
    <List.Item
      key={item.id}
      title={item.name}
      description={`$${item.amount?.toFixed(2)}`}
      left={() => (
        <IconButton
          icon="pencil-outline"
          onPress={() => handleEditExpense(JSON.stringify(item))}
        />
      )}
      right={() => (
        <IconButton
          icon="delete-outline"
          iconColor='red'
          onPress={() => handleRemoveExpense(item.id)}
        />
      )}
    />
  );

  // group expenses by date, display date as section header
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.createdAt);
    const dateKey = moment(date).format('DD/MM/YYYY');

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(expense);

    return acc;
  }, {});
  
  const renderSectionHeader = ({ section }) => {
    const rawDateMoment = moment(section.title, 'DD/MM/YYYY');
    let dateDisplay = section.title;

    // if date is today, display 'Today' instead of date
    if (rawDateMoment.isSame(moment(), 'day')) {
      dateDisplay = 'Today';
    } else if (rawDateMoment.isSame(moment().subtract(1, 'day'), 'day')) {
      // if date is yesterday, display 'Yesterday' instead of date
      dateDisplay = 'Yesterday';
    }

    return (
      <List.Subheader
        style={{
          backgroundColor: '#F0F0F0',
          paddingVertical: 8,
          borderTopColor: 'black',
          borderTopWidth: 1,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >{dateDisplay}
        </Text>
      </List.Subheader>
    )
  };

  // convert groupedExpenses object to array
  const groupedExpensesArray = Object.keys(groupedExpenses).map((date) => ({
    title: date,
    data: groupedExpenses[date]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Display total expense */}
      <View
        style={{
          justifyContent: 'space-between',
          padding: 16,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}
      >
        <Text>Total Expense:</Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          ${expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
        </Text>
      </View>

      {expenses.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            icon="currency-usd"
            size={64}
            onPress={() => { }}
          />
          <Text style={{ fontSize: 24 }}>No Expenses</Text>
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={() => { 
              navigation.navigate('Add Expense');
            }}
          >
            Add Expense
          </Button>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={{ paddingBottom: 24 }}
          sections={groupedExpensesArray}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
          renderSectionHeader={renderSectionHeader}
        />
      )}
    </View>
  );
};

export default ExpenseList;

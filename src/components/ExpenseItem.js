import React from 'react';
import { IconButton, List } from 'react-native-paper';

export default ExpenseItem = ({ 
    item,
    onPressEdit,
    onPressDelete,
}) => {
    return (
        <List.Item
            key={item.id}
            title={item.name}
            description={`$${item.amount?.toFixed(2)}`}
            left={() => (
                <IconButton
                    icon="pencil-outline"
                    onPress={onPressEdit}
                />
            )}
            right={() => (
                <IconButton
                    icon="delete-outline"
                    iconColor='red'
                    onPress={onPressDelete}
                />
            )}
        />
    );
}


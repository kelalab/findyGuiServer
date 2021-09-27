import React from 'react';
import { FlatList } from 'react-native';
import Customer from './Customer';
import styled from 'styled-components/native/dist/styled-components.native.esm';

const ListView = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: white;
`;

const notArchived = item => !item.archived;

const CustomerList = props => {
  const { customers, showArchived, balances, therapistId, navigation } = props;

  const renderItem = ({ item }) => (
    <Customer
      customer={item.customer}
      balance={item.balance}
      therapistId={therapistId}
      navigation={navigation}
      //onPress={() => onPress(item.customer, item.balance)}
    />
  );

  const combineBalance = _customers => {
    console.log('customers:', _customers);
    //console.log('balances:',balances);
    const data = [];
    if (_customers.status !== 'error') {
      _customers.forEach(customer => {
        const item = {
          customer: customer,
          balance: balances.find(b => b.clientId === customer.id),
        };
        data.push(item);
      });
    }
    console.log('customerData', data);
    return data;
  };

  console.log('SHOWARCHIVED', showArchived);
  let customerList = [];
  if (customers && customers.length > 0) {
    customerList = showArchived
      ? combineBalance(customers)
      : combineBalance(customers.filter(notArchived));
  }
  return (
    <ListView>
      <FlatList
        data={customerList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </ListView>
  );
};

export default CustomerList;

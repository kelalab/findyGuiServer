import React from 'react';
import { View } from 'react-native';
import CustomerTitle from './CustomerTitle';
import CustomerList from './CustomerList';
import { PaymentButton } from './Components';
import styled from 'styled-components/native';
import { useQuery } from 'react-query';
import { getAllAppointments } from '../../util/api';

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;

//const isNew = (n) => n.state !== 'old';

export default ({
  clients,
  showArchived,
  navigation,
  balances,
  therapistId,
  appData,
}) => {
  const getAppointments = async () => {
    let responseData = [];
    console.log('geAtps clients', clients);
    for (const client of clients) {
      console.log('CLIENT', client);
      const decision = client.decisionId;
      const appointmentData = await getAllAppointments(
        client.id,
        therapistId,
        decision,
      );
      responseData = [...responseData, ...appointmentData.payments];
    }
    console.log('resposeData', responseData);
    return responseData;
  };

  const { status, data } = useQuery('monthsAppointments', getAppointments);
  let newAppointments = 0;
  if (data) {
    for (const apt of data) {
      newAppointments += apt.therapySession.sessionCount;
    }
  }
  return (
    <Container>
      <View>
        <CustomerTitle />
        <CustomerList
          customers={clients}
          balances={balances}
          therapistId={therapistId}
          showArchived={showArchived}
          navigation={navigation}
        />
      </View>
      <PaymentButton amount={newAppointments} />
    </Container>
  );
};

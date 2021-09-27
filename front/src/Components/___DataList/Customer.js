import React from 'react';
import { TouchableHighlight } from 'react-native';
import { ActionsBullet, CustomerContainer, Name } from './Components';
import TextBullet from '../TextBullet';
import { GRAY_45 } from '../../Config';
import { useQuery } from 'react-query';
import { doGet, getAllAppointmentsUrl, queryParams } from '../../util/api';
import Customer from '../ListItem';

export default props => {
  const { customer, balance, decisionId, therapistId } = props;
  const { firstName, lastName, newActions, archived, id } = customer;

  const getAppointments = async () => {
    const params = {
      clientId: id,
      therapistId: therapistId,
      decisionId: customer.decisionId,
    };
    const _url = getAllAppointmentsUrl() + '?' + queryParams(params);
    console.log(_url);
    const response = await doGet(_url);
    const json = response.json();
    console.log('HOXXXXXXX', json);
    return json;
  };

  const { status, data } = useQuery(
    `appointment-${customer.id}`,
    getAppointments,
  );

  const onPress = (customer, balance, appointments) => {
    props.navigation.navigate('CustomerView', {
      Customer: customer,
      Balance: balance,
      Appointments: appointments,
    });
  };

  if (status === 'loading') {
    return null;
  }
  let count = 0;
  data.payments.forEach(payment => {
    count += payment.therapySession.sessionCount;
  });
  console.log(count);
  const appointments = count;
  //const appointments = data.payments.length;
  customer.appointments = appointments;
  const color = archived ? GRAY_45 : 'black';
  console.log(appointments);
  return (
    <Customer
      onPress={() => onPress(customer, balance, appointments)}
      customer={customer}
      appointments={appointments}
    />
  );
};

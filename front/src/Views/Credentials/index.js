import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { BASEURL, GRAY_3 } from '../../Config';
import DataList from '../../Components/DataList';
import ListItem from '../../Components/ListItem';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../credentialsSlice';

const CredentialsView = styled.SafeAreaView`
  background-color: ${GRAY_3};
`;

const Wallet = () => {
  //const [credentials, setCredentials] = useState([]);
  const credentials = useSelector(state => {
    console.log('state', state);
    return state.credentials.credentials;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const getProofs = async () => {
      const proofs = await fetch(`${BASEURL}/proofs`, {
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      });
      const data = await proofs.json();
      console.log('proofs', data);
      //setCredentials(data);
      dispatch(setCredentials(data));
    };
    getProofs();
  }, [dispatch]);
  return (
    <CredentialsView>
      {/*<Text>{JSON.stringify(credentials)}</Text>*/}
      <DataList data={credentials} renderItem={ListItem} sections />
    </CredentialsView>
  );
};

export default Wallet;

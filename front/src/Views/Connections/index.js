import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import DataList from '../../Components/DataList';
import ListItem from '../../Components/ListItem';
import { BASEURL } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { setConnections, updateConnection } from '../../connectionSlice';
import SocketUtil from '../../util/socketutil';
import Card from '../../Components/Card';
import ConnectionRequest from './ConnectionRequest';
import { H2 } from '../../Components/fonts';

const Connections = ({socket, navigation}) => {
    const [socketUtil, setsocketUtil] = useState(null);
    const [adding, setAdding] = useState(false);
    if (socket && !socketUtil) {
        setsocketUtil(SocketUtil(socket));
    }
    const connections = useSelector(state => {
        console.log('state connections', state.connections);
        return state.connections.connections;
    });
    const requests = useSelector(state => {
        return state.connections.requests;
    });
    console.log('conn reqs', requests);

    const sortedConnections = [...connections];
    sortedConnections.sort((first, second) => {
        if (first.otherParty < second.otherParty) {
            return -1;
        }
        if (first.otherParty > second.otherParty) {
            return 1;
        }
        return 0;
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const getConnections = async () => {
            const proofs = await fetch(`${BASEURL}/connections`, {
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
            });
            const data = await proofs.json();
            console.log('data', data);
            const test = await fetch(`${BASEURL}/hello`, {
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
            });
            console.log('test', test);
            //setConnections(data);
            if(test && data.length !== connections.length){
                dispatch(setConnections(data));
            }
        };
        getConnections();
    }, [dispatch]);

    const ConnectionItem = ({item, cards}) => {
        console.log('ITEM', item, 'CARDS', cards);
        let _item = { ...item };
        _item.title = item.otherParty;
        const onPress = (e, i) => {
            console.log('pressed connection item', i);
            i.expanded = !i.expanded;
            if (i.newItem) {
                socketUtil.markAsSeen(i);
            }
            dispatch(updateConnection(i));
        };
        if (cards){
            return  (
                <Card
                    onPress={e => onPress(e, _item)}
                    expanded={_item.expanded}
                    item={_item}
                />);
        }else {
            return (
                <ListItem
                    onPress={e => onPress(e, _item)}
                    expanded={_item.expanded}
                    item={_item}
                />
            )
        }
          
    };

    return (
        <View>
            <DataList cards data={sortedConnections} renderItem={props => <ConnectionItem {...props} cards/>} />
            <Button title="+" onPress={() => navigation.navigate('Add')}></Button>
        </View>
    );
};

export default Connections;

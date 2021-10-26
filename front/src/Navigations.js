import React from 'react';
import Payment from './img/Payment.svg';
import PaymentSelected from './img/PaymentSelected.svg';
import Clients from './img/Clients.svg';
import ClientsSelected from './img/ClientsSelected.svg';
import More from './img/More.svg';
import MoreSelected from './img/MoreSelected.svg';
import QrCode from './img/QrCode.svg';
import QrCodeSelected from './img/QrCodeSelected.svg';
import ChevronLeft from './img/ChevronLeft.svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PRIMARY_BLUE, PRIMARY_YELLOW } from './Config';
import Connections from './Views/Connections';
import Scan from './Views/Scan';
import Menu from './Views/Menu';
import Icon from './Components/Icon';
import { Platform } from 'react-native';
import Credentials from './Views/Credentials';
import { useSelector } from 'react-redux';
import ConnectionRequest from './Views/Connections/ConnectionRequest';
import Add from './Views/Connections/Add';

const Nav = createBottomTabNavigator();
const Stack = createStackNavigator();

const platformOptions = {
    height: Platform.OS === 'web' ? 40 : undefined,
};

const ConnectionStack = (socket) => {
    return (
        <Stack.Navigator 
            screenOptions={{
                presentation: 'modal',
                headerBackImage: (props) => {
                    return <Icon><ChevronLeft></ChevronLeft></Icon>
                }
            }}
        >
            <Stack.Screen name="Connections">
                {(props) => <Connections {...props} socket={socket} />}
            </Stack.Screen>
            <Stack.Screen name="Add">
                {(props) => <Add {...props} socket={socket} />}
            </Stack.Screen>
            {/*<Stack.Screen name="Yhteyspyyntö">
                {(props) => <ConnectionRequest {...props} socket={socket} />}
            </Stack.Screen>*/}
        </Stack.Navigator>
    );
}

const Navigations = ({socket}) => {
    const connections = useSelector(state => {
        return state.connections.connections;
    });
    const credentials = useSelector(state => {
        return state.credentials.credentials;
    });

    const newConnections = connections.filter(x => x.newItem);
    const newCredentials = credentials.filter(x => x.newItem);
    console.log('newConnections', newConnections);
    console.log('credentials', credentials);

    return (
        <Nav.Navigator
            initialRouteName="Yhteydet"
            screenOptions={{
                activeTintColor: PRIMARY_BLUE,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: PRIMARY_BLUE,
                    ...platformOptions,
                },
                headerTitleStyle: {
                    color: 'white',
                    fontSize: 14,
                },
                tabBarItemStyle: {
                    margin: 0,
                },
                tabBarLabelStyle: {
                    overflow: 'visible',
                    marginLeft: 0,
                },
                tabBarBadgeStyle: {
                    backgroundColor: PRIMARY_YELLOW,
                    height: 18,
                    fontSize: 12,
                    top: 1,
                },
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    borderBottomLeftRadius: Platform.OS === 'web' ? '3.5vh' : 0,
                    borderBottomRightRadius: Platform.OS === 'web' ? '3.5vh' : 0,
                },
            }}>
            <Nav.Screen
                name="Yhteydet"
                options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return focused ? (
                            <Icon>
                                <ClientsSelected />
                            </Icon>
                        ) : (
                            <Icon>
                                <Clients />
                            </Icon>
                        );
                    },
                    tabBarBadge: newConnections.length > 0 ? newConnections.length : null,
                }}>
                {(props) => <ConnectionStack {...props} socket={socket} />}
            </Nav.Screen>
            <Nav.Screen
                name="Todisteet"
                component={Credentials}
                options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return focused ? (
                            <Icon>
                                <PaymentSelected />
                            </Icon>
                        ) : (
                            <Icon>
                                <Payment />
                            </Icon>
                        );
                    },
                    tabBarBadge: newCredentials.length > 0 ? newCredentials.length : null,
                }}
            />
            <Nav.Screen
                name="Skannaa"
                component={Scan}
                options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return focused ? (
                            <Icon>
                                <QrCodeSelected />
                            </Icon>
                        ) : (
                            <Icon>
                                <QrCode />
                            </Icon>
                        );
                    },
                }}
            />
            <Nav.Screen
                name="Menu"
                component={Menu}
                options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return focused ? (
                            <Icon>
                                <MoreSelected />
                            </Icon>
                        ) : (
                            <Icon>
                                <More />
                            </Icon>
                        );
                    },
                }}
            />
        </Nav.Navigator>
    );
};

export default Navigations;

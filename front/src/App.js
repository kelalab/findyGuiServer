/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import type { Node } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Navigations from './Navigations';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useColorScheme } from 'react-native';
import { configureStore } from '@reduxjs/toolkit';
import connectionSlice from './connectionSlice';
import credentialsSlice from './credentialsSlice';
import Socket from './Components/Socket';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

const store = configureStore({
    reducer: {
        connections: connectionSlice,
        credentials: credentialsSlice,
    },
});

const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Provider store={store}>
                <Socket>
                    {socket => 
                        <QueryClientProvider client={queryClient}>
                            <NavigationContainer>
                                <Navigations socket={socket}/>
                            </NavigationContainer>
                        </QueryClientProvider>
                    }
                </Socket>
            </Provider>
        </GestureHandlerRootView>
    );
};

export default App;

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SOCKETBASE } from "../Config";
import { addRequest, updateConnection } from "../connectionSlice";

const Socket = ({ children }) => {
    const [state_socket,setsocket] = useState(null);
    const dispatch = useDispatch();
    //const state_socket = useSelector(state => state.socket.socket);
    //console.log('reduxed socket', state_socket);
    useEffect(() => {
        console.log('useEffect');
        const initSocket = async () => {
            console.log('initSocket');
            if (!state_socket) {
                console.log('no state socket');
                const socket = io(SOCKETBASE, data => {
                    console.log('socket', data);
                });
                if(!state_socket){
                    console.log('dispatching to redux');
                    //dispatch(setSocket(socket));
                    setsocket(socket);
                }
                socket.on('message', msg => {
                    console.log('message', msg);
                    try {
                        console.log('msgdata', msg.data);
                        if(msg.type==='update'){
                            const updateobj = msg.data;
                            if(updateobj.obj === 'Connection'){
                                console.log('received update', updateobj);
                                dispatch(updateConnection(updateobj.data));
                            }
                        }else if(msg.type==='new'){
                            console.log('SOMETHING NEW');
                            const newobj = msg.data;
                            if(newobj.obj === 'Connection'){
                                console.log('new connection request', newobj);
                                dispatch(addRequest(newobj.data));
                            }
                        }
                    } catch (e) {
                        console.log(e);
                        //do nothing
                    }
                });
            }
        };
        initSocket();
        return () => {
            if (state_socket) {
                console.log('closing socket', state_socket);
                state_socket.close();
            }
            //dispatch(removeSocket());
        };
    }, []);
    return <View style={{ flexGrow: 1 }}>{children(state_socket)}</View>; 
    //<View style={{ flexGrow: 1 }}>{children}</View>;
};

export default Socket;
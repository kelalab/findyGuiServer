import { createSlice } from '@reduxjs/toolkit';

export const connectionSlice = createSlice({
    name: 'state',
    initialState: {
        connections: [],
        requests: []
    },
    reducers: {
        setConnections: (state, action) => {
            console.log('setConnections called', action);
            state.connections = action.payload;
        },
        addConnection: (state, action) => {
            state.connections = state.connections.push(action.payload);
        },
        addRequest: (state, action) => {
            console.log('add request', action.payload);
            state.requests = [...state.requests, action.payload];
        },
        updateConnection: (state, action) => {
            /*console.log('trying to udpate connection');
            console.log('previous', state);
            console.log(action);*/
            const original = state.connections.find(conn => conn.id === action.payload.id);
            console.log('original', original);
            const updated = {...original, ...action.payload};
            console.log('updated connection', updated);
            state.connections = [
                updated,
                ...state.connections.filter(i => i.id !== action.payload.id),
            ];
            //console.log('end state', state.connections);
        },
    },
});

export const { setConnections, addConnection, updateConnection, addRequest } =
  connectionSlice.actions;

export default connectionSlice.reducer;

import React, { useEffect, useState } from 'react'
import { Grommet } from 'grommet'
import MainView from './Views/MainView'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Connections from './Views/Connections'
import Chat from './Views/Chat';

const theme = {
  "global": {
    "colors": {
      "background": {
        "light": "#ffffff",
        "dark": "#000000"
      }
    },
    "font": {
      "family": "-apple-system, BlinkMacSystemFont, \n         \"Segoe UI\", \n         Roboto, \n         Oxygen, \n         Ubuntu, \n         Cantarell, \n         \"Fira Sans\", \n         \"Droid Sans\",  \n         \"Helvetica Neue\", \n         Arial, sans-serif,  \n         \"Apple Color Emoji\", \n         \"Segoe UI Emoji\", \n         \"Segoe UI Symbol\""
    }
  },
  "button": {
    "extend": [
      null
    ]
  }
}

const App = () => {

  const [messages, setMessages] = useState([]);
  const [connections, setConnections] = React.useState([]);
  const [selectedconnection, setselectedconnection] = React.useState('');


  const newMessage = (msg) => {
    console.log('newMessage', msg, messages);
    let msgs = [...messages];
    console.log('msgs', msgs);
    msgs.push(msg);
    setMessages(msgs);
  }

  useEffect(() => {
    const sse = new EventSource('/events',
      { withCredentials: true });
    async function getRealtimeData(data) {
      // process the data here,
      // then pass it to state to be rendered
      console.log('all data', data);
      console.log('event type', data.type);
      switch(data.type){
        case '/topic/basicmessages/':
          const msgdata = data.data;
          console.log('msg data', msgdata);
          const connid = msgdata.connection_id;
          const connection = connections.find(conn => conn.connection_id === connid);
          if(connection){
            newMessage({sender:connection.their_label,content:msgdata.content,connection_id: connection.connection_id});
            //
            const intro_msg = 'Hei, kuinka voin auttaa?';
            const resp = await fetch('/api/send_message', {
              method: 'POST',
              body: JSON.stringify({
                  message: intro_msg,
                  recipient: connection.connection_id
              })
            });
            newMessage({sender:'me',content:intro_msg,connection_id: connection.connection_id});
            await fetch('/api/credential/offer', {
              method: 'POST',
              body: JSON.stringify({
                connection: connection.connection_id
              })
            });
          }else{
            console.warn('should add message but cannot find sender');
          }
          break;
        case '/topic/issue_credential/':
          const ex_data = data.data;
          console.log('state', ex_data.state);
          if(ex_data.state==='request_received'){
            await fetch('/api/credential/issue', {
              method: 'POST',
              body: JSON.stringify({
                cred_ex_id: ex_data.credential_exchange_id
              })
            });
          }else{
            console.log('waiting for cred request');
          }
          break;
        default:
          console.log('event data', data.data);
      } 
    }
    sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      // error log here 
      
      sse.close();
    }
    return () => {
      sse.close();
    };
  }, [connections, messages, newMessage]);

return (
  <Grommet full theme={theme}>
    <Router>
      <Switch>
        <Route path="/yhteydet/:name/chat">
          <Chat messages={messages} newMessage={newMessage} connection={selectedconnection} />
        </Route>
        <Route path="/yhteydet">
          <Connections connections={connections} setConnections={setConnections} setselectedconnection={setselectedconnection}/>
        </Route>
        <Route path="/">
          <MainView />
        </Route>
      </Switch>
    </Router>
  </Grommet>
)};

export default App;
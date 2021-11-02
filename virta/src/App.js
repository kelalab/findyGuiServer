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
      "family": "-apple-system,\n         BlinkMacSystemFont, \n         \"Segoe UI\", \n         Roboto, \n         Oxygen, \n         Ubuntu, \n         Cantarell, \n         \"Fira Sans\", \n         \"Droid Sans\",  \n         \"Helvetica Neue\", \n         Arial, sans-serif,  \n         \"Apple Color Emoji\", \n         \"Segoe UI Emoji\", \n         \"Segoe UI Symbol\""
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

  const newMessage = (msg) => {
    let msgs = [...messages];
    msgs.push(msg);
    setMessages(msgs);
  }

  useEffect(() => {
    const sse = new EventSource('/events',
      { withCredentials: true });
    function getRealtimeData(data) {
      // process the data here,
      // then pass it to state to be rendered
      console.log('all data', data);
      console.log('event type', data.type);
      switch(data.type){
        case '/topic/basicmessages':
          const msgdata = data.data;
          console.log('msg data', msgdata);
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
  }, []);

return (
  <Grommet full theme={theme}>
    <Router>
      <Switch>
        <Route path="/yhteydet/:name/chat">
          <Chat messages={messages} newMessage={newMessage}/>
        </Route>
        <Route path="/yhteydet">
          <Connections />
        </Route>
        <Route path="/">
          <MainView />
        </Route>
      </Switch>
    </Router>
  </Grommet>
)};

export default App;
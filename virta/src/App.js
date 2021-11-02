import React, { useEffect } from 'react'
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

  useEffect(() => {
    const sse = new EventSource('/events',
      { withCredentials: true });
    function getRealtimeData(data) {
      // process the data here,
      // then pass it to state to be rendered
      console.log(data);
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
        <Route path="/yhteydet/:id/chat">
          <Chat />
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
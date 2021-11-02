import React from 'react';
import { Box, Button, Header, Heading, Main, Card } from "grommet";
import { Previous } from 'grommet-icons';
import { withRouter } from 'react-router-dom';


const Connections = (props) => {
    console.log('props',props);
    const {history, location, match} = props;
    const [connections, setConnections] = React.useState([]);
    React.useEffect(
        () => {
        const getConnections = async() => {
            console.log('getting connections');
            let resp = await fetch('/api/connections',{
                method: 'GET',
            });
            let json = await resp.json();
            //let select = document.getElementById('selected_connection');
            if(json && json.length>0){
                // add the newly created element and its content into the DOM
                console.log('conn response', json);
                setConnections(json);/*
                const currentDiv = document.getElementById("msg");
                for(const elem of json){
                console.log(elem);
                 // and give it some content
                const newOption = document.createElement("option");
    
                // add the text node to the newly created div
                newOption.value=elem.connection_id;
                newOption.innerHTML=elem.their_label;
                select.appendChild(newOption);
                }*/
            }    
        }
        getConnections();
    }, []);
    
    return (
    <Box>
      <Header align="center" direction="row" flex={false} justify="center" gap="large" background={{"color":"brand"}}>
        <Button icon={<Previous />} onClick={() => history.goBack()} />
        <Heading level="1">Yhteydet</Heading>
      </Header>
      <Main fill="horizontal, vertical" flex="grow" overflow="auto" direction="column" pad="medium" justify="start">
          {connections && connections.map((conn, idx) => {
               return( 
               <Card>
                   <Heading level="2">{conn.their_label}</Heading>
                   {JSON.stringify(conn)}
                   <Button label="Chat" primary onClick={() => history.push(`${location.pathname}/${conn.their_label}/chat`)}/>
                </Card>
               )
            })
            }
      </Main>
    </Box>
    )
}
export default withRouter(Connections);
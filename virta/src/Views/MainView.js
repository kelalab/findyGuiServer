import React from 'react';
import { Box, Button, DropButton, Header, Heading, Image, Footer, Main } from "grommet";
import { Network, Menu } from 'grommet-icons';
import { RouterContext } from '../RouterContext';
import Invitation from './Invitation';
import { withRouter } from 'react-router-dom';

const MainView = (props) => {
  console.log('props',props);
  const {history, location, match} = props;
  const { push } = React.useContext(RouterContext);
  const [open, setopen] = React.useState(false);
  const [showinvitation, setShowinvitation] = React.useState(false);
  const [invitation, setInvitation] = React.useState(null);

  const getInvitation = async() => {
    const invitation_response = await fetch('/api/create_invitation');
    //let json_as_text = await invitation_response.text();
    const json = await invitation_response.json();
    //console.log(json_as_text);
    try{
      const json_parsed_again = JSON.parse(json);
      console.log('invitation', json_parsed_again);
      setInvitation(json_parsed_again);
      setShowinvitation(true);
    }catch(e){
      console.error('unable to parse json');
    }
  }

  return (
    <Box overflow="auto" align="center" flex="grow">
      <Header align="center" direction="row" flex="grow" justify="center" gap="large" background={{"color":"brand"}} fill="horizontal">
        <Heading level="1" textAlign="start">
          Opiskelijatietokanta
        </Heading>
        <DropButton dropAlign={{"top":"bottom"}} onClick={() => setopen(!open)} open={open} dropContent={(
          <Box align="center" justify="center" pad="medium" name="dropContent" background={{"color":"status-ok","dark":true}} round="small" margin="small">
            <Button label="Yhteydet" primary={false} plain reverse secondary={false} type="button" active={false} icon={<Network />} onClick={() => history.push("/yhteydet")} />
          </Box>
        )}
         icon={<Menu />} primary size="large" dropProps={{"plain":true}} plain={false} />
      </Header>
      <Main fill="horizontal, vertical" flex="grow" overflow="auto" direction="column" pad="medium" justify="start">
        <Box align="start" flex="grow" justify="center" direction="row-responsive">
          <Box align="center" justify="center" flex="grow" basis="2/3" />
          <Box align="center" justify="center" flex="grow" border={{"size":"medium"}} pad="small" basis="1/3" >
            <Image src="https://i2.wp.com/findy.fi/wp-content/uploads/2021/05/cropped-Findy_logo.png?resize=2048%2C563&ssl=1" height="60" />
            <Button label="Yhdistä" type="button" onClick={getInvitation}/>
          </Box>
        </Box>
        {showinvitation && invitation && 
          <Invitation close={() => setShowinvitation(false)} data={invitation}/>
        }
      </Main>
      
      <Footer align="center" direction="row" flex={false} justify="between" gap="medium" />
    </Box>
  )
}
export default withRouter(MainView);
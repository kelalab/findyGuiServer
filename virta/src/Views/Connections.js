import React from 'react';
import { Box, Button, Header, Heading } from "grommet";
import { Previous } from 'grommet-icons';
import { RouterContext } from '../RouterContext';

const Connections = () => {
    const { push,back } = React.useContext(RouterContext);
  
    return (
      <Header align="center" direction="row" flex={false} justify="center" gap="large" background={{"color":"brand"}}>
        <Button icon={<Previous />} onClick={() => back()} />
        <Heading level="1">Yhteydet</Heading>
        <Box>
  
        </Box>
      </Header>
    )
}
export default Connections;
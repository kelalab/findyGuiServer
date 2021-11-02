import { Box, Button, Header, Heading, Main } from 'grommet';
import { withRouter } from 'react-router-dom';

const Chat = (props) => {
    console.log('props',props);
    const {history, location, match} = props;
    return (
        <Box>
            <Header align="center" direction="row" flex={false} justify="center" gap="large" background={{"color":"brand"}}>
                <Button icon={<Previous />} onClick={() => history.goBack()} />
                <Heading level="1">Chat</Heading>
            </Header>
            <Main>
                <Box>

                </Box>
            </Main>
        </Box>
    )
}

export default withRouter(Chat);
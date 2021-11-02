import { Box, Header, Heading, Main } from 'grommet';
import { withRouter } from 'react-router-dom';

const Chat = (props) => {
    console.log('props',props);
    const {history, location, match} = props;
    return (
        <Box>
            <Header>
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
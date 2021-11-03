import { Box, Button, Header, Heading, Main, Text, TextInput } from 'grommet';
import { withRouter } from 'react-router-dom';
import { Previous } from 'grommet-icons';

const Chat = (props) => {
    console.log('props',props);
    const {history, location, match, newMessage, messages} = props;
    return (
        <Box>
            <Header align="center" direction="row" flex={false} justify="center" gap="large" background={{"color":"brand"}}>
                <Button icon={<Previous />} onClick={() => history.goBack()} />
                <Heading level="1">Chat</Heading>
            </Header>
            <Main>
                <Box>
                    {messages && messages.map((msg,idx) => {
                        console.log(msg);
                        console.log(idx);
                        return (
                            <Box background={{"color": "brand"}}>
                                <Text>{}</Text>
                                <Text>{msg}</Text>
                            </Box>
                        )
                    })}
                    <Box>
                        <TextInput></TextInput>
                        <Button label="Send"></Button>
                    </Box>
                </Box>
            </Main>
        </Box>
    )
}

export default withRouter(Chat);
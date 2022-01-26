import { Box, Button, Header, Heading, Main, Text, TextInput } from 'grommet';
import { withRouter } from 'react-router-dom';
import { Previous } from 'grommet-icons';
import { useState } from 'react';

const Chat = (props) => {
    console.log('props',props);
    const { connection } = props;
    const [message, setmessage] = useState('');
    const {history, location, match, newMessage, messages} = props;

    const sendMessage = async(e) => {
        console.log('sending msg', message);
        const resp = await fetch('/api/send_message', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                recipient: connection
            })
        });
        const json = await resp.json();
        console.log('msg send response', json);
        newMessage({sender: 'me' ,message:message});
        setmessage('');
    }

    const handleChange = (e) => {
        setmessage(e.target.value);
    }

    return (
        <Box >
            <Header elevation="medium" align="center" direction="row" flex={false} justify="center" gap="large" background={{"color":"brand"}}>
                <Button icon={<Previous />} onClick={() => history.goBack()} />
                <Heading level="1">Chat</Heading>
            </Header>
            <Main>
                <Box pad="large">
                    {messages && messages.map((msg,idx) => {
                        console.log(msg);
                        console.log(idx);
                        return (
                            <Box margin={{"top":"small"}} overflow="auto" align="start" background={{"color": "brand", "opacity":msg.sender === 'me'? "medium" : "undefined", "right":"xlarge"}} round="small" pad="small" justify="start" direction="column">
                                <Text size="xsmall">{msg.sender}</Text>
                                <Text size="small" weight="bold">{msg.content}</Text>
                            </Box>
                        )
                    })}
                    <Box>
                        <TextInput onChange={handleChange} value={message}></TextInput>
                        <Button label="Send" onClick={sendMessage}></Button>
                    </Box>
                </Box>
            </Main>
        </Box>
    )
}

export default withRouter(Chat);
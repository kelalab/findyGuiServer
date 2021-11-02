import { withRouter } from 'react-router-dom';

const Chat = (props) => {
    console.log('props',props);
    const {history, location, match} = props;
}

export default withRouter(Chat);
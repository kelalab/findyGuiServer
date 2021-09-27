const SocketUtil = socket => {
    const markAsSeen = async item => {
        console.log('marking item', item, 'as seen...');
        console.log('socket', socket);
        socket.send({ type: 'seen', data: item.id });
    };

    return {
        markAsSeen,
    };
};

export default SocketUtil;

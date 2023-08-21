let io;

module.exports = {
    initIO: httpServer => {
        io = require('socket.io')(httpServer)
        return io
    },
    getIO: () => {
        if(!io){
            throw Error("Error Initializing socket.io")
        }
        return io
    }
}
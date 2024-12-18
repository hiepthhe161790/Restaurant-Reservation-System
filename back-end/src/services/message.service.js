const { Message } = require('../models/index');

class MessageService {
    /**
    * author: TienPV
    */
    getAllMessages = async () => {
        return await Message.find();
    }
}

module.exports = new MessageService;

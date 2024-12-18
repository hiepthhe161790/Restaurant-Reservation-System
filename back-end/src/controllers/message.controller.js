const { MessageService } = require('../services/index');

class MessageController {
    /**
    * method: GET
    * router(api/v1/message)
    * author: TienPV
    */
    getAllMessages = async (req, res, next) => {
        try {
            const messages = await MessageService.getAllMessages();
            res.status(200).json({
                data: messages,
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new MessageController;

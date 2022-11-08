function controller(data){/*...*/}

exports.httpServer = async function httpServer(req, res) {
    try {
        const returnData = await controller(req.body);
        res.send(returnData);
    } catch (err) {
        res.status(500).send({
            message: err.message,
            stack: err.stack
        });
    }
};


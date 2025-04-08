const cds = require("@sap/cds");
const { Readable, PassThrough } = require("stream");

module.exports = cds.service.impl((srv) => {
    const entities = srv.entities;

    srv.on('READ', 'EarningFiles', async (req, next) => {
        if (!req.data.ID) {
            return next();
        }
        //Fetch the url from where the req is triggered
        const url = req._.req.path;
        //If the request url contains keyword "content"
        // then read the media content
        if (url.includes("content")) {
            // Fetch the media obj from database
            var mediaObj = await SELECT.one.from("EarningFiles").columns("content", "mediaType").where({
                ID: req.data.ID
            });
            if (mediaObj?.length <= 0 || !mediaObj?.content) {
                req.reject(404, "Media not found for the ID");
                return;
            }
            var decodedMedia = "";
            decodedMedia = new Buffer.from(
                mediaObj?.content?.toString()?.split(";base64,").pop(),
                "base64"
            );
            return _formatResult(decodedMedia, mediaObj.mediaType);
        } else return next();
    });

    function _formatResult(decodedMedia, mediaType) {
        const readable = new Readable();
        const result = new Array();
        readable.push(decodedMedia);
        readable.push(null);
        return {
            value: readable,
            '*@odata.mediaContentType': mediaType
        }
    }
});

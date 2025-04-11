const cds = require("@sap/cds");
const { Readable } = require("stream");

module.exports = cds.service.impl((srv) => {
  const entities = srv.entities;

  srv.on("READ", "VisibilityConfig", async (req) => {
    req.reply({
      isAdmin: req.user.is("Earning_Admin"),
    });
  });

  //   srv.before("SAVE", "EarningFiles", async (req) => {
  //     console.log("Before Save EarningFiles", req.data);
  //   });

  //   srv.on("SAVE", "EarningFiles", async (req, next) => {
  //     console.log("On Save EarningFiles", req.data);
  //     await next();
  //   });

  //   srv.after("SAVE", "EarningFiles", async (data, req) => {
  //     console.log("After Save EarningFiles", data);
  //   });

  //   srv.on("READ", ["EarningFiles", "EarningFiles.drafts"], async (req, next) => {
  //     if (!req.data.ID) {
  //       return next();
  //     }
  //     //Fetch the url from where the req is triggered
  //     const url = req._.req.path;
  //     //If the request url contains keyword "content"
  //     // then read the media content
  //     if (url.includes("content")) {
  //       console.log("Fetching media content for ID:", req.data.ID);
  //       // Fetch the media obj from database
  //       var mediaObj = await SELECT.one
  //         .from("EarningFiles")
  //         .columns("content", "mediaType")
  //         .where({
  //           ID: req.data.ID,
  //         });
  //       if (mediaObj?.length <= 0 || !mediaObj?.content) {
  //         req.reject(404, "Media not found for the ID");
  //         return;
  //       }
  //       var decodedMedia = "";
  //       decodedMedia = await streamToBuffer(mediaObj?.content);
  //       console.log("Media content fetched successfully for ID:", req.data.ID);
  //       return _formatResult(decodedMedia, mediaObj.mediaType);
  //     } else return next();
  //   });

  // Helper function to convert Readable stream to Buffer
  function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", (err) => reject(err));
    });
  }

  function _formatResult(decodedMedia, mediaType) {
    const readable = new Readable();
    const result = new Array();
    readable.push(decodedMedia);
    readable.push(null);
    return {
      value: readable,
      "*@odata.mediaContentType": mediaType,
    };
  }
});

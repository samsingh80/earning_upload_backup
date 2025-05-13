const cds = require("@sap/cds");
const { Readable } = require("stream");
const crypto = require("crypto");

module.exports = cds.service.impl((srv) => {
  const {VisibilityConfig} = srv.entities;

  srv.on("READ",VisibilityConfig, async (req) => {
    req.reply({
      isAdmin: req.user.is("T_ITO_EFDNA_GenAI_Earnings_Support"),
    });

    // let currentUser = await next();
    // currentUser.isAdmin = req.user.is("Earning_Admin")
    //   ? false
    //   : true;
    // return currentUser;
  });

   // original read logic based on content
   srv.on('READ', ['EarningFiles', 'EarningFiles.drafts'], async (req, next) => {
    if (!req.data.ID) {
      return next();
    }
    //Fetch the url from where the req is triggered
    const url = req._.req.path;
    //If the request url contains keyword "content"
    // then read the media content
    if (url.includes("content")) {
      console.log("Fetching media content for ID:", req.data.ID);
      // Fetch the media obj from database

      let tx = cds.transaction(req);
      // Fetch the media obj from database
      let mediaObj = await tx.run(
        SELECT.one.from("com.scb.earningupload.EarningFiles", ["content", "mediaType"]).where(
          "ID =",
          req.data.ID
        )
      );
      let decodedMedia = "";
      decodedMedia = Buffer.from(
        mediaObj.content,
        "base64"
      );
      console.log("Media content fetched successfully for ID:", req.data.ID);
      return _formatResult(decodedMedia, mediaObj.mediaType);
    } else return next();
  });

  // Helper function to convert Readable stream to Buffer
  function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', err => reject(err));
    });
  }

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



  srv.on('READ', ['EmbeddingFiles'], async (req, next) => {
    if (!req.data.ID) {
      return next();
    }
  
    const url = req._.req.path;
    if (url.includes("content")) {
      console.log("Fetching media content for ID:", req.data.ID);
  
      let tx = cds.transaction(req);
      let mediaObj = await tx.run(
        SELECT.one.from("com.scb.earningupload.EmbeddingFiles", ["content", "mediaType"]).where({ ID: req.data.ID })
      );
  
      if (!mediaObj || !mediaObj.content) {
        console.error(`No content found for ID: ${req.data.ID}`);
        req.reject(404, `No media content found for ID: ${req.data.ID}`);
        return;
      }
  
      // No Buffer.from needed anymore!
      let decodedMedia = mediaObj.content;  // already a Buffer
  
      console.log("Media content fetched successfully for ID:", req.data.ID);
      return _formatResult(decodedMedia, mediaObj.mediaType);
    } else {
      return next();
    }
  });

  // Helper function to convert Readable stream to Buffer
  function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', err => reject(err));
    });
  }

  // function _formatResult(decodedMedia, mediaType) {
  //   const readable = new Readable();
  //   const result = new Array();
  //   readable.push(decodedMedia);
  //   readable.push(null);
  //   return {
  //     value: readable,
  //     '*@odata.mediaContentType': mediaType
  //   }
  // }

  function _formatResult(decodedMedia, mediaType) {
    return {
      value: decodedMedia,   // Buffer directly!
      '*@odata.mediaContentType': mediaType
    };
  }
});

namespace com.scb.earningupload;

using {
  cuid,
  managed,
  sap.common.CodeList
} from '@sap/cds/common';

entity Banks : CodeList {
  key code : String(40);
}

entity EarningFiles : cuid, managed {
  bank      : Association to Banks;
  year      : String(4);
  quarter   : String(2);

  // @Core.MediaType  : mediaType
  // content   : LargeBinary;

  // @Core.IsMediaType: true
  // mediaType : String;
  // fileName  : String;
  // url       : String;
  documents : Composition of many Document
                on documents.idea = $self;
}

entity Document : cuid, managed {
  doc            : LargeBinary
                          @Core.MediaType         : docType
                          @Core.ContentDisposition: {
    Type    : 'inline',
    Filename: fileName
  };
  docDescription : String(250);
  docType        : String @Core.IsMediaType;
  fileName       : String;
  idea           : Association to EarningFiles;
}

@odata.singleton  @cds.persistency.skip
entity VisibilityConfig {
  key ID      : String;
      isAdmin : Boolean;
}

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

  @Core.MediaType         : mediaType
  content   : LargeBinary;

  @Core.IsMediaType       : true
  mediaType : String;
  fileName  : String;
  url       : String;
}

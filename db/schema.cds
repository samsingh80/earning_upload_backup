namespace com.scb.earningupload;

using {
  cuid,
  managed,
  sap.common.CodeList
} from '@sap/cds/common';

entity Banks : CodeList {
  key code : String(40);
}

entity Years : CodeList {
  key code : String(4);
}

entity Quarters : CodeList {
  key code : String(2);
}

@cds.server.body_parser.limit: '50mb'
entity EarningFiles : cuid, managed {
  bank      : Association to Banks;
  year      : Association to Years default '2025';
  quarter   : Association to Quarters;

  @Core.MediaType  : mediaType
  content   : LargeString;

  @Core.IsMediaType: true
  mediaType : String;
  fileName  : String;
  url       : String;
}



@cds.server.body_parser.limit: '50mb' 
@UI.LineItem: [
    { Value: fileName,
      $Type: 'UI.DataField',
     Label: 'File Name' },
    { Value: mediaType,$Type: 'UI.DataField', Label: 'Media Type' },
    { Value: status,$Type: 'UI.DataField', Label: 'Status' },
    {$Type: 'UI.DataFieldWithUrl',Label: 'Download',Value: fileName,Url: url},
    { Value: createdBy,$Type: 'UI.DataField', Label: 'CreateBy' },

  ]
@UI.SelectionFields : [
        status,
        createdBy

    ]
    

entity EmbeddingFiles @(odata.stream)  :  managed {

  key ID: String;
  @Core.MediaType: mediaType
  content: LargeBinary ;
  @Core.IsMediaType: true
  @UI.HiddenFilter
  mediaType : String;
  @UI.HiddenFilter
  fileName : String;
  url      : String;
  @Consumption.filterable : true
@Common.ValueList: {
  CollectionPath: 'FileStatusValues',
  Parameters: [
    {
      $Type: 'Common.ValueListParameterInOut',
      LocalDataProperty: 'status',
      ValueListProperty: 'code'
    }
  ]
}
@Common.ValueListWithFixedValues: true
  @Common.FieldControl: #Mandatory
  status   : String(20);
    comments  : String;

}

type FileStatus : String enum {
  Completed;
  InProgress;
  Test;
};

// @odata.singleton
// entity VisibilityConfig :cuid,{
//       isAdmin : Boolean;
// };
@odata.singleton  @cds.persistency.skip
entity VisibilityConfig {
  key ID      : String;
      isAdmin : Boolean;
}
@UI.LineItem: [{Value: code, Label: 'Status'}]
@UI.SelectionFields: [{$value: code}]
entity FileStatusValues {

  key code : String(20);
};


using {EarningUploadSrv as service} from '../srv/service.cds';

annotate service.Banks with {
  code @Common.Text: {
    $value                : name,
    ![@UI.TextArrangement]: #TextOnly,
  }
};

annotate service.EarningFiles with @UI.HeaderInfo: {
  TypeName      : 'Earning File',
  TypeNamePlural: 'Earning Files',
  Title         : {
    $Type: 'UI.DataField',
    Value: bank_code,
  },
};

annotate service.EarningFiles with {
  @Common: {
    Text                    : bank.name,
    TextArrangement         : #TextOnly,
    ValueListWithFixedValues: true,
    ValueList               : {
      $Type         : 'Common.ValueListType',
      CollectionPath: 'Banks',
      Parameters    : [{
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: bank_code,
        ValueListProperty: 'code',
      }, ],
      Label         : 'Bank',
    }
  }
  bank    @title: 'Bank';
  year    @title: 'Year';
  quarter @title: 'Quarter';
};

annotate service.EarningFiles with @UI.LineItem: [
  {
    $Type                : 'UI.DataField',
    Value                : bank_code,
    ![@HTML5.CssDefaults]: {width: 'auto', },
  },
  {
    $Type                : 'UI.DataField',
    Value                : year,
    ![@HTML5.CssDefaults]: {width: 'auto', },
  },
  {
    $Type                : 'UI.DataField',
    Value                : quarter,
    ![@HTML5.CssDefaults]: {width: 'auto', },
  },
  {
    $Type                : 'UI.DataField',
    Value                : createdBy,
    ![@HTML5.CssDefaults]: {width: 'auto', },
  },
  {
    $Type                : 'UI.DataField',
    Value                : createdAt,
    ![@HTML5.CssDefaults]: {width: 'auto', },
  },
];

annotate service.EarningFiles with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      $Type: 'UI.DataField',
      Value: bank_code
    },
    {
      $Type: 'UI.DataField',
      Value: year
    },
    {
      $Type: 'UI.DataField',
      Value: quarter
    },
  ]
};

annotate service.EarningFiles with @UI.Facets: [{
  $Type : 'UI.ReferenceFacet',
  ID    : 'Main',
  Label : 'General Information',
  Target: '@UI.FieldGroup#Main'
}];

annotate service.EarningFiles with @(Common.SideEffects: {
  SourceProperties: [content],
  TargetEntities  : ['/EarningUploadSrv.EntityContainer/EarningFiles'],
});

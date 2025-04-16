using {com.scb.earningupload as earning_upload} from '../db/schema.cds';

@requires: 'authenticated-user'
service EarningUploadSrv {
  @odata.draft.enabled
  //@UI.CreateHidden: {$edmJson: {$Path: '/VisibilityConfig/isAdmin'}}
  @UI.CreateHidden: {$edmJson:  {$Path: '/VisibilityConfig/isAdmin'}}
  @UI.DeleteHidden: {$edmJson:  {$Path: '/VisibilityConfig/isAdmin'}}
  @UI.UpdateHidden: {$edmJson:  {$Path: '/VisibilityConfig/isAdmin'}}
  entity EarningFiles @(restrict: [
    {
      grant: ['*'],
      to   : ['Earning_Admin']
    },
    {
      grant: ['READ', ],
      to   : ['Earning_Viewer']
    },
  ])                      as projection on earning_upload.EarningFiles;

  entity Banks            as projection on earning_upload.Banks;

  entity Quarters         as projection on earning_upload.Quarters
                             order by
                               code asc;

  entity Years            as projection on earning_upload.Years
                             order by
                               code asc;

  entity VisibilityConfig as projection on earning_upload.VisibilityConfig;


}

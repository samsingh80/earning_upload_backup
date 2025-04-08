using { com.scb.earningupload as earning_upload } from '../db/schema.cds';

@requires: 'authenticated-user'
service EarningUploadSrv {
  @odata.draft.enabled
  entity EarningFiles as projection on earning_upload.EarningFiles;

  entity Banks as projection on earning_upload.Banks;
}
import { eCritterPermission } from 'types/user'

interface RequestPingParams {
  timeWindow: number[];
  pingExtent: string;
}

// used in critter getters to specify collar attachment status
enum eCritterFetchType {
  assigned = 'assigned',
  unassigned= 'unassigned',
  all = 'all'
}

/**
 * the EditModal passes this object to parent components when the save button is clicked
 * @param isEdit adding or editing
 * @param body object of T being added
 */
interface IUpsertPayload<T> {
  isEdit: boolean;
  body: T;
}

interface ICritterAccess {
  animal_id: string;
  permission_type: eCritterPermission;
}
interface IUserCritterPermissionInput {
  userId: number;
  access: ICritterAccess[]
}

interface IGrantCritterAccessResults {
  assignment_id: string;
  user_id: number;
  animal_id: string;
  valid_from: Date;
}

interface ICollarLinkPayload {
  isLink: boolean;
  data: {
    animal_id: string,
    collar_id: string,
    valid_from: Date | string,
    valid_to?: Date | string
  }
}
interface BulkUploadError {
  error: string;
  row: JSON;
  rownum: number
}
interface IBulkUploadResults<T> {
  errors: BulkUploadError[];
  results: T[];
}

interface IBaseGetProps {
  page: number;
}

interface IGetCodeProps extends IBaseGetProps {
  codeHeader: string;
}

export type {
  RequestPingParams,
  IBulkUploadResults,
  ICollarLinkPayload,
  IBaseGetProps,
  IGetCodeProps,
  IUpsertPayload,
  IUserCritterPermissionInput,
  IGrantCritterAccessResults,
  ICritterAccess
}

export {
  eCritterFetchType
}

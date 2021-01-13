import { createUrl } from 'api/api_helpers';
import { AxiosInstance } from 'axios';
import { UserRole } from 'types/user';


export const userApi = (api: AxiosInstance) => {

  const requestUserRole = async(): Promise<UserRole> => {
    const url = createUrl({ api: 'role' });
    const { data } = await api.get(url);
    return data;
  }

  return {
    getUserRole: requestUserRole
  }
}

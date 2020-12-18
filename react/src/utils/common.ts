import { AxiosError } from "axios";

/** 
 * @param {K} key
 * @param {T} object of type T
 * given a property name of an object T, return its type.
 * let x = { foo: 10, bar: "hello!" };
 * getProperty(x, "foo"); // number
**/
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}

/**
 * shallow compare of objects for use in forms
 * values can only be primitive types
 * @param o1 the new object  
 * @param o2 the original object
 */
const objectCompare = (o1: object, o2: object): boolean => {
  for (const key of Object.keys(o1)) {
    // consider emptystring and null 'the same'
    if ((o1[key] === '' && o2[key] === null) || (o1[key] === null && o2[key] === '')) {
      continue;
    }
    if (o1[key] !== o2[key]) {
      return false;
    }
  }
  return true;
}

const columnToHeader = (col: string): string => {
  const asArr = col.replace('_', ' ').split(' ');
  return asArr.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(' ');
};

/** 
 * does not modify original obj
*/
const omitNull = <T,>(obj: T) => {
  const copy = Object.assign(obj, {});
  Object.keys(copy)
    .filter(k => obj[k] === null || obj[k] === undefined || obj[k] === '')
    .forEach(k => delete (obj[k]));
  return copy;
}

/**
 * used for removing props that shouldn't be passed on to material ui components 
 * @param object to remove from
 * @param propsToRemove string array of properties to delete
 */
const removeProps = <T,>(obj: T, propsToRemove: string[]): T => {
  const copyOfT = {...obj};
  propsToRemove.forEach(p => delete copyOfT[p]);
  return copyOfT;
}

// const sortImportRow = (row: object): string => {
//   const keys = Object.keys(row).sort();
//   const values = keys.map((k: string) => row[k]).join();
//   return values;
// };

const formatAxiosError = (err: AxiosError): string => `${err.response?.data ?? err.message}`;

const isValidToast = (onPost: (msg: string) => void): boolean => {
  return typeof onPost === 'function';
}

export {
  columnToHeader,
  getProperty,
  formatAxiosError,
  objectCompare,
  omitNull,
  removeProps,
  isValidToast,
};
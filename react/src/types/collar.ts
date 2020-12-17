import dayjs from 'dayjs';
import { columnToHeader } from 'utils/common';
import { BCTW } from 'types/common_types';
import { Type } from 'class-transformer';
export interface ICollarBase {
  device_id: number;
}

export interface ICollar extends ICollarBase, BCTW {
    make: string;
    model: string;
    deployment_status: string;
    collar_status: string;
    collar_type: string;
    deactivated: boolean;
    radio_frequency: number;
    malfunction_date: Date;
    max_transmission_date: Date;
    reg_key: string;
    retreival_date: Date;
    satellite_network: string;
}


// used when creating new collars manually
export enum NewCollarType {
  VHF,
  Vect,
  Other,
}


const assignedCollarProps = [ 'animal_id', 'device_id', 'collar_status', 'max_transmission_date', 'make', 'model', 'collar_type'];
const availableCollarProps = [ 'device_id', 'collar_status', 'max_transmission_date', 'make', 'model', 'collar_type'];

// const getCollarTitle = (str: string): string => {
//   switch (str) {
//     case 'device_id':
//       return 'Device ID';
//     case 'make':
//       return 'GPS Vendor';
//     case 'model':
//       return 'Collar Model';
//     case 'animal_id':
//       return 'Individual ID';
//     case 'max_transmission_date':
//       return 'Last Update';
//     default:
//       return columnToHeader(str);
//   }
// };

export {
  assignedCollarProps,
  availableCollarProps,
}

// function decodeCollar(json: Collar): Collar {
//   const collar = Object.create({});
//   return Object.assign(collar, json, {
//     malfunction_date: json.malfunction_date ? dayjs(json.malfunction_date) : null,
//     max_transmission_date: json.max_transmission_date ? dayjs(json.max_transmission_date) : null,
//     retreival_date: json.retreival_date ? dayjs(json.retreival_date) : null,
//   });
// }

// const datetimeFields = ['malfunction_date', 'max_transmission_date', 'retreival_date'];

// function isCollar(collar: any): collar is Collar {
//   return (collar as Collar).device_id !== undefined;
// }

// dont upsert null date / timestamp fields
// function encodeCollar(c: Collar) {
//   const dateFields = {};
//   datetimeFields.forEach((s: string) => {
//     if (c[s]) {
//       dateFields[s] = moment(c[s]).format(_momentFormat);
//     } else {
//       delete c[s];
//     }
//   });
//   return Object.assign(c, dateFields);
// }

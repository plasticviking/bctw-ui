import React, { useState, useEffect } from 'react';
import Modal from 'components/modal/Modal';
import { Typography, Chip } from '@material-ui/core';
import Button from 'components/form/Button';
import { ExportImportProps } from 'components/component_interfaces';

type ImportProps<T> = ExportImportProps & {
  data: T[];
}

export default function Export<T>({ data, message, title, open, handleClose }: ImportProps<T>) {
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);

  useEffect(() => {
    if (open === true) {
      reset();
    }
  }, [open]);

  const getTypeExportFields = (a: T): string[] => Object.keys(a);

  const add = (item) => {
    const removed = excluded.splice(excluded.indexOf(item), 1)[0];
    setIncluded((old) => [...old, ...[removed]]);
  };
  const remove = (item) => {
    const added = included.splice(included.indexOf(item), 1)[0];
    setExcluded((old) => [...old, ...[added]]);
  };
  const download = () => {
    console.log('download me');
  };
  const uncheckAll = () => setExcluded([...excluded, ...included.splice(0)]);
  const reset = () => {
    setIncluded([...getTypeExportFields(data[0])]);
    setExcluded([]);
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose} title={title}>
        <p>{message}</p>
        <Typography variant='h6'>Included in export</Typography>
        {included.map((d, i) => {
          return <Chip key={`${d}-${i}`} onDelete={remove} label={d} />;
        })}
        <Typography variant='h6'>Excluded in export</Typography>
        {excluded.map((d, i) => {
          return <Chip key={`${d}-${i}`} onDelete={add} label={d} color='secondary' />;
        })}
        <div>
          <Button onClick={download}>download</Button>
          <Button onClick={reset}>reset</Button>
          <Button disabled={included.length === 0} onClick={uncheckAll}>
            remove all
          </Button>
        </div>
      </Modal>
    </>
  );
}

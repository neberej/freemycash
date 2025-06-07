
import React from 'react';
import { EditData } from '@src/components';
import { CsvData } from '@src/components';

import './Data.scss';

const Data: React.FC = () => {
  return (
    <div className="edit-data">
        <CsvData/>
        <EditData/>
    </div>
  );
};

export default Data;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MapPicker from '../common/MapPicker';
import FileUpload from '../common/ImagesUploader/FileUpload';
import AddEventPackageGlobal from './AddEventPackageGlobal';

const EditPackage = () => {

  return (
    <div className="">
    <AddEventPackageGlobal yachtsType="package"/>

    </div>
  );
};

export default EditPackage;
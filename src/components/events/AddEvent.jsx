import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MapPicker from '../common/MapPicker';
import FileUpload from '../common/ImagesUploader/FileUpload';
import AddEventPackageGlobal from './AddEventPackageGlobal';

const AddEvent = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [packageImage, setPackageImage] = useState(null);
  const [status, setStatus] = useState('t');
  const [activeTab, setActiveTab] = useState('event'); // State for tab selection
  const navigate = useNavigate();



  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 font-sora">Manage Event & Package</h1>
        
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'event' ? 'bg-[#BEA355] text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('event')}
          >
            Add Event
          </button>
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'package' ? 'bg-[#BEA355] text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('package')}
          >
            Add Package
          </button>
        </div>

        {activeTab === 'event' && (
  <AddEventPackageGlobal yachtsType="event"/>
        )}

        {activeTab === 'package' && (
  <AddEventPackageGlobal yachtsType="package"/>
      
        )}
      </div>
    </div>
  );
};

export default AddEvent;
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import config from '../../../../config.json';

const CreateHedgedocPage = ({ title, date = false , filePath, template=""}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleButtonClick = () => {
    if (date) {
      setShowDatePicker(true);
    } else {
      const filename = window.prompt('Enter filename:');

      if (filename !== null && filename.trim() !== '') {
        createNoteWithFilename(filename);

      }
    }
  };

  function handleDateSelection(selectedDate) {
    setShowDatePicker(false);

    const year = selectedDate.getFullYear().toString().slice(-2);
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const filename = `${year}${month}${day}`;

    if (filename !== null && filename.trim() !== '') {
      createNoteWithFilename(filename);
    }
  };

  const createNoteWithFilename = (filename) => {
    const url = new URL(config.HEDGEDOC_SERVER);
    url.pathname = `/createGithubNote/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/${filePath}/${filename}-${filename}`;
    if(!!template) {
      url.search  = "?template=" + template
    }
    window.open(url, '_blank');

    return null;
  };

  return (
    <div>
      {showDatePicker && date && (
        <DatePicker
          selected={new Date()} 
          onChange={(date) => handleDateSelection(date)}
          dateFormat="yyyy-MM-dd"
        />
      )}
      {!showDatePicker && (
        <a href="#" className="new-meeting" onClick={(e) => { e.preventDefault(); handleButtonClick(); }}>
          {title}
        </a>
      )}
    </div>
  );
};

export default CreateHedgedocPage;

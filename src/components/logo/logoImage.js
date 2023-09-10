import React from 'react';
import imageSrc from './tradeExalt.png';
import imageSrcWhite from './tradeExaltWhite.png';
import { selectDarkMode } from '../../redux-toolkit/darkModeSlice';
import { useDispatch, useSelector } from 'react-redux';

const MyComponentWithImage = (props) => {
  const { w, h } = props;
  const darkMode = useSelector(selectDarkMode);
    return (
    <div>
      
      {/* <img  style={{ width: '240px', height: '170px' }}  src={imageSrc} alt="Description of the image" /> */}
      <img  style={{ width: w, height: h }}  src={ darkMode === false ? imageSrc : imageSrcWhite} alt="Description of the image" />
     
    </div>
  );
};

export default MyComponentWithImage;

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { saveAs } from 'file-saver';

const ImageDialog = ({ open, handleClose, imageData, tradeComments }) => {
    const [imageSrc, setImageSrc] = useState('');

    // Convert the image data to a data URL and set it as the image source
    useState(() => {
        if (imageData) {
            const dataUrl = `data:image/jpeg;base64,${imageData}`;
            setImageSrc(dataUrl);
        }
    }, [imageData]);

    const handleDownload = () => {
        const imageFormat = getImageFormat(imageSrc); // Not been used because image file is acctualy type of png and not jpeg.
        const byteCharacters = atob(imageSrc.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/png` });
        console.log(blob)
        saveAs(blob, 'trade_image.' + 'png');
    };


    const getImageFormat = (dataUrl) => {
        const formatMatch = dataUrl.match(/^data:image\/(\w+)/);
        if (formatMatch) {
            return formatMatch[1];
        }
        throw new Error('Invalid image data URL');
    };

    const openImageWindow = () => {
        const imageWindow = window.open('', '_blank', 'fullscreen=yes');
        const imageDocument = imageWindow.document;
        imageDocument.write(`
      <html>
        <head>
          <title>Fullscreen Image</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #000;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              cursor: pointer;
            }
            .close-icon {
              position: fixed;
              top: 10px;
              right: 10px;
              color: #fff;
              cursor: pointer;
              font-size: 24px;
              padding: 8px;
              background-color: rgba(0, 0, 0, 0.6);
              border-radius: 50%;
            }
          </style>
        </head>
        <body>
          <span class="close-icon" onclick="window.close()">✕</span>
          <img src="${imageSrc}" alt="Trade Image">
        </body>
      </html>
    `);
        imageDocument.close();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>Trade details</DialogTitle>
            <DialogContent>
                <img
                    src={imageSrc}
                    alt="Trade Image"
                    style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '80vh' }}
                    onClick={openImageWindow}
                />
                <div style={{ marginTop: '1rem' }}>
                    <button onClick={handleDownload}>Download Image</button>
                </div>
                <h4>My comments:</h4>
                <br />
                <p>{tradeComments}</p>
            </DialogContent>
        </Dialog>
    );
};

export default ImageDialog;

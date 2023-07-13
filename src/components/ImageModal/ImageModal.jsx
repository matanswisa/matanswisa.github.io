import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const ImageDialog = ({ open, handleClose, imageData, tradeComments }) => {
    const [imageSrc, setImageSrc] = useState('');

    // Convert the image data to a data URL and set it as the image source
    useState(() => {
        if (imageData) {
            const dataUrl = `data:image/jpeg;base64,${imageData}`;
            setImageSrc(dataUrl);
        }
    }, [imageData]);

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
                <h4>My comments:</h4>
                <br />
                <p>{tradeComments}</p>
            </DialogContent>
        </Dialog>
    );
};

export default ImageDialog;

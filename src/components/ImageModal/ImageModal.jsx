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

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>Trade details</DialogTitle>
            <DialogContent>
                <img src={imageSrc} alt="Trade Image" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                <h4>My comments:</h4>
                <br />
                <p>{tradeComments}</p>
            </DialogContent>
        </Dialog>
    );
};

export default ImageDialog;
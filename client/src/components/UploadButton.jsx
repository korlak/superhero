import React, { useRef } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UploadButton({ heroId, onImagesUploaded, onFilesSelected }) {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        if (heroId) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            try {
                const res = await axios.post(`/heroes/${heroId}/image/add`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                onImagesUploaded && onImagesUploaded(res.data.filenames);
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        } else {
            onFilesSelected && onFilesSelected(Array.from(files));
        }
    };

    return (
        <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ width: "200px" }}
        >
            Add images
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
            />
        </Button>
    );
}
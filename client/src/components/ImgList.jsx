import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import axios from 'axios';

export default function ImgList({ images, width, height, maxHeight, cols, onImagesChange, heroId, btnDel }) {
	const [selectedImage, setSelectedImage] = useState(null);

	const handleDelete = async () => {
		if (!selectedImage) return;

		try {
			await axios.patch(`/heroes/${heroId}/image/del`, { imagePath: selectedImage });
			onImagesChange(images.filter(img => img !== selectedImage));
			setSelectedImage(null);
		} catch (err) {
			console.error('Error delete image', err);
		}
	};
	const handleClickOpen = (img) => {
		setSelectedImage(img);
	};

	const handleClose = () => {
		setSelectedImage(null);
	};

	function DialogImg(props) {
		const { onClose, open, img } = props;


		return (
			<Dialog onClose={handleClose} open={open}>
				{btnDel &&
					<Button
						variant="contained"
						color="error"
						sx={{ position: "absolute", top: "5px", right: "5px" }}
						onClick={handleDelete}
					>
						Delete
					</Button>
				}
				<img src={img} alt="Fail" width="400px" />
			</Dialog>
		);
	}

	return (
		<>
			{
				images.length > 0 ?
					<ImageList
						sx={{ width: width, height: height, maxHeight: maxHeight }}
						variant="quilted"
						cols={cols}
						rowHeight={150}
					>
						{images.map((img) => (
							<ImageListItem key={img} cols={img.cols || 1} rows={img.rows || 1}>
								<img
									key={img}
									src={`/${img}`}
									alt="Hero"
									onClick={() => handleClickOpen(img)}
								/>
								<DialogImg
									img={`/${img}`}
									open={selectedImage === img}
									onClose={handleClose}
								/>
							</ImageListItem>
						))}
					</ImageList>
					: <p>No images :(</p>
			}
		</>
	)
}
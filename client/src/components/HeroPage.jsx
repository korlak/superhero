import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImgList from './ImgList';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function HeroPage() {

	const { id } = useParams();
	const [hero, setHero] = React.useState(null)
	const [images, setImages] = useState([]);
	const fileInputRef = useRef(null);
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

	useEffect(() => {
		axios.get(`/heroes/${id}`)
			.then((res) => {
				console.log(res.data)
				setHero(res.data);
				setImages(res.data.images || []);
			})
			.catch((err) => console.error('Error load hero', err));
	}, [id]);

	useEffect(() => {
		if (hero) {
			setHero(prev => ({ ...prev, images }));
		}
	}, [images]);

	const handleFileChange = async (event) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('images', files[i]);
		}

		try {
			const res = await axios.post(`/heroes/${id}/image/add`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setImages(prev => [...prev, ...res.data.filenames]);
		} catch (error) {
			console.error('Error uploading images:', error);
		}
	};

	return (
		<>
			{hero ? (
				<div className='hero-page'>
					<Typography variant="h2" gutterBottom>
						{hero.nickname}
					</Typography>
					<Typography variant="body1" gutterBottom>
						{hero.nickname}( {hero.real_name} ) - {hero.origin_description}.
					</Typography>
					<Typography variant="body1" gutterBottom>
						His abilities: {hero.superpowers}.
					</Typography>
					<Typography variant="body1" gutterBottom>
						His catchphrase: {hero.catch_phrase}
					</Typography>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						startIcon={<CloudUploadIcon />}
						sx={{width: "200px"}}
					>
						Add images
						<VisuallyHiddenInput
							type="file"
							onChange={handleFileChange}
							ref={fileInputRef}
							multiple
						/>
					</Button>
					
					<div className='hero-box'>
						<ImgList
							sx={{ border: 1 }}
							images={hero.images}
							width="1200px"
							height="auto"
							maxHeight="700px"
							cols="8"
							heroId={id}
							onImagesChange={setImages}
							btnDel={true}
						/>
					</div>

				</div>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}

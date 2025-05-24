import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImgList from './ImgList';
import { Typography } from '@mui/material';
import UploadButton from './UploadButton';

export default function HeroPage() {

	const { id } = useParams();
	const [hero, setHero] = React.useState(null)
	const [images, setImages] = useState([]);

	useEffect(() => {
		axios.get(`/heroes/${id}`)
			.then((res) => {

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
					<UploadButton
						heroId={id}
						onImagesUploaded={(newFilenames) => setImages(prev => [...prev, ...newFilenames])}
					/>
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

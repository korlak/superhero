import axios from 'axios';
import { useEffect, useState } from 'react';
import CardHero from './Card';
import PaginationHero from './Pagination';
import Alert from '@mui/material/Alert';

function MainPage() {
	const [heroes, setHeroes] = useState([])
	const [notification, setNotification] = useState(null); 
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(heroes.length / itemsPerPage);
	const displayedItems = heroes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	useEffect(() => {
		axios.get('/heroes')
			.then((responce) => {
				setHeroes(responce.data)
			}).catch(function (error) {
				console.log(error);
			})
	}, [])

	const handleHeroDelete = (deletedId) => {
		const deletedHero = heroes.find(hero => hero.id === deletedId);
		setHeroes(prev => prev.filter(hero => hero.id !== deletedId));
		setNotification({ text: `${deletedHero?.nickname } successfully deleted`, type: 'success' });
	};

	return (
		<>
			<div className='hero-box'>
				{displayedItems.map(hero => (
					<CardHero
						key={hero.id}
						id={hero.id}
						nickname={hero.nickname}
						heroImage={hero.images[0]}
						onDelete={handleHeroDelete}
					/>
				))}
			</div>
			<PaginationHero totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
			{notification && (
				<Alert
					severity={notification.type}
					onClose={() => setNotification(null)}
					sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
				>
					{notification.text}
				</Alert>
			)}
		</>
	);
}

export default MainPage;

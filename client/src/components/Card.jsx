import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

export default function CardHero({ id, nickname, heroImage, onDelete }) {

  const handleDelete = () => {
    axios.delete(`/heroes/${id}`)
      .then(() => {
        onDelete(id)
      })
      .catch((err) => console.error('Помилка завантаження героя', err));
  };

  return (
    <>
      <Card sx={{ width: 200 }}>
        <CardMedia
          component="img"
          height="200"
          image={`${heroImage}`}
        />
        <CardContent>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            {nickname}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="update">
            <Link to={`/heroes/${id}`}>
              <VisibilityIcon />
            </Link>
          </IconButton>
          <IconButton aria-label="update">
            <Link to={`/editHero/${id}`}>
              <BorderColorIcon />
            </Link>
          </IconButton>
          <IconButton aria-label="delete" onClick={handleDelete} sx={{ marginBottom: "3px" }}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>


    </>
  );
}

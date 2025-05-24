import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ImgList from './ImgList';
import UploadButton from './UploadButton'

const HeroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [form, setForm] = useState({
    nickname: '',
    real_name: '',
    origin_description: '',
    superpowers: '',
    catch_phrase: '',
    images: [],
  });

  useEffect(() => {
    if (isEditing) {
      axios.get(`/heroes/${id}`)
        .then((res) => {
          setForm(res.data);
          setImages(res.data.images || []);
        })
        .catch((err) => console.error('Error load hero', err));
    }
  }, [id]);

  useEffect(() => {
    if (form) {
      setForm(prev => ({ ...prev, images }));
    }
  }, [images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.patch(`/heroes/${id}`, form);
      } else {
        const formData = new FormData();
        formData.append('nickname', form.nickname);
        formData.append('real_name', form.real_name);
        formData.append('origin_description', form.origin_description);
        formData.append('superpowers', form.superpowers);
        formData.append('catch_phrase', form.catch_phrase);
        form.images.forEach((file) => formData.append('images', file));

        await axios.post(`/heroes/add`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message
        || err.message
        || 'Unknow error';
      setErrorMessage(errorMessage);

    }
  };
  return (
    <div className='hero-box'>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className='formHero'>
        <Typography variant="h3" gutterBottom>
          {isEditing ? 'Edit Hero' : 'Add new Hero'}
        </Typography>

        <TextField
          id="outlined-basic"
          label="Nickname"
          variant="outlined"

          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="Nickname"
          required={!isEditing}

        />
        <TextField
          id="outlined-basic"
          label="Real Name"
          variant="outlined"

          name="real_name"
          value={form.real_name}
          onChange={handleChange}
          placeholder="Real Name"
          required={!isEditing}

        />
        <TextField
          id="outlined-basic"
          label="Superpower"
          variant="outlined"

          name="superpowers"
          value={form.superpowers}
          onChange={handleChange}
          placeholder="Superpowers"
          required={!isEditing}

        />
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}

          name="origin_description"
          value={form.origin_description}
          onChange={handleChange}
          placeholder="Origin Description"
          required={!isEditing}
        />
        <TextField
          id="outlined-multiline-static"
          label="Catch Phrase"
          multiline
          rows={4}

          name="catch_phrase"
          value={form.catch_phrase}
          onChange={handleChange}
          placeholder="Catch Phrase"
          required={!isEditing}
        />
        {isEditing &&
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Images:
            </Typography>
            <ImgList
              images={form.images}
              width="700px"
              height="auto"
              maxHeight="700px"
              cols="4"
              heroId={form.id}
              onImagesChange={setImages}
              btnDel={true}
            />
          </div>
        }
        <UploadButton
          heroId={id}
          onImagesUploaded={(newFilenames) => setImages(prev => [...prev, ...newFilenames])}
          onFilesSelected={(files) => setForm(prev => ({ ...prev, images: files }))}
        />
        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Alert>
        )}
        <Button type="submit" variant="contained" color='success' sx={{ marginBottom: "20px" }}>
          Submit
        </Button>
      </form >
    </div >
  );
};

export default HeroForm;
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header'
import MainPage from './components/MainPage';
import HeroForm from './components/HeroForm';
import HeroPage from './components/HeroPage';

function App() {
  return (
    <>
      <Router>
      <Header />
        <Routes>
          <Route path='/' element={<MainPage />}></Route>
          <Route path='/addHero' element={<HeroForm  />}></Route>
          <Route path='/editHero/:id' element={<HeroForm />}></Route>
          <Route path='/heroes/:id' element={<HeroPage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

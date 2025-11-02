import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import MyBooks from './pages/MyBooks'
import Wishlist from './pages/Wishlist'
import ReadingGoal from './pages/ReadingGoal'
import PageNotFound from './pages/PageNotFound'

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/mybooks' element={<MyBooks/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/dashboard' element={<ReadingGoal/>}/>
        <Route path='/*' element={<PageNotFound/>} />
      </Routes>
    </>

  )
}

export default App

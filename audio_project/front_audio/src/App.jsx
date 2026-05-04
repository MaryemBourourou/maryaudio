
import './App.css'
import Home from './pages/home'
import MyNavbar from './components/navbar'

import Foot from './components/footer'
import Treatments from './components/treatments'


function App() {
 

  return (
    <>
      <div> 
        <div className='overflow-x-hidden'>
        <MyNavbar/>
        </div>
        <div className='overflow-x-hidden'>
          <Home/>
     </div>
        <div className='overflow-x-hidden'> <Foot/></div>
        </div>
    </>
  )
}

export default App

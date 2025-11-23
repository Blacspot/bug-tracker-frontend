import Navbar from './Navbar/Navbar'
import Herom from './Hero/Hero'
import { About } from './About/About'
import { Footer } from './Footer/footer'
//import Programs from './Programs/Programs'
//import Title from './Title/Title'
//import About from './About/About'
//import Campus from './Campus/Campus'
//import Contact from './Contact/Contact'
//import Footer from './Footer/Footer'


const Home = () => {
  return (
     <div>
        <Navbar/>
        <Herom />
        <About />  
        <Footer />    
      
    
    </div>
  )
}

export default Home
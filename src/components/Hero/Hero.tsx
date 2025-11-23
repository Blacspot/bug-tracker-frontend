import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'
import { Link } from "react-router"

const Herom = () => {
  return (
    <div className='hero'>
       <div className='hero-text'>
         <h1> Streamline Software with Smart Bug Tracking </h1>
           <p>
              Report, track, and resolve software defects efficiently in a collaborative workspace
    
            </p>
            <p>
              Gain hands-on experience in managing issue lifecycles, applying Agile practices,
              and improving QA and development workflows — all in one platform.
            </p>
            <p>Ready to get started?</p>
            <Link to="/signup">
              <button className='btn'>
                Join Us <img src={dark_arrow} alt=""/>
              </button>
            </Link>
          </div>
          
              </div>
            )
}

export default Herom
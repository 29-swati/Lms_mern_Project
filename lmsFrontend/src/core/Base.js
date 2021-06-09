import React from 'react'
import Menu from './Menu'
import './core.css'
import {Link} from 'react-router-dom'
import {FaFacebook,FaLinkedin,FaMobileAlt,FaRegEnvelope,FaYoutube} from "react-icons/fa"
import {IconContext} from 'react-icons'
import logo from '../../src/Lets-Learn-Tech-Logo1-1.png'
import {isAuthenticated} from '../auth/helper/index'

const Base=({
    title="My Title",
    description="My description",
    className='',
    menuChildren,
    children
})=> {

    return (
        <div className='main'>
        <Menu>{menuChildren}</Menu>
        <div className="header">
            <h2 className='content bg-light'>{title}</h2>
            <h2 className='content'>{description}</h2>
        </div>
        <div className='middel'>
        <div className='middel-content ${classname}'>
        {children}
        </div>
        </div>
            <footer className='footer'>
                <div className='f-content'>
                    <div className='left-area'>
                        <img className='logo' src={logo} alt=''/>
                        LetsLearnTech provides Quality content at offardable pricing Home for programmers. 
                        Video Courses on latest tech in easy understandable language. 
                        <div>
                            <IconContext.Provider value={{color:'black', className:'icon'}}>
                                <a href='https://www.linkedin.com/in/swati-ubnare-a21548170/'>
                                    <FaLinkedin size={30} className='m-2'/>
                                </a>    
                                <a href='https://www.facebook.com/AndroidandTechSolutions/'>
                                    <FaFacebook size={30} className='m-2 icon' />
                                </a>
                                <a href='https://www.youtube.com/channel/UCqJ5Q-g2e2FDoxfY8_rLF6w?view_as=subscriber'>
                                    <FaYoutube size={30} className='m-2 icon'/>
                                </a>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className='right-area'>
                        <h4 className=''>Explore</h4>
                            <ul>
                                <li>
                                    <Link className='list' to='/'>Home</Link>
                                </li>
                                <li>
                                    <Link className='list' to='/about'>About</Link>
                                </li>
                                <li>
                                    <Link className='list' to='/testimonials'>Testimonials</Link>
                                </li>
                                <li>
                                    <Link className='list' to='/contact'>Contact</Link>
                                </li>
                            </ul>
                    </div>
                    <div className='right-area'>
                    <h4>Reach Us</h4>
                            <div className='icon'>
                                <FaMobileAlt size={20} className='icon m-2'/> +91 7999827299
                            </div>
                            <div className='icon'>
                                <FaRegEnvelope size={20} className='icon m-2'/> gauravubnare2@gmail.com
                            </div>
                    </div>
                </div>
            </footer>
        
        </div>
    )
}

export default Base;
import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './style/Navbar.module.css';
const Navbar = () => {
  return (
    <div className={styles.Navbar}>
        <NavLink className={styles.Logo} to="/">Home</NavLink>

    </div>
  )
}

export default Navbar
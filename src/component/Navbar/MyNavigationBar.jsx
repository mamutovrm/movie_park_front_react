import React from 'react';
import css from './MyNavigationBar.module.css';

const MyNavigationBar = () => {
    return <nav className={css.navbar}>
        <div className={css.item}>
            <a>Profile</a>
        </div>
        <div className={`${css.item} ${css.active}`}>
            <a>Messages</a>
        </div>
        <div className={css.item}>
            <a>News</a>
        </div>
        <div className={css.item}>
            <a>Music</a>
        </div>
        <div className={css.item}>
            <a>Settings</a>
        </div>
    </nav>
}

export default MyNavigationBar;
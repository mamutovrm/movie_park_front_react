import React from 'react';
import css from './MyFooter.module.css';

const MyFooter = () => {
    return <header className={css.footer}>
        <img src='https://www.freelogodesign.org/Content/img/logo-ex-7.png'/>
        <br/>
        <text className={css.text}>this is footer</text>
    </header>
}

export default MyFooter;
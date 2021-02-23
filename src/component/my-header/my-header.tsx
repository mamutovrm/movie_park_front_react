import React from 'react';
import css from './my-header.module.css';

const MyHeader = () => {
    return (
        <header className={css.header}>
            <br/>
            <text className={css.text}>this is header</text>
        </header>
    )
}

export default MyHeader;
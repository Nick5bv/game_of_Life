import React, { FC, DetailedHTMLProps, HTMLAttributes} from 'react'
import './Header.scss'

const Header: FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({children}) => {
    return (
        <div className={'header'}>
            <h1>
                <a className={'green-text'} href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target='_blanc'>
                    Conway's  Game of Life
                </a>
            </h1>
            <div className={'header-buttons'}>
                {children}
            </div>
        </div>
    );
};

export default Header

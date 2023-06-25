import { FC, ButtonHTMLAttributes } from 'react'
import './Button.scss'
import { ButtonTypes } from './ButtonTypes'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType: ButtonTypes
}

const Button: FC<ButtonProps> = ({ onClick, children, buttonType }) => {
    return (
        <button
            type={'button'}
            className={`btn btn-${buttonType || ButtonTypes.PRIMARY}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button


interface NBProps {
    children?: React.ReactNode;
    disabled?: boolean;
    selected?: boolean;
    value?: string;
    handleClick?: (value?: string) => void;
}

export default function ActionButton(props: NBProps): JSX.Element {
    const { children, selected = false, disabled = false, handleClick = () => { }, value } = props;

    const clickHandler = () => {
        if (value) {
            handleClick(value);
        } else {
            handleClick();
        }
    }

    return (
        <button
            onClick={() => clickHandler()}
            disabled={disabled}
            className={`${disabled && 'disabled'} ${selected && 'selected'} primary-mixin w-sm h-sm text-center justify-center items-center flex`}
            data-augmented-ui="tl-clip tr-clip-x br-clip bl-clip both"
        >
            <span className="cyberpunk">
                {children}
            </span>
        </button>
    )
}
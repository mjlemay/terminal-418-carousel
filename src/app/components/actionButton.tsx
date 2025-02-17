interface NBProps {
    children?: React.ReactNode;
    disabled?: boolean;
    selected?: boolean;
    handleClick?: () => void;
}

export default function ActionButton(props: NBProps): JSX.Element {
    const { children, selected = false, disabled = false, handleClick = () => { } } = props;

    return (
        <button
            onClick={() => handleClick()}
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
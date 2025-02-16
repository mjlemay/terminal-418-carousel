
interface NBProps {
    children?: React.ReactNode;
    selected?: boolean;
  }
  
  export default function NavButton(props:NBProps):JSX.Element {
    const { children, selected = false } = props;
  
    return (
        <button
            className={`${selected && 'selected'} primary-mixin w-full h-full text-center justify-center items-center flex`}
            data-augmented-ui="tl-clip tr-clip-x br-clip-x bl-clip both"
        >
            {children}
        </button>
    )
  }
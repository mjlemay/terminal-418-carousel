
interface WmProps {
    children?: React.ReactNode;
  }
  
  export default function Watermark(props:WmProps):JSX.Element {
    const { children } = props;
  
    return (
      <div className="absolute size-[150px] bottom-5 left-2 opacity-20">
        {children}
      </div>
    )
  }
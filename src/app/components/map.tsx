
interface  MapProps {
    children?: React.ReactNode;
  }
  
  export default function Map(props:MapProps):JSX.Element {
    const { children } = props;
  
    return (
      <div>
        <h2>Map</h2>
        {children}
        <p>Nulla vestibulum tempor elit id feugiat.</p>
      </div>
    )
  }
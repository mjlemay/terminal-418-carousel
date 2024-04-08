
interface  MapProps {
    children?: React.ReactNode;
  }
  
  export default function Map(props:MapProps):JSX.Element {
    const { children } = props;
  
    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
        <h2 className="cyberpunk">Map</h2>
        {children}
        <p>Nulla vestibulum tempor elit id feugiat.</p>
      </section>
    )
  }
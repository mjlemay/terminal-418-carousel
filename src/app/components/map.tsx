import Image from 'next/image'

interface  MapProps {
    children?: React.ReactNode;
  }
  
  export default function Map(props:MapProps):JSX.Element {
    const { children } = props;
  
    return (
      <section className="border-none flex h-full flex-col items-center justify-center">
        <h2 className="cyberpunk">Map</h2>
        <Image
        src="/images/NEO+24+Map+2.jpeg"
        width={2500}
        height={1406}
        alt="Neotropolis Map"
      />
      <hr className="cyberpunk" />
      </section>
    )
  }
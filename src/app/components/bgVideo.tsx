
interface BGVProps {
    video?: string;
  }
  
  export default function BgVideo(props:BGVProps):JSX.Element {
    const { video = "video/wave.mp4" } = props;
  
    return (
        <div className="absolute size-full overflow-hidden">
            <div className={`absolute w-[100vw] top-[0vh]`}>
                <video autoPlay muted loop className={`absolute w-[100vw] h-[100vh] object-cover`}>
                    <source src={video} type="video/mp4" />
                </video>
            </div>
        </div>
    )
  }
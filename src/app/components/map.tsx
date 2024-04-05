
interface  MapProps {
    children?: React.ReactNode;
  }
  
  export default function Map(props:MapProps):JSX.Element {
    const { children } = props;
  
    return (
      <div>
        {children}
        <p>
    With one suitcase as his domain, Arthur was desperately in need of armed henchmen ... for his keys to a kingdom were typewriter keys!
    </p><p>
I
</p><p>
There was three of us--I mean if you count Arthur. We split up to avoid attracting attention. Engdahl just came in over the big bridge, but I had Arthur with me so I had to come the long way around.
</p><p>
When I registered at the desk, I said I was from Chicago. You know how it is. If you say you're from Philadelphia, it's like saying you're from St. Louis or Detroit--I mean _nobody_ lives in Philadelphia any more. Shows how things change. A couple years ago, Philadelphia was all the fashion. But not now, and I wanted to make a good impression.
</p><p>
I even tipped the bellboy a hundred and fifty dollars. I said: "Do me a favor. I've got my baggage booby-trapped--"
</p>
      </div>
    )
  }
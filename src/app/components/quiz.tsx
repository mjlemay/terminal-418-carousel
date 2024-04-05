
interface QuizProps {
    children?: React.ReactNode;
  }
  
  export default function Quiz(props:QuizProps):JSX.Element {
    const { children } = props;
  
    return (
      <div>
        {children}
    <p>
    In the country of the blind, the one-eyed man, of course, is king. But how about a live wire, a smart businessman, in a civilization of 100% pure chumps?
    </p><p>
Some things had not changed. A potter's wheel was still a potter's wheel and clay was still clay. Efim Hawkins had built his shop near Goose Lake, which had a narrow band of good fat clay and a narrow beach of white sand. He fired three bottle-nosed kilns with willow charcoal from the wood lot. The wood lot was also useful for long walks while the kilns were cooling; if he let himself stay within sight of them, he would open them prematurely, impatient to see how some new shape or glaze had come through the fire, and--_ping!_--the new shape or glaze would be good for nothing but the shard pile back of his slip tanks.
</p><p>
A business conference was in full swing in his shop, a modest cube of brick, tile-roofed, as the Chicago-Los Angeles "rocket" thundered overhead--very noisy, very swept-back, very fiery jets, shaped as sleekly swift-looking as an airborne barracuda.
</p><p>
The buyer from Marshall Fields was turning over a black-glazed one liter carafe, nodding approval with his massive, handsome head. "This is real pretty," he told Hawkins and his own secretary, Gomez-Laplace. "This has got lots of what ya call real est'etic principles. Yeah, it is real pretty."
</p><p>
"How much?" the secretary asked the potter.
    </p>
      </div>
    )
  }
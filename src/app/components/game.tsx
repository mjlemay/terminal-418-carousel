
interface GameProps {
    children?: React.ReactNode;
  }
  
  export default function Game(props:GameProps):JSX.Element {
    const { children } = props;
  
    return (
      <div>
        {children}
    <h1>Chapter I</h1>
    <p>
Red and Slim found the two strange little animals the morning after they heard the thunder sounds. They knew that they could never show their new pets to their parents.
</p><p>
There was a spatter of pebbles against the window and the youngster stirred in his sleep. Another, and he was awake.
</p><p>
He sat up stiffly in bed. Seconds passed while he interpreted his strange surroundings. He wasn't in his own home, of course. This was out in the country. It was colder than it should be and there was green at the window.
</p><p>
"Slim!"
</p>
      </div>
    )
  }

interface GameProps {
    children?: React.ReactNode;
  }
  
  export default function Game(props:GameProps):JSX.Element {
    const { children } = props;
  
    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
                <h2 className="cyberpunk">Game</h2>
        {children}
    <h1 className="cyberpunk">Chapter I</h1>
    <p>Ut lacinia magna fringilla arcu rhoncus, quis lacinia leo auctor. Duis vestibulum nec sem sodales scelerisque. Nam congue, dui eget mattis scelerisque, nunc dolor accumsan diam, ac bibendum arcu magna quis augue. In condimentum efficitur sapien, quis volutpat lacus volutpat eu. Cras scelerisque aliquam sapien, commodo cursus libero tempor ac. Nulla facilisi. Donec vehicula erat at sem viverra fringilla. Curabitur neque tortor, ultricies at dui in, fermentum laoreet mauris. Mauris ex dolor, consequat id rutrum in, vulputate venenatis neque. Integer posuere justo enim. Ut sit amet neque semper, dignissim orci at, dictum nunc. Aliquam vel nisi lacus. Vestibulum varius lacus vitae odio ultrices pellentesque. Nunc commodo lobortis dolor at commodo. Donec vehicula egestas quam eget maximus. Morbi maximus vehicula gravida.
</p>
      </section>
    )
  }

interface QuizProps {
    children?: React.ReactNode;
  }
  
  export default function Quiz(props:QuizProps):JSX.Element {
    const { children } = props;
  
    return (
      <div>
        <h2>Quiz</h2>
        {children}
    <p>
    Praesent elementum, erat at rhoncus imperdiet, ex turpis laoreet tortor, vitae dictum lacus sem varius velit. Aliquam erat volutpat. Vestibulum aliquam nulla sed augue placerat, et maximus neque tempor. Donec at eros luctus, fermentum libero vitae, mattis justo. Vestibulum elit lorem, fermentum a mauris sed, hendrerit interdum libero. In hac habitasse platea dictumst. Phasellus malesuada sem sit amet risus ullamcorper, nec blandit felis dignissim. Quisque at semper sapien, a consectetur massa. In pharetra metus tortor, et dictum velit viverra vel. Phasellus blandit quis nisl vel dictum.
    </p>
      </div>
    )
  }
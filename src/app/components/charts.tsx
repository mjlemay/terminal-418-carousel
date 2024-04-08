
interface ChartProps {
    children?: React.ReactNode;
  }
  
  export default function Charts(props:ChartProps):JSX.Element {
    const { children } = props;
  
    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
                <h2 className="cyberpunk">Charts</h2>
        {children}
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium mauris faucibus purus mattis, at placerat metus congue. Maecenas vitae finibus lorem. In in enim sapien. Nullam aliquet mauris odio, non vestibulum dolor consequat luctus. Mauris auctor elit at est porta, sit amet tincidunt felis posuere. Cras ornare magna in efficitur scelerisque. Aliquam erat volutpat. Nulla vestibulum, orci ac molestie ornare, risus ipsum iaculis odio, eu interdum lorem nunc sit amet nulla.
</p>
</section>
    )
  }
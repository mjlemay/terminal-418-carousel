
interface ChartProps {
    children?: React.ReactNode;
  }
  
  export default function Charts(props:ChartProps):JSX.Element {
    const { children } = props;
  
    return (
      <div>
                <h2>Charts</h2>
        {children}
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium mauris faucibus purus mattis, at placerat metus congue. Maecenas vitae finibus lorem. In in enim sapien. Nullam aliquet mauris odio, non vestibulum dolor consequat luctus. Mauris auctor elit at est porta, sit amet tincidunt felis posuere. Cras ornare magna in efficitur scelerisque. Aliquam erat volutpat. Nulla vestibulum, orci ac molestie ornare, risus ipsum iaculis odio, eu interdum lorem nunc sit amet nulla.
</p><p>
Pellentesque sollicitudin orci nec elit mattis, luctus viverra risus porttitor. Nulla nec tellus vitae elit dapibus imperdiet eget ut nisl. Vivamus finibus purus in posuere ullamcorper. Aenean nec felis eget eros accumsan egestas viverra non tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate lacus ut maximus imperdiet. Aenean dui felis, sodales vitae egestas at, placerat vitae mauris. Vivamus tristique orci mattis, consectetur massa sed, condimentum metus. Nam erat arcu, suscipit et est sit amet, tincidunt porttitor odio. Morbi malesuada diam imperdiet orci commodo, sit amet mollis tellus commodo. Phasellus a aliquam purus, quis dapibus elit. Vivamus sed dui sapien. Cras augue diam, bibendum et velit nec, pretium egestas urna.</p>  
      </div>
    )
  }
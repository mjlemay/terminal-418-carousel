import Termial418 from './svgs/terminal418';
import Watermark from "./components/watermark";
import Carousel from "./components/carousel";
import Charts from "./components/charts";
import Game from "./components/game";
import Map from "./components/map";
import Summary from './components/summary';
import Recents from "./components/recents";
import Terminal418 from './svgs/terminal418';

export default function Home() {
  //changes for parameters go here
  return (
    <main>
      <Watermark>
        <Terminal418 />
      </Watermark>
      <Carousel>
        <Summary />
        <Charts />
        <Game />
        <Recents />
        <Map />
      </Carousel>
    </main>
  );
}

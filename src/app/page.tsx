import Carousel from "./components/carousel";
import Charts from "./components/charts";
import Game from "./components/game";
import Map from "./components/map";
import Quiz from "./components/quiz";

export default function Home() {
  //changes for parameters go here
  return (
    <main>
      <Carousel>
        <Map />
        <Charts />
        <Game />
        <Quiz />
      </Carousel>
    </main>
  );
}

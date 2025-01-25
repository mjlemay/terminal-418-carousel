'use client';

import Watermark from "./components/watermark";
import Carousel from "./components/carousel";
import Charts from "./components/charts";
import Game from "./components/game";
import Map from "./components/map";
import BgVideo from "./components/bgVideo";
import Summary from "./components/summary";
import Recents from "./components/recents";
import Terminal418 from "./svgs/terminal418";
import TouchPulse from "./components/touchPulse";

export default function Home() {
  return (
    <main>
      <BgVideo video="video/wave.mp4" />
      <Watermark>
        <Terminal418 />
      </Watermark>
      <Carousel>
        <Summary />
        <Charts />
        <Game />
        <Recents />
      </Carousel>
      <TouchPulse />
    </main>
  );
}

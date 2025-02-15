
import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "./lib/appContext";
import {
  AppProviderValues,
} from "./lib/types"; 
import BgVideo from "./components/bgVideo";
import Carousel from "./components/carousel";
import Charts from "./components/charts";
import Game from "./components/game";
import Recents from "./components/recents";
import Summary from "./components/summary";
import TouchPulse from "./components/touchPulse";
import Watermark from "./components/watermark";
import Terminal418 from "./svgs/terminal418";

export default function Main () {

      const { 
        state,
        getUser = () => {},
        getLogs = () => {},
      }: AppProviderValues = useContext(Context);
      const [loading, setLoading] = useState(true);

      const initData = useCallback(() => {
        getLogs();
      }, [getUser]);
    
      useEffect(() => {
        if (loading) {
          console.log('loading...');
          setLoading(false);
          initData();
        }
      }, [loading, initData]);

    return (
        <main>
        <BgVideo video="video/wave.mp4" />
        <Watermark>
            <Terminal418 />
        </Watermark>
        <Carousel>
            <Summary />
            <Charts scans={state.logs} />
            <Game />
            <Recents />
        </Carousel>
        <TouchPulse />
        </main>
    ); 
}

import { use, useCallback, useContext, useEffect, useState } from "react";
import { useRFIDNumber } from './hooks/useRFIDNumber';
import { Context } from "./lib/appContext";
import {
  AppProviderValues,
} from "./lib/types"; 
import BgVideo from "./components/bgVideo";
import Carousel from "./components/carousel";
import ScanSlide from "./components/scanSlide";
import Game from "./components/game";
import Summary from "./components/summary";
import TouchPulse from "./components/touchPulse";
import Watermark from "./components/watermark";
import Terminal418 from "./svgs/terminal418";
import Drawer  from "./components/drawer";
import UserDrawer from "./components/userDrawer";
import { userAgent } from "next/server";
import { set } from "lodash";
import { constrainedMemory } from "process";


interface NfcData {
  uid: string;
}


const  READ_WAIT = 20000;

export default function Main () {
      const { 
        state,
        createLog = () => {},
        getUser = () => {},
        getLogs = () => {},
        unSetUser = () => {},
      }: AppProviderValues = useContext(Context);
      const [loading, setLoading] = useState(true);
      const [readReady, setReadReady] = useState(true);
      const [nfcData, setNfcData] = useState<NfcData | null>(null);
      const [error, setError] = useState<string | null>(null);
      const [drawerOpen, setDrawerOpen] = useState(false);
      const rifdNumber = useRFIDNumber(readReady);
      const initData = useCallback(() => {
        getLogs();
      }, [getUser]);
      const { user } = state;
      const userId = user ? user.uid : null;
   
      const closeUserDrawer = () => {
        console.log('closeUserDrawer');
        setDrawerOpen(false);
        unSetUser();
      }

      useEffect(() => {
          if (userId && !drawerOpen){
              setDrawerOpen(true);
          }
      }, [userId, drawerOpen]);

      useEffect(() => {
        if (loading) {
          console.log('loading...');
          setLoading(false);
          initData();
        }
      }, [loading, initData]);


    useEffect(() => {
      if (rifdNumber.length >= 4 && !loading) {
          setLoading(true);
          createLog(rifdNumber);
          getUser(rifdNumber);
          setTimeout(() => {
              setReadReady(true);
              setLoading(false);
          }, READ_WAIT);
      }
    },[rifdNumber]);

    useEffect(() => {
      if (rifdNumber.length >= 4) {
          console.log('rifdNumber', rifdNumber);
      }
    },[rifdNumber]);

    // useEffect(() => {
    //   const ws = new WebSocket('ws://localhost:3000/api/nfc');
  
    //   ws.onopen = () => {
    //     console.log('WebSocket connection opened');
    //     setError(null); // Clear any previous errors
    //   };
  
    //   ws.onmessage = (event) => {
    //     const data: NfcData = JSON.parse(event.data);
    //     setNfcData(data);
    //     console.log('message data', data)
    //   };
  
    //   ws.onerror = (error) => {
    //     console.error('WebSocket error:', error);
    //     setError('Failed to connect to the WebSocket server.');
    //   };
  
    //   ws.onclose = () => {
    //     console.log('WebSocket connection closed');
    //     setError('WebSocket connection closed.');
    //   };
  
    //   return () => {
    //     ws.close();
    //   };
    // }, []);
    

    return (
      <>
        <main className="overflow-hidden">
          <BgVideo video="video/wave.mp4" />
          <Watermark>
              <Terminal418 />
          </Watermark>
          <Carousel>
              <Summary />
              <ScanSlide />
              <Game />
          </Carousel>
          <TouchPulse />
        </main>
        <Drawer isOpen={drawerOpen} onClose={() => closeUserDrawer()}>
          <UserDrawer />
        </Drawer>
      </>
    ); 
}

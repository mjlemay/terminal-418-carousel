
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
        getAllianceUsers = () => {},
        unSetUser = () => {},
      }: AppProviderValues = useContext(Context);
      const [loading, setLoading] = useState(true);
      const [readReady, setReadReady] = useState(true);
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [drawerSection, setDrawerSection] = useState('home');
      const rifdNumber = useRFIDNumber(readReady);
      const initData = useCallback(() => {
        getLogs();
        getAllianceUsers();
      }, [getUser]);
      const { user } = state;
      const userId = user ? user.uid : null;
   
      const closeUserDrawer = () => {
        setDrawerOpen(false);
        unSetUser();
      }

      const changeUserDrawer = (section:string) => {
        setDrawerSection(section);
        setDrawerOpen(true);
      }

      useEffect(() => {
          if (userId && !drawerOpen){
              setDrawerOpen(true);
          }
          if (!userId && drawerOpen){
              setDrawerOpen(false);

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
      if (rifdNumber.length >= 4 && !loading && rifdNumber !== userId) {
          unSetUser();
          setTimeout(() => {
          setLoading(true);
          createLog(rifdNumber);
          getUser(rifdNumber);
          }, 500);
          setTimeout(() => {
              setReadReady(true);
              setLoading(false);
          }, READ_WAIT);
      }
    },[rifdNumber]);

    useEffect(() => {
      if (user && typeof user?.meta?.alliance === 'undefined') {
        // setDrawerSection('sponsor');
      }
    }, [user]);

    
    return (
      <>
        <main className="overflow-hidden">
          <BgVideo video="video/wave.mp4" />
          <Watermark>
              <Terminal418 />
          </Watermark>
          <Carousel onDrawerSelect={changeUserDrawer} selectedDrawer={drawerSection}>
              <Summary />
              <ScanSlide />
              <Game />
          </Carousel>
          <TouchPulse />
        </main>
        <Drawer isOpen={drawerOpen} onClose={() => closeUserDrawer()} onDrawerSelect={changeUserDrawer}>
          <UserDrawer section={drawerSection} onDrawerSelect={changeUserDrawer} />
        </Drawer>
      </>
    ); 
}

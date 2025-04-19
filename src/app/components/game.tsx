'use client';

import { useEffect, useContext } from "react";
import { Context } from "../lib/appContext";
import { AppProviderValues } from "../lib/types";
import FactoryFloorGame from "./factoryFloorGame";
import StateBlockRow from "./statblockRow";
import Helix from "../svgs/helix";
import Endline from "../svgs/endline";
import Reboot from "../svgs/reboot";
import _ from "lodash";

let DEVICE_NAME = process.env.NEXT_PUBLIC_DEVICE_NAME || 'FLOOR LOCATION NOT FOUND';

export default function Game(): JSX.Element {
  const {
    state,
  }: AppProviderValues = useContext(Context);
  const { factoryTiles } = state;
  const totalTiles = factoryTiles ? _.size(factoryTiles) : 100;
  const isHelix = (tile:any) => {
    return tile.meta.includes('Helix Industries');
  }
  const isEndline = (tile:any) => {
    return tile.meta.includes('Endline Solutions');
  }
  const isReboot = (tile:any) => {
    return tile.meta.includes('Reboot Syndicate');
  }
  const endlineTiles = factoryTiles ? factoryTiles.filter(isEndline) : []; 
  const helixTiles = factoryTiles ? factoryTiles.filter(isHelix) : [];
  const rebootTiles = factoryTiles ? factoryTiles.filter(isReboot) : [];
  const endlineCount = endlineTiles ? _.size(endlineTiles) : 0;
  const helixCount = helixTiles ? _.size(helixTiles) : 0;
  const rebootCount = rebootTiles ? _.size(rebootTiles) : 0;

  useEffect(() => {
    console.log('factoryTiles', factoryTiles);
  }, [factoryTiles])

  return (
    <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
      <div className="absolute p4">
        <FactoryFloorGame />
        <div className="absolute top-10 left-10 backdrop-blur-sm p-4 "
            data-augmented-ui="tl-clip tr-clip-x br-clip-x bl-clip both"
        >
          <div><h2>{DEVICE_NAME}</h2></div>
          <div className="flex flex-col">
            <div>
              <StateBlockRow
                icon={<Helix />}
                value={helixCount}
                goal={totalTiles}
              />
            </div>
            <div>
              <StateBlockRow
                icon={<Endline />}
                value={endlineCount}
                goal={totalTiles}
              />
            </div>
            <div>
              <StateBlockRow
                icon={<Reboot />}
                value={rebootCount}
                goal={totalTiles}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
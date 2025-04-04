'use client';
import { countBy } from "lodash";
import Avatar from "./avatar";
import { ResponsiveContainer, Label, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useContext } from "react";
import { Context } from "../lib/appContext";
import { AppProviderValues } from "../lib/types";
import FactoryFloorGame from "./factoryFloorGame";

const colors = ["#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72", "#c1ff72"];

export default function Game():JSX.Element {
  const { 
    state
  }: AppProviderValues = useContext(Context);
    

    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
          <h2 className="cyberpunk mb-2">Factory</h2>
          <div className="absolute">
            <FactoryFloorGame />
         </div>
      </section>
    )
  }
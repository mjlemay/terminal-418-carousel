
import { Children, cloneElement } from 'react';

type VSProps = {
    title: string;
    children?: React.ReactNode;
    selectedIndex?: number;
    clickHandler?: (num:number) => void;
}

export default function ValueSelectorRow(props:VSProps):JSX.Element {
    const { title = '', clickHandler = () => {}, children = null, selectedIndex = 0 } = props;

    const selections = Children.map(children, (child:any, index) => {
        const proppedChild = cloneElement(child);
        const selected = selectedIndex === index;
        return (<div
            key={index}
            onClick={()=> clickHandler(index)}
            className={`${selected ? 'border-green' : 'border-white'} border-8 rounded-md p-2`}
        >
            {proppedChild}
        </div>);
    })

    return (
    <>
       {title && <h3 className="cyberpunk">{title}</h3>}
        <div className="flex flex-row justify-between items-center gap-2 p-4">
            {selections}      
        </div>
    </>
    );
}
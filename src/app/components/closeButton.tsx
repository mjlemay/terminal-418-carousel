import { AppProviderValues } from '../lib/types';
import { useContext } from 'react';
import { Context } from '../lib/appContext';

interface NBProps {
    children?: React.ReactNode;
    selected?: boolean;
  }
  
  export default function CloseButton(props:NBProps):JSX.Element {
    const { children, selected = false } = props;
    const {  unSetUser = () => {} }: AppProviderValues = useContext(Context);
  
    return (
        <button
            onClick={()=> unSetUser()}
            className={`${selected && 'selected'} primary-mixin w-sm h-sm text-center justify-center items-center flex`}
            data-augmented-ui="tl-clip tr-clip-x br-clip bl-clip both"
        ><span className="cyberpunk">
                TERMINATE CONNECTION
            </span>
        </button>
    )
  }
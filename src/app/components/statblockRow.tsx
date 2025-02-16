import { ReactHTMLElement } from "react"

type SBProps = {
    icon: React.ReactNode;
    title: string;
    value: number;
    goal?: number;
}

export default function StateBlockRow(props:SBProps):JSX.Element {
    const { icon = null, title = '', value = 0, goal = null } = props;
    return (
    <>
       {title && <h3 className="cyberpunk">{title}</h3>}
            <div className="flex flex-row justify-between items-center">
                {icon && <div className="basis-1/3">
                    <div className="max-h-[12rem] max-w-[12rem]">
                        {icon}
                    </div>
                </div>
            }   
            <div className={`${icon && 'basis-2/3'}`}>
                <span className="text-[6rem]">{value}</span>
                {goal && <span className="text-[5rem]"> / {goal}</span>}
            </div>
        </div>
    </>
    );
}
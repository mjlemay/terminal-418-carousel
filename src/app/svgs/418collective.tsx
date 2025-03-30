interface SvgProps {
    width?: string | number,
    height?: string | number,
}

export default function FourEighteenCollective(props:SvgProps) {
    const { width, height} = props;
    const purple = { fill: '#98509f' };
    const darkPurple = { fill: '#6851A2' };
    const black = { fill: '#2C1535' };

    return (
        <svg  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="w-full h-auto" style={{minWidth:width || '', minHeight:height || ''}}>
          <path style={black} d="M250.75,60.56v-9.24c0-4.31-2.52-7.82-6.88-9.62-2.68-1.12-6.13-1.67-10.53-1.67h-20.02c-4.07,0-7.33.47-9.97,1.45v-1.45h-80.12v-1.8h-8.65l1.09-5.53h-48.45l4.05,20.45-7.56,33.69v.25l-13.56-2.88v25.16l40.27,8.54,41.92-8.89v-4.01h18.29c1.17.13,2.34.13,3.5,0h73.03c.82.13,1.68.13,2.5,0h20.65v-24c.28-.93.43-1.91.43-2.91v-9.46c0-.98-.15-1.95-.43-2.87v-2.42c.28-.89.43-1.83.43-2.78Z"/>
          <g>
            <polygon style={purple} points="151.81 60.81 140.18 60.81 140.18 46.46 125.46 46.46 125.46 67.57 151.81 67.57 151.81 82.45 166.53 82.45 166.53 46.46 151.81 46.46 151.81 60.81"/>
            <polygon style={purple} points="172.51 53.1 181.72 53.1 181.72 82.45 196.22 82.45 196.22 46.46 172.51 46.46 172.51 53.1"/>
            <path style={purple} d="M240.85,47.61c-1.83-.77-4.49-1.15-7.95-1.15h-20.02c-3.45,0-6.09.38-7.95,1.15-1.83.77-2.77,1.92-2.77,3.45v9.24c0,.98.51,1.81,1.55,2.47,1.04.66,2.43,1.13,4.2,1.41-3.83.62-5.75,2-5.75,4.2v9.46c0,1.53.92,2.68,2.77,3.45s4.49,1.15,7.95,1.15h20.02c3.45,0,6.09-.38,7.95-1.15s2.77-1.92,2.77-3.45v-9.46c0-2.17-1.92-3.58-5.75-4.2,1.77-.28,3.15-.75,4.2-1.41,1.04-.66,1.56-1.49,1.56-2.47v-9.24c0-1.53-.92-2.68-2.77-3.45ZM228.9,75.81h-11.97v-8.22h11.97v8.22ZM228.9,60.88h-11.97v-7.77h11.97v7.77Z"/>
          </g>
          <path style={purple} d="M77.42,54.1l-7.45,33.21c0,2.51,9.42,4.55,21.05,4.55s21.05-2.04,21.05-4.55l-7.45-33.21h-27.19Z"/>
          <polygon style={purple} points="106 44.65 107.09 39.12 74.93 39.12 77.42 51.68 104.61 51.68 105.21 48.65 111.09 48.65 111.09 60.87 116.11 60.87 116.11 44.65 106 44.65"/>
          <g>
            <path style={darkPurple} d="M140.1,98.05c-2.87,0-3.58-1.91-3.58-4.31s.7-4.28,3.64-4.28h3.33v.93h-2.95c-2.15,0-2.83,1.02-2.83,3.35s.66,3.37,2.77,3.37h3.13v.93h-3.51Z"/>
            <path style={darkPurple} d="M156.22,93.76c0,3.29-1.12,4.39-4.28,4.39s-4.28-1.1-4.28-4.39,1.14-4.39,4.28-4.39,4.28,1.1,4.28,4.39ZM151.94,97.22c2.44,0,3.09-.86,3.09-3.46s-.65-3.46-3.09-3.46-3.09.87-3.09,3.46.65,3.46,3.09,3.46Z"/>
            <path style={darkPurple} d="M162.34,98.05c-.63,0-1.09-.25-1.09-1.03v-7.56h1.14v7.14c0,.38.12.52.54.52h4.76v.93h-5.35Z"/>
            <path style={darkPurple} d="M173.26,98.05c-.63,0-1.09-.25-1.09-1.03v-7.56h1.14v7.14c0,.38.12.52.54.52h4.76v.93h-5.35Z"/>
            <path style={darkPurple} d="M184.29,98.05c-.75,0-1.2-.36-1.2-1.21v-6.16c0-.92.45-1.21,1.2-1.21h5.31v.93h-4.81c-.48,0-.56.15-.56.58v2.22h5.25v.93h-5.25v2.4c0,.43.09.59.56.59h4.86v.93h-5.36Z"/>
            <path style={darkPurple} d="M197.9,98.05c-2.87,0-3.58-1.91-3.58-4.31s.7-4.28,3.64-4.28h3.33v.93h-2.95c-2.15,0-2.83,1.02-2.83,3.35s.66,3.37,2.77,3.37h3.13v.93h-3.51Z"/>
            <path style={darkPurple} d="M209.11,98.05v-7.66h-3.47v-.93h8.09v.93h-3.47v7.66h-1.14Z"/>
            <path style={darkPurple} d="M218.2,98.05v-8.59h1.14v8.59h-1.14Z"/>
            <path style={darkPurple} d="M227.78,96.85c.04.11.11.18.2.18s.15-.07.2-.18l2.8-7.39h1.25l-3.18,7.94c-.15.36-.39.75-1.07.75s-.93-.39-1.07-.75l-3.17-7.94h1.25l2.79,7.39Z"/>
            <path style={darkPurple} d="M237.83,98.05c-.75,0-1.2-.36-1.2-1.21v-6.16c0-.92.45-1.21,1.2-1.21h5.31v.93h-4.81c-.48,0-.56.15-.56.58v2.22h5.25v.93h-5.25v2.4c0,.43.09.59.56.59h4.86v.93h-5.36Z"/>
          </g>
          <path style={darkPurple} d="M123.61,92.19l-33.63,7.13-33.58-7.12v11.48l33.58,7.12,33.63-7.13,1.59-.34v-11.48l-1.59.34"/>
          <path  style={black} d="M80.97,59.03l-5.51,24.54c0,1.86,6.96,3.36,15.56,3.36s15.56-1.5,15.56-3.36l-5.51-24.54h-20.1Z"/>
        </svg>
    );
}
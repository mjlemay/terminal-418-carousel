import { useMemo } from 'react';
import Image from 'next/image';
import { createAvatar, schema } from '@dicebear/core';
import { rings } from '@dicebear/collection';

interface AvatarProps {
    seed?: string | null;
    size?: number;
    style?: any;
}
  
export default function Avatar(props:AvatarProps):JSX.Element {
  const { seed = 'me', size = 100} = props;
  const cleanString = seed+'';
  const hasSeed = cleanString.length > 1 && seed !== null;

  const avatar = useMemo(() => {
    const options: any = {
        size,
        seed:cleanString,
        baseColor:["1E1E1E","41214E","705d2e","32755e","5b44c9","b957ce","ff0066","d1f7ff","ff9760"],
      };

    return createAvatar(rings, {...options}).toDataUriSync();
  }, [seed, size]);

  return (
    <div className={`avatar opacity-95 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 ${hasSeed ? 'animate-pulse' : 'grayscale-[100%]'}`}>
        <Image className={`saturate-200 ${hasSeed && 'animate-spin-slow'}`} src={avatar} width={size} height={size} alt="Avatar" />
    </div>
    );
};
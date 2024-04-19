import { useMemo } from 'react';
import Image from 'next/image';
import { createAvatar, schema } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

interface AvatarProps {
    seed?: string;
    size?: number;
}
  
export default function Avatar(props:AvatarProps):JSX.Element {
    const { seed = 'me', size = 100} = props;

  const avatar = useMemo(() => {
    const options: any = {
        size,
        seed,
        baseColor:["fa66f7","c1ff72","00e6df","E02A64","5b44c9","b957ce","ff0066","d1f7ff","ff9760"],
        backgroundColor: ["1E1E1E","41214E", "705d2e", "32755e", "01012b"],
        backgroundType: ["gradientLinear","solid"],
      };

    return createAvatar(bottts, {...options}).toDataUriSync();
  }, [seed, size]);

  return (
    <div className="avatar">
        <Image className="saturate-200" src={avatar} width={size} height={size} alt="Avatar" />
    </div>
    );
};
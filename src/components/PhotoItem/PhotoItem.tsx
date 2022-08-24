import { useEffect, useState } from 'react';
import { Photo } from '../../types/photo';
import * as C from './styles';

interface Props {
    item: Photo;
    onCheck: (name: string, checked: boolean) => void;
}

export const PhotoItem = ({ item, onCheck }: Props) => {
    const [isChecked, setIsChecked]= useState<boolean>(item.remove);

    useEffect(()=>{
        setIsChecked(item.remove);
    },[item.remove]);

    return (
        <C.Container>
            <input type="checkbox" checked={isChecked} onChange={(e)=> onCheck(item.name, e.target.checked)} />
            <img src={item.url} alt={item.name} />
            {item.name}
        </C.Container>
    );
}
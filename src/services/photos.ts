import { Photo } from "../types/photo";
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as createId } from "uuid";

export const getAll = async () => {
    let list: Photo[] = [];

    const imagesFolder = ref(storage, 'images'); // cria ref de onde vem os dados
    const photoList = await listAll(imagesFolder); // pega o que tiver na ref

    for (let i in photoList.items) {
        let photoUrl = await getDownloadURL(photoList.items[i]); // gera a url

        list.push({
            name: photoList.items[i].name,
            url: photoUrl,
            remove: false
        });
    }

    return list;
}
//to use the 'multiples' attr, it is necessary to refactor this function to configure each selected image as an object
export const insert = async (file: File) => {
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {

        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`);

        let upload = await uploadBytes(newFile, file);
        let photoUrl = await getDownloadURL(upload.ref);

        return { name: upload.ref.name, url: photoUrl, remove: false } as Photo;
    } else {
        return new Error('Tipo de arquivo não permitido.');
    }
}

export const deleteImage = async (nameFile: string) => {
    let file = ref(storage, `images/${nameFile}`);

    await deleteObject(file);
}
import { FormEvent, useEffect, useRef, useState } from 'react';
import * as C from './App.styles';
import { PhotoItem } from './components/PhotoItem/PhotoItem';
import * as Photos from './services/photos';
import { Photo } from './types/photo';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const fileField = useRef<any>(null);
  const [inputName, setInputName] = useState('Selecionar imagens');

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    }

    getPhotos();
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanFileInput = (ev: any) => {
      ev.target[0].value = null
    }

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      setUploading(true);
      let result = await Photos.insert(file);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
        cleanFileInput(e);
      }
    }
  };

  const handleRemoveStatus = (name: string, checked: boolean) => {
    let newList = [...photos];

    if (name) {
      newList.map((item, index) => {
        if (item.name === name) {
          newList[index].remove = checked;
        }
      });
    } else {
      newList.map((_, index) => {
        newList[index].remove = checked;
      });
    }

    setPhotos(newList);
  };

  const deleteHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let toRemove = ([...photos].filter(photo => photo.remove));

    if (toRemove.length) {
      if (confirm(`Deseja deletar ${toRemove.length} ${toRemove.length > 1 ? 'imagens' : 'imagem'}?`)) {
        try {
          toRemove.map(async (item) => {
            await Photos.deleteImage(item.name);
          });
          setPhotos([...photos].filter(photo => !photo.remove));
        } catch {
          alert('Tente Novamente');
        }
      }
    }
  };

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <label>
            <input type="file" name='image' ref={fileField}
              onChange={() => setInputName(fileField.current.files[0].name)}
            />
            <span>{inputName}</span>
            <input type="submit" value="Enviar" onClick={() => setInputName('Selecionar imagens')} />
          </label>
          {uploading && 'Enviando...'}
          <label>
            <input type="checkbox" onChange={(e) => handleRemoveStatus('', e.target.checked)} />
            <button onClick={deleteHandler}>Deletar</button>
          </label>
        </C.UploadForm>

        {loading &&
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <C.PhotoList>
            {photos.map((item, index) =>
              <PhotoItem key={index} item={item} onCheck={handleRemoveStatus} />
            )}
          </C.PhotoList>
        }

        {!loading && photos.length === 0 &&
          <C.ScreenWarning>
            <div className="emoji">😔</div>
            <div>Não há fotos cadastradas</div>
          </C.ScreenWarning>
        }
      </C.Area>
    </C.Container>
  );
}

export default App;
'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { createContext, useContext, useEffect, useId, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import { cn, getImageErrorDescription, validateImage } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BlobImage } from './BlobImage';

const MultiImagesUploadContext = createContext(null);

const useMultiImagesUpload = () => {
  const context = useContext(MultiImagesUploadContext);
  if (!context) {
    throw new Error('use useMultiImagesUpload witin a MultiImagesUpload.');
  }

  return context;
};

const MulitImagesUpload = ({
  columns = 5,
  maxImages = 5,
  localImages = [],
  onChange,
  className,
  children,
}) => {
  const [images, setImages] = useState(localImages);

  // biome-ignore lint/correctness/useExhaustiveDependencies: not passing onchange in dependencies because it is causing infinite loop
  useEffect(() => {
    if (images.length) {
      onChange?.(images);
    }
  }, [images]);

  const contextValue = {
    columns,
    maxImages,
    onChange,
    images,
    setImages,
  };

  return (
    <MultiImagesUploadContext.Provider value={contextValue}>
      <div
        style={{
          gridTemplateColumns: `repeat(${columns},1fr)`,
        }}
        className={cn('grid gap-2', className)}
      >
        {children}
      </div>
    </MultiImagesUploadContext.Provider>
  );
};

const MultiImagesUploadInput = ({ className, rules }) => {
  const { columns, images, maxImages, setImages } = useMultiImagesUpload();
  const inputId = useId();

  const handleInputChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const results = await Promise.allSettled(
      files.map((file) => validateImage(file, rules))
    );

    const validImages = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    const errorImages = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason);

    if (errorImages.length) {
      const title =
        errorImages.length > 1 ? 'Some images were skipped.' : 'Image skipped';

      const description = getImageErrorDescription(errorImages, rules);

      errorToast({
        title,
        description,
      });
    }

    if (validImages.length) {
      const newFiles = validImages;

      setImages((prev) => {
        const next = [...prev, ...newFiles].slice(0, maxImages);
        return next;
      });
    }
  };

  let colStart;

  if (!images.length) {
    colStart = 1;
  } else {
    if (images.length % columns === 0) {
      colStart = 1;
    } else {
      const itemsInLastRow =
        images.length % columns === 0 ? columns : images.length % columns;

      colStart = itemsInLastRow + 1;
    }
  }

  if (images.length >= maxImages) {
    return null;
  }

  return (
    <div
      style={{
        gridColumn: `${colStart} / ${columns + 1}`,
      }}
      className={cn(
        'relative border overflow-hidden border-[rgba(213,215,218,1)] rounded-md h-32',
        className
      )}
    >
      <Label htmlFor={inputId}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <div className='size-10 rounded-md border border-[rgba(213,215,218,1)] flex items-center justify-center'>
              <PlusIcon className='text-gray-700' />
            </div>
            <p className='font-semibold text-brand-700 text-sm mt-2 mb-1'>
              Add Image
            </p>
            <p className='text-sm text-gray-600 text-center'>
              or drag and drop
            </p>
          </div>
        </div>
      </Label>
      <Input
        id={inputId}
        type={'file'}
        accept='image/png, image/jpeg, image/jpg, image/webp'
        multiple
        className={'opacity-0 disabled:opacity-0'}
        onChange={(e) => {
          handleInputChange(e);
          e.target.value = null; // Clear the input's value to allow re-selection of the same file
        }}
        disabled={images.length >= maxImages}
      />
    </div>
  );
};

const MultiImagesPreview = ({ className }) => {
  const { images, setImages } = useMultiImagesUpload();

  if (!images.length) {
    return null;
  }

  return (
    <>
      {images.map((image, idx) => {
        const handleRemoveImage = () => {
          const filteredImages = images.filter(({ id }) => id !== image.id);

          setImages(filteredImages);
        };

        return (
          <div
            key={idx}
            className={cn(
              'h-32 rounded-md relative overflow-hidden border border-border',
              className
            )}
          >
            <BlobImage
              file={image.file}
              fallbackUrl={image.url}
              alt={`image ${idx + 1}`}
              width={50}
              height={50}
              className='size-full object-cover'
            />
            <button
              onClick={handleRemoveImage}
              className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer'
            >
              <XIcon strokeWidth={1.5} size={16} />
            </button>
          </div>
        );
      })}
    </>
  );
};

function errorToast({ title, description }) {
  return sonnerToast.custom((id) => (
    <ErrorToast id={id} title={title} description={description} />
  ));
}

function ErrorToast({ id, title, description }) {
  return (
    <div className='flex w-full max-w-[360px] rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5'>
      <div className='flex-1'>
        <p className='text-sm font-semibold text-red-600'>{title}</p>
        <p className='mt-1 text-sm text-gray-600'>{description}</p>
      </div>

      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={() => sonnerToast.dismiss(id)}
        className='ml-4 size-4'
      >
        <XIcon size={16} className='text-gray-500' />
      </Button>
    </div>
  );
}

export { MulitImagesUpload, MultiImagesPreview, MultiImagesUploadInput };

import { PlusIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { ALLOWED_IMAGE_TYPES } from '@/constants/constants';

export default function SingleImageUpload({ onChange }) {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // ❌ reject invalid formats BEFORE preview
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        'Invalid image format. Only PNG, JPG, JPEG, and WEBP are allowed.'
      );

      // reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);

    if (onChange) onChange(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) onChange(null);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className='w-full'
    >
      {!image ? (
        <div className='flex flex-col items-center justify-center border border-gray-200 rounded-lg px-6 py-6 bg-white cursor-pointer hover:border-gray-300 transition'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/png,image/jpeg,image/jpg,image/webp'
            onChange={handleImageUpload}
            className='hidden'
            id='imageUpload'
          />

          <Label htmlFor='imageUpload' className='text-center cursor-pointer'>
            <span className='inline-flex items-center justify-center shadow-sm rounded-md p-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'>
              <PlusIcon size={20} />
            </span>

            <p className='mt-3 text-sm font-semibold text-brand-700'>
              Add Image
            </p>
            <p className='text-sm text-gray-500'>or drag and drop</p>
          </Label>
        </div>
      ) : (
        <div className='relative w-36 h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50'>
          {/** biome-ignore lint/performance/noImgElement: <explanation> */}
          <img
            src={image}
            alt='Preview'
            className='w-full h-full object-cover'
          />
          <button
            type='button'
            onClick={removeImage}
            className='absolute top-2 right-2 bg-black/60 hover:bg-black text-white rounded-full p-1 border-white border'
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

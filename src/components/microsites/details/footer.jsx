import { Button } from '../../ui/button';

export const MicrositeDetailsFooter = ({
  onCancel,
  onSave,
  isSaving,
  hasDirtyChanges,
}) => {
  return (
    <div className='py-4 flex items-center justify-center bg-white border-t shrink-0'>
      <div className='max-w-160 w-full flex items-center justify-end gap-3 px-6'>
        <Button variant={'outline'} onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant={'primary'}
          className={'min-w-30'}
          onClick={onSave}
          disabled={isSaving || !hasDirtyChanges}
        >
          {isSaving ? 'Saving...' : 'Publish Microsite'}
        </Button>
      </div>
    </div>
  );
};

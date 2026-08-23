export const ReportsHeader = () => {
  return (
    <div className='px-6 py-5 bg-white border-b border-border flex items-center justify-between shrink-0'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Reports</h1>
        <p className='text-sm text-gray-600'>An overview of all your data</p>
      </div>
      {/* <Button variant={'primary'} asChild>
        <Link href={'/location-create'}>
          <PlusIcon size={20} className='text-[#97CDF9]' />
          <span>Add Locations</span>
        </Link>
      </Button> */}
    </div>
  );
};

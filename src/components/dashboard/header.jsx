export const DashboardHeader = () => {
  return (
    <div className='px-6 py-5 bg-white border-b border-border flex items-center justify-between shrink-0'>
      <div>
        <h1 className='text-lg font-semibold font-body text-gray-900'>
          Dashboard
        </h1>
        <p className='text-sm text-gray-600'>An overview of all your data</p>
      </div>
      {/* <Badge
        variant={'warning'}
        className={
          'border-warning-200 bg-warning-50 pr-1 pl-3 py-1 gap-2 self-start'
        }
      >
        Audit Score
        <Badge variant={'warning'} className={'border-warning-200 bg-white'}>
          40% Complete
        </Badge>
      </Badge> */}
    </div>
  );
};

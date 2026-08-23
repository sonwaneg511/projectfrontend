import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export const DashboardTabs = ({ value, setValue, variant = 'dashboard' }) => {
  const dashboard_list = [
    { label: 'Locations', value: '#locations' },
    { label: 'Campaigns', value: '#campaigns' },
    { label: 'Reviews', value: '#reviews' },
    {
      label: 'Posts',
      value: '#posts',
    },
    { label: 'Google Business Insights', value: '#google-business-insights' },
    // { label: 'Social Media Insights', value: '#social-media-insights' },
  ];

  const report_list = [
    { label: 'Reviews', value: '#reviews' },
    {
      label: 'Posts',
      value: '#posts',
    },
    { label: 'Campaign Reports', value: '#campaigns' },
    {
      label: 'Locations',
      value: '#locations',
    },
    {
      label: 'Google Business Insights',
      value: '#google-business-insights',
    },
  ];

  const Module_list = variant === 'dashboard' ? dashboard_list : report_list;

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList className={'p-1 h-auto'}>
        {Module_list.map((tab) => {
          return (
            <TabsTrigger
              key={tab.label}
              value={tab.value}
              className={
                'h-9 border-none data-[state=active]:ring-1 data-[state=active]:ring-gray-300 data-[state=active]:text-gray-700'
              }
              asChild
            >
              <Link href={tab.value}>{tab.label}</Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

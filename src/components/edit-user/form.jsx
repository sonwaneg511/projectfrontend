'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  CheckIcon,
  ChevronDownIcon,
  CircleMinusIcon,
  LayersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/context/auth.context';
import { useGetEditUserDetails } from '@/hooks/queries/users';
import { cn } from '@/lib/utils';
import { DataTableWrapper } from '../common/data-table/data-table';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorMessage } from '../ui/error-message';
import { LabelInputContainer, labelVariants } from '../ui/label';
import { MultiSelect } from '../ui/multi-select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const EditUserContext = createContext(null);

const useEditUserForm = () => {
  const context = useContext(EditUserContext);
  if (!context) {
    throw new Error('use useEditUserContext within a EditUserProvider.');
  }

  return context;
};

const EditUserProvider = ({ children }) => {
  const { userDetails } = useAuth();

  const { emailId } = useParams();
  const decodedEmailId = decodeURIComponent(emailId);

  const [formData, setFormData] = useState({
    features: [],
    locations: [],
  });
  const [validationErrors, setValidationErrors] = useState({
    features: '',
    locations: '',
  });

  const currentUserParams = {
    userId: userDetails?.user_id,
    clientId: userDetails?.clientId,
  };

  const editUserParams = {
    userId: decodedEmailId,
    clientId: userDetails?.clientId,
  };

  const results = useGetEditUserDetails({ currentUserParams, editUserParams });

  const isLoading = results.some((result) => result.isLoading);
  const currentUserDetails = results[0].data || null;
  const editUserDetails = results[1].data || null;
  const editUserDetailsError = results[1].error?.response?.data;

  const userNotFound =
    editUserDetailsError?.status === 400 &&
    editUserDetailsError?.message === 'User not found';

  const contextValue = {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    currentUserDetails,
    editUserDetails,
    isLoading,
    userNotFound,
  };

  useEffect(() => {
    if (!isLoading && editUserDetails && currentUserDetails) {
      const roles = editUserDetails?.modules;
      const loggedInUserRoles = currentUserDetails?.modules;

      const hasSameRoles =
        roles.length === loggedInUserRoles.length &&
        loggedInUserRoles.every((role) => roles.includes(role));

      if (hasSameRoles) {
        roles.push('ADMIN');
      }

      const dealerIds = editUserDetails?.view_dealer_details_response_list.map(
        (location) => location.dealer_id
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        features: roles,
        locations: dealerIds,
      }));
    }
  }, [isLoading, editUserDetails, currentUserDetails]);

  return (
    <EditUserContext.Provider value={contextValue}>
      {children}
    </EditUserContext.Provider>
  );
};

const FEATURES = [
  // {
  //   title: 'Location Management',
  //   description:
  //     'Manage all your locations, optimize routes and track performance metrics.',
  //   value: 'location',
  //   icon: LayersIcon,
  // },
  {
    title: 'Posts',
    description:
      'Create engaging content, schedule posts and analyze audience engagement.',
    value: 'POSTS',
    icon: LayersIcon,
  },
  {
    title: 'Reviews',
    description:
      'Monitor reviews, response to feedback and improve your online repuration.',
    value: 'REVIEWS',
    icon: LayersIcon,
  },
  {
    title: 'Campaign Management',
    description: 'Plan campaigns, set budgets and measure ROI with precision.',
    value: 'CAMPAIGNS',
    icon: LayersIcon,
  },
];

const ADMIN_FEATURE = {
  title: 'Admin',
  description: 'Giving all module access to this user.',
  value: 'ADMIN',
  icon: LayersIcon,
};

const EditUserForm = () => {
  const {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    currentUserDetails,
    editUserDetails,
    isLoading,
    userNotFound,
  } = useEditUserForm();

  let filteredFeatures = [];

  if (!isLoading && currentUserDetails) {
    filteredFeatures = FEATURES.filter((feature) =>
      currentUserDetails?.modules.includes(feature.value)
    );
  }

  const isEditingAdmin =
    currentUserDetails?.roles === 'ADMIN' && editUserDetails?.roles === 'ADMIN';

  const locationOptions = useMemo(() => {
    return (
      currentUserDetails?.view_dealer_details_response_list?.map((location) => {
        const isDisabled =
          editUserDetails?.view_dealer_details_response_list?.find(
            (editUserLocation) =>
              editUserLocation.dealer_id === location.dealer_id
          );

        return {
          label: location.dealer_name,
          value: location.dealer_id,
          state: location.state,
          disabled: isEditingAdmin ? !!isDisabled : false,
        };
      }) ?? []
    );
  }, [currentUserDetails, editUserDetails, isEditingAdmin]);

  const selectedLocations = useMemo(() => {
    return (
      currentUserDetails?.view_dealer_details_response_list
        ?.filter((location) => formData.locations.includes(location.dealer_id))
        .map((location) => {
          const isDisabled =
            editUserDetails?.view_dealer_details_response_list?.find(
              (editUserLocation) =>
                editUserLocation.dealer_id === location.dealer_id
            );

          return {
            ...location,
            disabled: isEditingAdmin ? !!isDisabled : false,
          };
        }) ?? []
    );
  }, [formData.locations, currentUserDetails, editUserDetails, isEditingAdmin]);

  return (
    <div className='flex-1 overflow-y-auto flex flex-col gap-4 items-center py-4'>
      {isLoading ? (
        <div className='max-w-160 w-full rounded-xl h-full bg-neutral-100 animate-pulse' />
      ) : userNotFound ? (
        <div className={'size-full flex items-center justify-center'}>
          <div className='flex flex-col gap-2'>
            <h3 className='text-4xl font-bold tracking-tighter text-gray-900'>
              User not found.
            </h3>
            <Button variant={'primary'} asChild>
              <Link prefetch={false} href={'/create-user'}>
                Create new user
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <Card className={'max-w-160 w-full rounded-xl bg-white'}>
          <CardHeader className={'px-6 py-5 border-b'}>
            <CardTitle className={'text-lg text-gray-900'}>
              User Details
            </CardTitle>
          </CardHeader>
          <CardContent className={'p-6 flex flex-col gap-6'}>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Email</p>
              <p>{editUserDetails?.user_id}</p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Select Features Permission</p>
              <ul className='grid grid-cols-2 gap-1.5'>
                {isLoading ? (
                  Array.from({ length: 2 }, (_, idx) => {
                    return (
                      <li
                        key={idx}
                        className='h-40 rounded-xl bg-neutral-100 animate-pulse'
                      ></li>
                    );
                  })
                ) : (
                  <>
                    <div className='col-span-2'>
                      <FeatureOption
                        feature={ADMIN_FEATURE}
                        filteredFeatures={filteredFeatures}
                      />
                    </div>
                    {filteredFeatures.map((feature) => {
                      return (
                        <FeatureOption
                          key={feature.title}
                          feature={feature}
                          filteredFeatures={filteredFeatures}
                        />
                      );
                    })}
                  </>
                )}
              </ul>
              {validationErrors.features && (
                <ErrorMessage
                  message={validationErrors.features}
                  className={'ml-2'}
                />
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Select Locations</p>
              {isLoading ? (
                <div className='h-10 rounded-md bg-neutral-100 animate-pulse'></div>
              ) : (
                <MultiSelect
                  options={locationOptions}
                  value={formData.locations}
                  onChange={(newLocations) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      locations: newLocations,
                    }));
                    setValidationErrors((prevValidationErrors) => ({
                      ...prevValidationErrors,
                      locations: '',
                    }));
                  }}
                />
              )}

              {!!selectedLocations.length && (
                <div className='text-sm text-gray-500 my-1.5'>
                  {selectedLocations
                    .slice(0, 3)
                    .map((location) => location.dealer_name)
                    .join(', ')}
                  {selectedLocations.length > 3 && (
                    <>
                      {' '}
                      and{' '}
                      <LoactionDetails selectedLocations={selectedLocations} />
                    </>
                  )}
                </div>
              )}

              {validationErrors.locations && (
                <ErrorMessage
                  message={validationErrors.locations}
                  className={'ml-2 mt-1.5'}
                />
              )}
            </LabelInputContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const FeatureOption = ({ feature, filteredFeatures }) => {
  const {
    formData,
    setFormData,
    setValidationErrors,
    editUserDetails,
    currentUserDetails,
  } = useEditUserForm();

  const IconComponent = feature.icon;

  const isSelected = formData.features.includes(feature.value);

  const isEditingAdmin =
    currentUserDetails?.roles === 'ADMIN' && editUserDetails?.roles === 'ADMIN';

  const handleFeatureSelect = () => {
    if (isEditingAdmin) {
      return;
    }

    if (isSelected) {
      let updatedFilterFeatures = [];

      if (feature.value === 'ADMIN') {
        if (editUserDetails?.roles === 'ADMIN') {
          updatedFilterFeatures = [];
        } else {
          updatedFilterFeatures = editUserDetails?.modules;
        }
      } else {
        const newFilteredFeatures = formData.features.filter(
          (prevFeature) => prevFeature !== feature.value
        );

        if (newFilteredFeatures.includes('ADMIN')) {
          updatedFilterFeatures = newFilteredFeatures.filter(
            (prevFeature) => prevFeature !== 'ADMIN'
          );
        } else {
          updatedFilterFeatures = formData.features.filter(
            (prevFeature) => prevFeature !== feature.value
          );
        }
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        features: updatedFilterFeatures,
      }));
    } else {
      let newFeatures = [];

      if (feature.value === 'ADMIN') {
        newFeatures = filteredFeatures.map((feature) => feature.value);
        newFeatures.push('ADMIN');
      } else {
        const features = [...formData.features, feature.value];

        if (features.length === filteredFeatures.length) {
          newFeatures = filteredFeatures.map((feature) => feature.value);
          newFeatures.push('ADMIN');
        } else {
          newFeatures = [...formData.features, feature.value];
        }
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        features: newFeatures,
      }));
      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        features: '',
      }));
    }
  };

  return (
    <li
      className={cn(
        'rounded-xl border cursor-pointer shadow-xs',
        isSelected
          ? 'border-brand-500 ring-1 ring-brand-500'
          : 'border-gray-300',
        isEditingAdmin && 'opacity-80 ring-0 border-gray-300 cursor-not-allowed'
      )}
      onClick={handleFeatureSelect}
    >
      <div
        data-slot={'header'}
        className='p-4 border-b border-border flex items-center'
      >
        {!isEditingAdmin && (
          <div
            className={cn(
              'size-4 flex items-center justify-center border border-gray-300 rounded-[4px] mr-1',
              isSelected && 'bg-brand-500 text-white border-brand-500'
            )}
          >
            {isSelected && <CheckIcon size={14} />}
          </div>
        )}

        <div className='size-8 flex items-center justify-center border border-gray-300 rounded-md mr-3'>
          <IconComponent size={14} />
        </div>
        <p className='font-semibold text-gray-700'>{feature.title}</p>
      </div>
      <div data-slot={'content'} className='p-4'>
        {/* <div className='flex items-end gap-1 mb-1'>
          <h3 className='text-3xl font-semibold text-gray-700'>$10</h3>
          <p className='text-sm text-gray-600'>per month</p>
        </div> */}
        <p className='text-sm text-gray-600'>{feature.description}</p>
      </div>
    </li>
  );
};

const LoactionDetails = ({ selectedLocations }) => {
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);

  const { setFormData } = useEditUserForm();

  const generateDetailedLocation = useCallback(() => {
    const detailedLocations = selectedLocations.reduce((acc, curr) => {
      const hasLocation = acc.find((location) => location.id === curr.state);

      if (hasLocation) {
        const updatedLocations = acc.map((location) =>
          location.id === curr.state
            ? {
                ...location,
                subLocations: [
                  ...location.subLocations,
                  {
                    id: curr.id,
                    dealer_id: curr.dealer_id,
                    dealer_name: curr.dealer_name,
                    state: curr.state,
                    city: curr.city,
                    area: curr.area,
                    disabled: curr.disabled,
                  },
                ],
              }
            : location
        );

        acc = updatedLocations;
      } else {
        const payload = {
          id: curr.state,
          dealer_name: '',
          city: '',
          area: '',
          accordionItem: true,
          disabled: false,
          subLocations: [
            {
              id: curr.id,
              dealer_id: curr.dealer_id,
              dealer_name: curr.dealer_name,
              state: curr.state,
              city: curr.city,
              area: curr.area,
              disabled: curr.disabled,
            },
          ],
        };
        acc.push(payload);
      }

      return acc;
    }, []);

    return detailedLocations;
  }, [selectedLocations]);

  const handleClose = (value) => {
    const detailedLocations = generateDetailedLocation();

    setLocations(detailedLocations);
    setOpen(value);
  };

  const handleSubmit = () => {
    const dealerIds = locations.reduce((acc, location) => {
      location.subLocations?.forEach((subLocation) => {
        acc.push(subLocation.dealer_id);
      });
      return acc;
    }, []);

    setFormData((prev) => ({
      ...prev,
      locations: dealerIds,
    }));

    setOpen(false);
  };

  const columns = [
    {
      header: 'Location Id',
      cell: ({ row }) => {
        const isAccordionItem = row.original?.accordionItem;

        return (
          <p
            className={cn(
              isAccordionItem
                ? 'text-gray-900 font-medium text-sm'
                : 'text-sm text-gray-600'
            )}
          >
            {row.original.id}
          </p>
        );
      },
    },
    {
      header: 'Location Name',
      accessorKey: 'dealer_name',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'Area',
      accessorKey: 'area',
      cell: ({ row }) => {
        const isAccordionItem = row.original.accordionItem;
        const isOpen = row.getIsExpanded();

        return (
          <div
            className={cn(
              'flex items-center',
              isAccordionItem && 'justify-end'
            )}
          >
            {isAccordionItem ? (
              <ChevronDownIcon
                size={16}
                className={cn(
                  'transition-transform duration-300',
                  isOpen ? 'rotate-180' : 'rotate-0'
                )}
              />
            ) : (
              row.original.area
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isDisabled = row.original.disabled;
        const isAccordion = row.original?.accordionItem;
        const hasDisabledSubLocations = row.original?.subLocations?.filter(
          (subLocation) => subLocation.disabled
        );

        const handleLocationDelete = () => {
          if (isDisabled) {
            return;
          }

          const locationId = row.original.id;
          const location = locations.find(
            (location) => location.id === locationId
          );
          const rowId = row.id;

          if (location) {
            const filteredLocations = locations.filter(
              (location) => location.id !== locationId
            );
            setLocations(filteredLocations);
            setExpanded((prev) => {
              const next = { ...prev };
              delete next[rowId];
              return next;
            });
          } else {
            const updatedLocations = locations
              .map((location) => {
                const filteredSubLocation = location.subLocations.filter(
                  (subLocation) => subLocation.id !== locationId
                );

                if (filteredSubLocation.length) {
                  return { ...location, subLocations: filteredSubLocation };
                } else {
                  setExpanded((prev) => {
                    const next = { ...prev };
                    delete next[rowId[0]];
                    return next;
                  });

                  return null;
                }
              })
              .filter(Boolean);

            setLocations(updatedLocations);
          }
        };

        if (isAccordion && hasDisabledSubLocations.length) {
          return null;
        }

        return (
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              handleLocationDelete();
            }}
            className={
              'disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:pointer-events-auto'
            }
          >
            <CircleMinusIcon size={16} className='text-destructive' />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: locations,
    state: {
      expanded,
    },

    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subLocations,

    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: haven't add setLocations is dependency array
  useEffect(() => {
    const detailedLocations = generateDetailedLocation();

    setLocations(detailedLocations);
  }, [selectedLocations, generateDetailedLocation]);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetTrigger className='text-brand-500'>
        +{selectedLocations.slice(3).length} more
      </SheetTrigger>
      <SheetContent className={'p-0 sm:max-w-sm md:max-w-xl'}>
        <div className='flex flex-col h-full overflow-hidden'>
          <SheetHeader className={'px-6 pt-5 pb-12 shrink-0'}>
            <SheetTitle className={'text-lg text-gray-900 font-semibold'}>
              User Location Details
            </SheetTitle>
            <VisuallyHidden>
              <SheetDescription>No description</SheetDescription>
            </VisuallyHidden>
          </SheetHeader>
          <div className='flex-1 overflow-y-auto p-2'>
            <DataTableWrapper>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => {
                    return (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          const variant =
                            header.column.columnDef?.meta?.variant;
                          const headerClassName =
                            header.column.columnDef?.meta?.headerClassName ||
                            '';

                          return (
                            <TableHead
                              key={header.id}
                              variant={variant}
                              className={cn(
                                'py-3.5 px-6 text-xs',
                                headerClassName
                              )}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => {
                      const isAccordionRow = row.original.accordionItem;

                      return (
                        <TableRow
                          key={row.id}
                          onClick={
                            isAccordionRow
                              ? row.getToggleExpandedHandler()
                              : undefined
                          }
                          className={isAccordionRow ? 'cursor-pointer' : ''}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const variant =
                              cell.column.columnDef?.meta?.variant || '';
                            const cellClassName =
                              cell.column.columnDef?.meta?.cellClassName || '';

                            return (
                              <TableCell
                                key={cell.id}
                                variant={variant}
                                className={cellClassName}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllColumns().length}
                        className='py-10 text-center text-muted-foreground'
                      >
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DataTableWrapper>
          </div>
          <SheetFooter
            className={
              'shrink-0 border-t border-border px-6 py-5 flex items-center justify-end'
            }
          >
            <Button variant={'outline'} onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button variant={'primary'} onClick={handleSubmit}>
              Save Modification
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { EditUserForm, EditUserProvider, useEditUserForm };

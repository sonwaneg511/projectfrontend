//function to validate changed fields

export function validateChangedFields(schema, data) {
  console.log(schema, 'schmea');
  console.log(data, 'data');
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, data: result.data };
  }

  const errors = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0];
    // keep first error only per field
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return {
    valid: false,
    errors,
  };
}

// function to get changed fields
export function getChangedFields(current, initial) {
  const changes = {};

  Object.keys(current).forEach((key) => {
    const curr = current[key];
    const init = initial[key];

    // deep compare for objects (operationHours)
    if (typeof curr === 'object') {
      if (JSON.stringify(curr) !== JSON.stringify(init)) {
        changes[key] = curr;
      }
    } else if (curr !== init) {
      changes[key] = curr;
    }
  });

  return changes;
}

// function to map UI hours to backend hours

export function mapOperationHoursToBackend(uiHours) {
  if (!uiHours) return undefined;

  const days = [];

  Object.entries(uiHours).forEach(([day, value]) => {
    if (value.closed) return;

    days.push({
      openDay: day.toUpperCase(),
      openTime: value.open,
      closeDay: day.toUpperCase(),
      closeTime: value.close,
    });
  });

  return { days };
}

// function to build update payload before sending to backend
export function buildUpdatePayload(changes) {
  const payload = {};

  const addressKeys = ['address1', 'address2', 'address3'];

  const hasAddressChange = addressKeys.some(
    (key) => changes[key] !== undefined
  );

  if (hasAddressChange) {
    const addressParts = addressKeys
      .map((key) => changes[key] ?? fullFormSnapshot[key])
      .filter(Boolean); // removes empty / null

    payload.address = addressParts.join(', ');
  }

  if (changes.gmbPrimaryCategory !== undefined)
    payload.gmbPrimaryCategory = changes.gmbPrimaryCategory;

  if (changes.gmbAdditionalCategories !== undefined)
    payload.gmbAdditionalCategories = changes.gmbAdditionalCategories;

  if (changes.fbPrimaryCategory !== undefined)
    payload.fbPrimaryCategory = changes.fbPrimaryCategory;

  if (changes.fbAdditionalCategories !== undefined)
    payload.fbAdditionalCategories = changes.fbAdditionalCategories;

  if (changes.operationHours !== undefined) {
    payload.operationHours = mapOperationHoursToBackend(changes.operationHours);
  }

  [
    'appointmentLink',
    'languageCode',
    'instagramAttribute',
    'facebookAttribute',
    'youtubeAttribute',
    'twitterAttribute',
    'whatsAppAttribute',
    'linkedinAttribute',
    'area',
    'storeLocationDescriptor',
    'city',
    'state',
    'latitude',
    'longitude',
    'pincode',
    'country',
    'address',
    'locationTitle',
    'websiteUrl',
    'description',
    'phoneNumber',
    'additionalPhones',
    'labels',
  ].forEach((key) => {
    if (changes[key] !== undefined) {
      payload[key] = changes[key];
    }
  });

  return payload;
}

export function mapBackendOperationHours(raw) {
  if (!raw) return {};

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const result = {};

  days.forEach((day) => {
    const open = raw[`${day}OpenTime`];
    const close = raw[`${day}CloseTime`];

    if (!open || open === 'Closed') {
      result[day] = { closed: true };
    } else {
      result[day] = {
        open,
        close,
      };
    }
  });

  return result;
}

export function normalizeCategoryOptions(raw) {
  if (!raw) return [];
  return Object.values(raw).map((item) => ({
    label: item.display_name,
    value: item.id, // IMPORTANT
  }));
}

export function getCategoryNameById(categoriesMap, id) {
  if (!id) return '-';
  return categoriesMap?.[id]?.display_name ?? '-';
}

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuid } from 'uuid';
import { ROUTE_PERMISSIONS } from '@/constants/constants';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function generateTimeOptions(interval = 15) {
  const options = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const h = String(hour).padStart(2, '0');
      const m = String(min).padStart(2, '0');
      const time = `${h}:${m}`;

      options.push(time);

      // 🔥 Insert 11:59 immediately after 11:45
      if (time === '23:45') {
        options.push('23:59');
      }
    }
  }

  return options;
}

export function getEndTimeOptions(startTime, timeOptions, startDate, endDate) {
  // If no start time selected, show all options
  if (!startTime) return timeOptions;

  const isSameDate =
    startDate &&
    endDate &&
    new Date(startDate).toDateString() === new Date(endDate).toDateString();

  // If different dates → show all
  if (!isSameDate) return timeOptions;

  // Same date → show only times AFTER start time
  const startIndex = timeOptions.indexOf(startTime);

  return startIndex === -1 ? timeOptions : timeOptions.slice(startIndex + 1);
}

export const uploadImageToS3 = async (file, folder = 'uploads') => {
  if (!file) throw new Error('File is required');

  // Generate unique filename
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  // 1️⃣ Get presigned URL
  const res = await fetch('/api/image-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName,
      fileType: file.type,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to get upload URL');
  }

  const { uploadUrl } = await res.json();

  // 2️⃣ Upload file to S3
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload image to S3');
  }

  // 3️⃣ Construct final S3 URL
  const s3Url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;

  return s3Url;
};

export const uploadMultipleImagesToS3 = async (files = [], folder) => {
  if (!Array.isArray(files)) return [];

  const uploads = files.map((file) => uploadImageToS3(file, folder));

  return Promise.all(uploads);
};

const ASPECT_RATIO_TOLERANCE = 0.02; // ~2%

function isAspectRatioValid(actual, expected) {
  return Math.abs(actual - expected) <= ASPECT_RATIO_TOLERANCE;
}

const IMAGE_MIN_BYTES = 10 * 1024;
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const validateImageFile = (
  file,
  { minWidth, minHeight, maxWidth, maxHeight, aspectRatio }
) => {
  return new Promise((resolve, reject) => {
    if (file.size < IMAGE_MIN_BYTES) {
      reject({ errorType: 'FILE_TOO_SMALL' });
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      reject({ errorType: 'FILE_TOO_LARGE' });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width < minWidth || img.height < minHeight) {
        reject({ errorType: 'RESOLUTION_TOO_SMALL' });
        return;
      }
      if (img.width > maxWidth || img.height > maxHeight) {
        reject({ errorType: 'RESOLUTION_TOO_LARGE' });
        return;
      }
      if (
        aspectRatio !== undefined &&
        !isAspectRatioValid(img.width / img.height, aspectRatio)
      ) {
        reject({ errorType: 'INVALID_ASPECT_RATIO' });
        return;
      }
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject({ errorType: 'INVALID_IMAGE' });
    };

    img.src = url;
  });
};

export const validateImage = (file, rules) => {
  const imageObj = {
    id: uuid(),
    file,
    errorType: '',
  };

  if (!file?.type?.startsWith('image/')) {
    imageObj.errorType = 'INVALID_FILE';
    return Promise.reject(imageObj);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { aspectRatio, minWidth, minHeight } = rules;

      const actualRatio = img.width / img.height;

      const hasInvalidAspectRatio = !isAspectRatioValid(
        actualRatio,
        aspectRatio
      );

      const hasInvalidSize = img.width < minWidth || img.height < minHeight;

      if (hasInvalidAspectRatio) {
        imageObj.errorType = 'INVALID_ASPECT_RATIO';
        reject(imageObj);
        return;
      }

      if (hasInvalidSize) {
        imageObj.errorType = 'INVALID_MIN_DIMENSION';
        reject(imageObj);
        return;
      }

      resolve(imageObj);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      imageObj.errorType = 'INVALID_IMAGE';
      reject(imageObj);
    };

    img.src = url;
  });
};

export const mapDealersToOptions = (dealerMap = {}) =>
  Object.entries(dealerMap).map(([id, name]) => ({
    label: name ?? id,
    value: id,
  }));

// export function getImageErrorDescription(errorImages, { width, height }) {
//   const hasInvalidFile = errorImages.some(
//     (img) => img.errorType === 'INVALID_FILE'
//   );

//   const hasInvalidDimension = errorImages.some(
//     (img) => img.errorType === 'INVALID_DIMENSION'
//   );

//   if (hasInvalidFile && hasInvalidDimension) {
//     return `Some images have unsupported file types and some must be ${height}×${width}.`;
//   }

//   if (hasInvalidFile) {
//     return 'Some images have unsupported file types.';
//   }

//   if (hasInvalidDimension) {
//     return `Images must be ${height}×${width}.`;
//   }

//   return 'Some images were skipped.';
// }

export function getImageErrorDescription(errorImages, rules) {
  const hasInvalidFile = errorImages.some(
    (img) => img.errorType === 'INVALID_FILE'
  );

  const hasInvalidAspectRatio = errorImages.some(
    (img) => img.errorType === 'INVALID_ASPECT_RATIO'
  );

  const hasInvalidMinDimension = errorImages.some(
    (img) => img.errorType === 'INVALID_MIN_DIMENSION'
  );

  const ratioText = rules.aspectRatio === 1 ? '1:1' : `${rules.aspectRatio}:1`;

  if (hasInvalidFile) {
    return 'Some images have unsupported file types.';
  }

  if (hasInvalidAspectRatio && hasInvalidMinDimension) {
    return `Some images have incorrect aspect ratio (${ratioText}) or are too small.`;
  }

  if (hasInvalidAspectRatio) {
    return `Images must match the ${ratioText} aspect ratio.`;
  }

  if (hasInvalidMinDimension) {
    return `Images must be at least ${rules.minWidth}×${rules.minHeight}.`;
  }

  return 'Some images were skipped.';
}
export const mapZodErrors = (issues) => {
  return issues.reduce((acc, curr) => {
    if (!acc[curr.path?.[0]]) {
      acc[curr.path?.[0]] = curr.message;
    }
    return acc;
  }, {});
};

export function generatePaginationBtns(
  totalPages,
  currentPage,
  siblingCount = 1,
  boundaryCount = 1
) {
  const DOTS = 'DOTS';

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const totalPaginationBtns = siblingCount * 2 + boundaryCount * 2 + 3;

  if (totalPaginationBtns >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(
    currentPage - siblingCount,
    boundaryCount + 1
  );
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages - boundaryCount
  );

  const showLeftDots = leftSiblingIndex > boundaryCount + 1;
  const showRightDots = rightSiblingIndex < totalPages - boundaryCount;

  const leftRange = range(1, boundaryCount);
  const rightRange = range(totalPages - boundaryCount + 1, totalPages);

  const middleRange = range(leftSiblingIndex, rightSiblingIndex);

  if (!showLeftDots && showRightDots) {
    const leftItemCount = boundaryCount + 2 * siblingCount + 2;
    const leftRangeFull = range(1, leftItemCount);
    return [...leftRangeFull, DOTS, ...rightRange];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = boundaryCount + 2 * siblingCount + 2;
    const rightRangeFull = range(totalPages - rightItemCount + 1, totalPages);
    return [...leftRange, DOTS, ...rightRangeFull];
  }

  if (showLeftDots && showRightDots) {
    return [...leftRange, DOTS, ...middleRange, DOTS, ...rightRange];
  }

  return range(1, totalPages);
}

export function buildBackendDateTime(date, time, options = {}) {
  if (!date) return '';

  const { isEnd = false, defaultTime } = options;

  // ---- normalize date (avoid ISO to prevent timezone bugs)
  let yyyyMMdd = '';

  if (date instanceof Date) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    yyyyMMdd = `${yyyy}-${MM}-${dd}`;
  } else if (typeof date === 'string') {
    // Accept "yyyy-MM-dd" or ISO-like strings
    yyyyMMdd = date.slice(0, 10);
  } else {
    return '';
  }

  // ---- decide time
  let finalTime = time || defaultTime;

  if (!finalTime) {
    finalTime = isEnd ? '23:59:59' : '00:00:00';
  } else if (finalTime.length === 5) {
    // HH:mm → HH:mm:ss
    finalTime = `${finalTime}:00`;
  }

  return `${yyyyMMdd} ${finalTime}`;
}

export function formatNumber(number = 0, type = 'en-IN') {
  return new Intl.NumberFormat(type).format(number);
}

export function formatString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const hasAccess = (pathname, roles = []) => {
  for (const route in ROUTE_PERMISSIONS) {
    const allowedRoles = ROUTE_PERMISSIONS[route];

    // REGEX ROUTE
    if (route.startsWith('^')) {
      const regex = new RegExp(route);

      if (regex.test(pathname)) {
        return roles.some((role) => allowedRoles.includes(role));
      }
    }

    // EXACT MATCH
    if (pathname === route) {
      return roles.some((role) => allowedRoles.includes(role));
    }
  }

  return true;
};

export const calculatePlanPayable = ({ baseAmount = 0, serviceAmount = 0 }) => {
  const subtotal = Number(baseAmount) + Number(serviceAmount);

  const sgst = +(subtotal * 0.09).toFixed(2);
  const cgst = +(subtotal * 0.09).toFixed(2);

  const grandTotal = +(subtotal + sgst + cgst).toFixed(2);

  return {
    subtotal,
    sgst,
    cgst,
    grandTotal,
  };
};

export const formatNumberDecimal = (value) =>
  value?.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

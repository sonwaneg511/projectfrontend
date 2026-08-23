'use client';

import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/* ---------------- TIME GENERATORS ---------------- */

function generateTimes(startHour, endHour) {
  const times = [];

  for (let h = startHour; h <= endHour; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== endHour) times.push(`${String(h).padStart(2, '0')}:30`);
  }

  return times;
}

const OPEN_TIMES = generateTimes(9, 12); // 09:00 → 12:00
const CLOSE_TIMES = generateTimes(17, 22); // 17:00 → 22:00

/* ---------------- COMPONENT ---------------- */

export function OperationHoursEditor({ label, value = {}, onChange }) {
  const updateDay = (day, nextDayValue) => {
    onChange({
      ...value,
      [day]: nextDayValue,
    });
  };

  return (
    <div className='space-y-4'>
      <p className='text-sm font-medium text-gray-700'>{label}</p>

      <div className='space-y-3'>
        {DAYS.map((day) => {
          const dayValue = value[day];
          const isOpen = !!dayValue && !dayValue.closed;

          return (
            <div
              key={day}
              className='grid items-center gap-3'
              style={{
                gridTemplateColumns: '20px 96px 1fr 1fr',
              }}
            >
              {/* OPEN / CLOSED */}
              <Checkbox
                checked={isOpen}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateDay(day, { closed: true });
                  } else {
                    updateDay(day, {
                      open: '09:00',
                      close: '18:00',
                    });
                  }
                }}
              />

              {/* DAY */}
              <div className='w-24 capitalize text-sm text-gray-700'>{day}</div>

              {/* OPEN TIME */}
              <Select
                disabled={!isOpen}
                value={dayValue?.open}
                onValueChange={(open) =>
                  updateDay(day, {
                    open,
                    close: dayValue?.close ?? '18:00',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Open' />
                </SelectTrigger>
                <SelectContent>
                  {OPEN_TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* CLOSE TIME */}
              <Select
                disabled={!isOpen}
                value={dayValue?.close}
                onValueChange={(close) =>
                  updateDay(day, {
                    open: dayValue?.open ?? '09:00',
                    close,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Close' />
                </SelectTrigger>
                <SelectContent>
                  {CLOSE_TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
    </div>
  );
}

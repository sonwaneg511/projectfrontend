'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../ui/card';

// px per day column — controls breathing room
const BAR_COLUMN_WIDTH = 40;
const SCROLL_THRESHOLD = 15; // days before scroll kicks in

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Compute max reviews from data, rounded up to nearest 10

/** "2025-01-07" → "7 Jan" */
const formatDateLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

/** Today's ISO date string "YYYY-MM-DD" for highlighting */
const getTodayStr = () => new Date().toISOString().split('T')[0];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        {label}
      </p>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: p.color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#6b7280' }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: '#111827' }}>
            {p.name === 'Avg Rating' ? `${p.value} ★` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ReportsReviewChart = ({ reviewChartData }) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const wrapperRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    setContainerWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  const needsScroll = reviewChartData.length > SCROLL_THRESHOLD;
  const chartWidth = needsScroll
    ? Math.max(reviewChartData.length * BAR_COLUMN_WIDTH, containerWidth)
    : containerWidth;

  const todayStr = getTodayStr();

  const maxReviews = useMemo(() => {
    const max = Math.max(...reviewChartData.map((d) => d.totalReviews));
    return Math.ceil(max / 10) * 10;
  }, [reviewChartData]);

  // Generate ticks: [0, 10, 20, ..., maxReviews]
  const reviewTicks = useMemo(
    () => Array.from({ length: maxReviews / 10 + 1 }, (_, i) => i * 10),
    [maxReviews]
  );

  // Total reviews count (sum of all days in range)
  const totalReviews = useMemo(
    () => reviewChartData.reduce((sum, d) => sum + d.totalReviews, 0),
    [reviewChartData]
  );

  // Month-over-month change — compare last 30 days vs prior 30 days
  // For display purposes we just show a static badge; wire to real data if needed
  const _percentChange = 2.4;

  return (
    <Card style={{ padding: 0 }}>
      {/* ── Card Header ── */}
      <div className='px-6 pt-5 pb-0 flex items-start justify-between'>
        <span className='text-sm font-semibold text-gray-500 tracking-wide'>
          Reviews
        </span>
        <button className='p-1 rounded-md hover:bg-gray-100 transition-colors'>
          {/* three-dot menu */}
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
            <circle cx='9' cy='4' r='1.5' fill='#9ca3af' />
            <circle cx='9' cy='9' r='1.5' fill='#9ca3af' />
            <circle cx='9' cy='14' r='1.5' fill='#9ca3af' />
          </svg>
        </button>
      </div>

      <div className='px-6 pb-6'>
        {/* ── Metric row ── */}
        <div className='flex items-center gap-2 mt-1 mb-5'>
          <span className='text-3xl font-bold text-gray-900'>
            {totalReviews.toLocaleString()}
          </span>
          {/* <span className='flex items-center gap-1 text-sm font-medium text-emerald-500'>
            <TrendingUpIcon size={14} />
            {percentChange}%
          </span>
          <span className='text-sm text-gray-400'>vs last month</span> */}
        </div>

        {/* ── Legend ── */}
        <div className='flex justify-end gap-4 mb-3'>
          <div className='flex items-center gap-1.5'>
            <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' />
            <span className='text-xs text-gray-500'>Star Rating</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2.5 h-2.5 rounded-full bg-blue-400 inline-block' />
            <span className='text-xs text-gray-500'>Total Reviews</span>
          </div>
        </div>

        <div
          ref={wrapperRef}
          style={{
            width: '100%',
            overflowX: needsScroll ? 'auto' : 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#e5e7eb transparent',
          }}
        >
          <div
            style={{
              width: needsScroll ? chartWidth : '100%',
              minWidth: '100%',
            }}
          >
            <ComposedChart
              width={chartWidth}
              height={240}
              data={reviewChartData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray='0'
                stroke='#f3f4f6'
                vertical={false}
              />

              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                // ✅ Convert "2025-01-07" → "7 Jan" for display
                tickFormatter={formatDateLabel}
                minTickGap={12}
              />

              {/* Left Y-axis — for bars (totalReviews) */}
              <YAxis
                yAxisId='reviews'
                hide
                domain={[0, maxReviews]}
                ticks={reviewTicks}
              />

              {/* Right Y-axis — for line (avgRating), always 0–5 */}
              <YAxis yAxisId='rating' hide domain={[0, 5]} />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                // ✅ Format the tooltip label too
                labelFormatter={formatDateLabel}
              />

              {/* ── Bars: Total Reviews ── */}
              <Bar
                yAxisId='reviews'
                name='Total Reviews'
                dataKey='totalReviews'
                radius={[6, 6, 0, 0]}
                barSize={18}
                onMouseEnter={(data) => setHoveredDate(data.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {reviewChartData.map((entry, idx) => {
                  const isToday = entry.date === todayStr;
                  const isHovered = entry.date === hoveredDate;
                  return (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        isHovered || isToday
                          ? 'var(--color-brand-600, #2563eb)'
                          : 'var(--color-brand-100, #bfdbfe)'
                      }
                    />
                  );
                })}
              </Bar>

              {/* ── Line: Avg Rating ── */}
              <Line
                yAxisId='rating'
                name='Avg Rating'
                dataKey='avgRating'
                type='monotone'
                strokeWidth={2}
                stroke='var(--color-success-600, #16a34a)'
                dot={false}
                activeDot={{ r: 4, fill: 'var(--color-success-600, #16a34a)' }}
              />
            </ComposedChart>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportsReviewChart;

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../ui/card';

// ─── Constants ────────────────────────────────────────────────────────────────

const BAR_COLUMN_WIDTH = 28;
const SCROLL_THRESHOLD = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLast30Days() {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date();
  from.setDate(from.getDate() - 29);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

/**
 * Takes the API array and fills in every date in the selected range
 * with 0s for missing dates — so the chart always shows the full range
 * even when the backend only returns days with actual data.
 *
 * API shape: [{ date: "2026-03-12", google: 1, facebook: 0 }]
 */
function normalizeChartData(apiData = [], from, to) {
  const lookup = {};
  apiData.forEach((d) => {
    lookup[d.date] = { google: d.google ?? 0, facebook: d.facebook ?? 0 };
  });

  const result = [];
  const current = new Date(from);
  current.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    // ✅ Use local date parts instead of toISOString() which uses UTC
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`; // "2026-03-12" in local time

    result.push({
      date: new Date(current),
      google: lookup[key]?.google ?? 0,
      facebook: lookup[key]?.facebook ?? 0,
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  // ✅ Use the date object directly from payload — already a local Date
  const date = payload[0]?.payload?.date;
  const label = date.toLocaleDateString('default', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        zIndex: 50,
      }}
    >
      <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        {label}
      </p>
      {payload.map((p) => (
        <div
          key={p.dataKey}
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
              background: p.fill,
              display: 'inline-block',
            }}
          />
          <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
            {p.dataKey}:
          </span>
          <span style={{ fontWeight: 600, color: '#111827' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom X-Axis Tick ───────────────────────────────────────────────────────

const CustomXAxisTick = ({ x, y, payload }) => {
  const [year, month, day] = payload.value.split('T')[0].split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const dayStr = String(date.getDate()).padStart(2, '0');
  const isFirstOfMonth = date.getDate() === 1;
  const monthStr = date.toLocaleString('default', { month: 'short' }); // "Mar"

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={13}
        textAnchor='middle'
        fill='#9ca3af'
        fontSize={11}
        fontFamily='inherit'
      >
        {dayStr} {/* ✅ was rendering raw `day` number, use dayStr */}
      </text>
      {isFirstOfMonth && (
        <text
          x={0}
          y={0}
          dy={25}
          textAnchor='middle'
          fill='#6b7280'
          fontSize={11}
          fontWeight={500}
          fontFamily='inherit'
        >
          {monthStr}{' '}
          {/* ✅ was rendering raw `month` number (3), use monthStr */}
        </text>
      )}
    </g>
  );
};

// ─── Dots Icon ────────────────────────────────────────────────────────────────

const DotsIcon = () => (
  <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
    <circle cx='9' cy='4' r='1.5' fill='#9ca3af' />
    <circle cx='9' cy='9' r='1.5' fill='#9ca3af' />
    <circle cx='9' cy='14' r='1.5' fill='#9ca3af' />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Props:
 *   range   — { from: Date, to: Date }
 *   data    — full API response object (contains data.no_of_post_graph)
 */
export default function PostsBarChart({ range: externalRange, data }) {
  const [internalRange] = useState(getLast30Days);

  const range =
    externalRange?.from && externalRange?.to ? externalRange : internalRange;

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

  // ✅ Normalize API data — fill every day in range with 0s for missing dates
  const allData = useMemo(() => {
    const from = range?.from ? new Date(range.from) : getLast30Days().from;
    const to = range?.to ? new Date(range.to) : getLast30Days().to;

    const apiData = data?.no_of_post_graph ?? [];
    return normalizeChartData(apiData, from, to);
  }, [range, data]);

  // ✅ Total from real data
  const totalPosts = useMemo(
    () => allData.reduce((s, d) => s + d.google + d.facebook, 0),
    [allData]
  );

  // Highlight today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIndex = allData.findIndex((d) => {
    const dd = new Date(d.date);
    dd.setHours(0, 0, 0, 0);
    return dd.getTime() === today.getTime();
  });

  const needsScroll = allData.length > SCROLL_THRESHOLD;
  const chartPixelWidth = needsScroll
    ? Math.max(allData.length * BAR_COLUMN_WIDTH, containerWidth)
    : containerWidth;

  return (
    <Card style={{ padding: '20px 20px 12px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#6b7280',
            letterSpacing: '0.02em',
          }}
        >
          No. of Posts
        </span>
        <button
          style={{
            padding: 4,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <DotsIcon />
        </button>
      </div>

      {/* Metric row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 700, color: '#111827' }}>
          {totalPosts.toLocaleString()}
        </span>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16,
          marginBottom: 6,
        }}
      >
        {[
          { label: 'Google', color: '#17B26A' },
          { label: 'Facebook', color: '#2D75E3' },
        ].map(({ label, color }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: color,
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Scrollable chart */}
      <div
        ref={wrapperRef}
        style={{
          width: '100%',
          overflowX: needsScroll ? 'auto' : 'hidden',
          overflowY: 'visible',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db transparent',
        }}
      >
        <div style={{ width: chartPixelWidth, minWidth: '100%' }}>
          <BarChart
            width={chartPixelWidth}
            height={210}
            data={allData}
            barCategoryGap='28%'
            barGap={2}
            margin={{ top: 4, right: 8, left: -22, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke='#f3f4f6'
              strokeDasharray=''
            />

            <XAxis
              dataKey={(d) => d.date.toISOString()}
              axisLine={false}
              tickLine={false}
              tick={<CustomXAxisTick />}
              interval={0}
              height={36}
            />

            <YAxis hide />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />

            {/* Google bars */}
            <Bar dataKey='google' radius={[3, 3, 0, 0]} maxBarSize={13}>
              {allData.map((_, i) => (
                <Cell
                  key={`g-${i}`}
                  fill={i === todayIndex ? '#079455' : '#ABEFC6'}
                />
              ))}
            </Bar>

            {/* Facebook bars */}
            <Bar dataKey='facebook' radius={[3, 3, 0, 0]} maxBarSize={13}>
              {allData.map((_, i) => (
                <Cell
                  key={`f-${i}`}
                  fill={i === todayIndex ? '#2D75E3' : '#DCEDFD'}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </Card>
  );
}

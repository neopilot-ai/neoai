import type { RouterOutputs } from "@api/trpc/routers/_app";
import type { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { CalendarDay } from "./calendar-day";

type CalendarGridProps = {
  firstWeek: TZDate[];
  calendarDays: TZDate[];
  currentDate: TZDate;
  selectedDate: string | null;
  data: RouterOutputs["trackerEntries"]["byRange"]["result"] | undefined;
  range: [string, string] | null;
  localRange: [string | null, string | null];
  isDragging: boolean;
  weekStartsOnMonday: boolean;
  handleMouseDown: (date: TZDate) => void;
  handleMouseEnter: (date: TZDate) => void;
  handleMouseUp: () => void;
  onEventClick?: (eventId: string, date: TZDate) => void;
};

export function CalendarMonthView({
  firstWeek,
  calendarDays,
  currentDate,
  selectedDate,
  data,
  range,
  localRange,
  isDragging,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  onEventClick,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-px border border-border bg-border">
      {firstWeek.map((day) => (
        <div
          key={day.toString()}
          className="py-4 px-3 bg-background text-xs font-medium text-[#878787] font-mono"
        >
          {format(day, "EEE").toUpperCase()}
        </div>
      ))}
      {calendarDays.map((date, index) => (
        <CalendarDay
          key={index.toString()}
          date={date}
          currentDate={currentDate}
          selectedDate={selectedDate}
          dayData={data?.[format(date, "yyyy-MM-dd")]}
          allData={data}
          range={range}
          localRange={localRange}
          isDragging={isDragging}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
          handleMouseUp={handleMouseUp}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}

import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Checkbox, Group, rem } from "@mantine/core";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import { IconClock } from "@tabler/icons-react";
import {
  LineStatus,
  SelectedDates,
} from "../../page/appointment/types/Appointment";

interface DateTimeSelectorProps {
  value: SelectedDates[];
  onChange?: (updatedList: SelectedDates[]) => void;
}

function DateTimeSelector({ value = [], onChange }: DateTimeSelectorProps) {
  const [dateTimeList, setDateTimeList] = useState(value);
  const [tempTimes, setTempTimes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(dateTimeList)) {
      setDateTimeList(value);
    }
  }, [value]);

  const handleDateChange = (selectedDates: Date[]) => {
    const existingEntries = dateTimeList.filter(
      (entry) =>
        entry.lineStatusId === LineStatus.Canceled ||
        entry.lineStatusId === LineStatus.Completed ||
        entry.start < new Date()
    );

    const newEntries = selectedDates.map((date) => {
      const existingEntry = dateTimeList.find((entry) =>
        dayjs(entry.start).isSame(date, "day")
      );
      return (
        existingEntry ?? {
          start: dayjs(date).hour(8).minute(0).toDate(),
          end: dayjs(date).hour(17).minute(0).toDate(),
          lineStatusId: LineStatus.Waiting,
        }
      );
    });

    const updatedList = getUniqueTasks(existingEntries, newEntries);
    setDateTimeList(updatedList);
    onChange?.(updatedList);
  };

  const getUniqueTasks = (
    list1: SelectedDates[],
    list2: SelectedDates[]
  ): SelectedDates[] => {
    // İki listeyi birleştir
    const combinedList = [...list1, ...list2];

    // Benzersiz elemanları tutacak bir Set oluştur
    const uniqueTasks = new Set<string>();

    // Sonuç listesi
    const result: SelectedDates[] = [];

    combinedList.forEach((task) => {
      // Her bir task'ı stringify ederek Set'e ekle
      const taskString = JSON.stringify(task);
      if (!uniqueTasks.has(taskString)) {
        uniqueTasks.add(taskString);
        result.push(task);
      }
    });

    return result;
  };

  const handleTimeChange = (
    index: number,
    type: "start" | "end",
    value: string
  ) => {
    setTempTimes((prev) => ({ ...prev, [`${index}-${type}`]: value }));

    const [hour, minute] = value.split(":");

    if (hour && minute) {
      if (parseInt(hour) > 23) {
        return;
      }
      if (parseInt(minute) > 59) return;
    } else {
      console.error("Geçersiz zaman formatı!");
      return;
    }

    const updatedList = [...dateTimeList];
    updatedList[index][type] = dayjs(updatedList[index][type])
      .hour(parseInt(hour))
      .minute(parseInt(minute))
      .toDate();
    setDateTimeList(updatedList);
    onChange?.(updatedList);
  };

  const getIconClockColor = (lineStatusId: number) => {
    switch (lineStatusId) {
      case LineStatus.Canceled:
        return "red";
      case LineStatus.Completed:
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <div>
      <DatePickerInput
        type="multiple"
        valueFormat="YYYY MMM DD"
        label="Pick date"
        placeholder="Pick date"
        value={dateTimeList.map((entry) => entry.start)}
        onChange={handleDateChange}
        minDate={new Date()}
      />
      <Group>
        {dateTimeList.map((entry, index) => (
          <div key={index} style={{ marginTop: 10 }}>
            <TimeInput
              label={`Start ${dayjs(entry.start).format("YYYY MMM DD")}`}
              value={
                tempTimes[`${index}-start`] ??
                dayjs(entry.start).format("HH:mm")
              }
              disabled={
                entry.lineStatusId === LineStatus.Canceled ||
                entry.lineStatusId === LineStatus.Completed
              }
              leftSection={
                <IconClock
                  style={{
                    width: rem(16),
                    height: rem(16),
                    color: getIconClockColor(entry.lineStatusId),
                  }}
                  stroke={1.5}
                />
              }
              onChange={(event) =>
                handleTimeChange(index, "start", event.target.value)
              }
            />
            <TimeInput
              label={`End ${dayjs(entry.end).format("YYYY MMM DD")}`}
              value={
                tempTimes[`${index}-end`] ?? dayjs(entry.end).format("HH:mm")
              }
              disabled={
                entry.lineStatusId === LineStatus.Canceled ||
                entry.lineStatusId === LineStatus.Completed
              }
              leftSection={
                <IconClock
                  style={{
                    width: rem(16),
                    height: rem(16),
                    color: getIconClockColor(entry.lineStatusId),
                  }}
                  stroke={1.5}
                />
              }
              onChange={(event) =>
                handleTimeChange(index, "end", event.target.value)
              }
            />
            {entry.lineStatusId === LineStatus.Waiting && (
              <Checkbox
                label="Is Canceled"
                onChange={(event) => {
                  const updatedList = [...dateTimeList];
                  updatedList[index].lineStatusId = event.target.checked
                    ? LineStatus.Canceled
                    : LineStatus.Waiting;
                  setDateTimeList(updatedList);
                  onChange?.(updatedList);
                }}
              />
            )}
          </div>
        ))}
      </Group>
    </div>
  );
}

export default DateTimeSelector;

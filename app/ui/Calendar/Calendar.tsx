'use client'

import { getMonthOfWeeks } from "@/app/utils/dayjs"
import { Button } from "@nextui-org/react"
import dayjs from "dayjs"
import { useMemo, useState } from "react"

export type ChallengeEvent = {
  id: number
  title: string
  date: string
}

export type View = 'month' | 'agenda'

type CalendarProps = {
  events?: ChallengeEvent[]
  defaultDayjs?: dayjs.Dayjs
  views?: View[]
}

export default function Calendar({ events, defaultDayjs, views }: CalendarProps) {
  const nowDayjs = dayjs()

  const [currentDayjs, setCurrentDayjs] = useState(defaultDayjs || nowDayjs)

  const weeks = useMemo(() => getMonthOfWeeks(currentDayjs), [currentDayjs])

  const setPrevMonth = () => {
    setCurrentDayjs(currentDayjs.subtract(1, 'month'))
  }

  const setNextMonth = () => {
    setCurrentDayjs(currentDayjs.add(1, 'month'))
  }

  const setTodayMonth = () => {
    setCurrentDayjs(nowDayjs)
  }

  return (
    <div>
      <h1>{currentDayjs.format('YYYY-MM')}</h1>
      <div className="flex">
        <Button onClick={setPrevMonth} variant="light">{"<"}</Button>
        <Button onClick={setTodayMonth} variant="light">오늘</Button>
        <Button onClick={setNextMonth} variant="light">{">"}</Button>
      </div>
      {
        weeks.map((week, i) => (
          <div key={i} className="flex">
            {
              week.map((day, j) => (
                <div key={j} className="w-full border-1 border-gray-200 flex items-center justify-center">
                  <CalendarDate
                    date={day}
                    events={events?.filter(event => {
                      const dayjsDate = dayjs(event.date)
                      return dayjsDate.isSame(day, 'day')
                    })}
                  />
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

function CalendarDate({ date, events }: { date: dayjs.Dayjs, events?: ChallengeEvent[] }) {
  return (
    <div className="flex flex-col w-full h-36 text-sm">
      <div className="w-full flex justify-end text-foreground-500">{date.format('D')}일</div>
      <div className="w-full flex flex-col gap-2">
        {events?.slice(0, 3).map(event => (
          <div className="bg-success-100 px-2" key={event.id}>
            {event.title}
          </div>
        ))}
        {
          events?.length && events.length > 3
            ? (
                <div className="bg-success-100 px-2">
                +{events.length - 3}
                </div>
            )
            : null
        }
      </div>
    </div>
  )
}
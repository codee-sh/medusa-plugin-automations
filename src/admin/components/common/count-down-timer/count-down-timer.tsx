import { useEffect, useState } from "react"
import { getTimeLeft } from "../../../../utils"

type CountDownTimerProps = {
  expires_at: string | number | Date
  text_expired: string
  text_before: string
}

export const CountDownTimer = ({
  expires_at,
  text_expired,
  text_before,
}: CountDownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(expires_at)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft(expires_at)
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(interval)
  }, [expires_at])

  if (!timeLeft) {
    return text_expired
  }

  return (
    <span>
      {text_before}: {timeLeft.hours}h, {timeLeft.minutes}m,{" "}
      {timeLeft.seconds}s
    </span>
  )
}

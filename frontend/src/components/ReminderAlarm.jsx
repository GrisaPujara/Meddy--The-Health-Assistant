import { useEffect, useRef, useState } from "react";
import { fetchFamily } from "../utils/familyApi";
import { getCurrentUser, isLoggedIn } from "../utils/userStore";

const FIRED_KEY = "meddyFiredReminders";

function pad(value) {
  return String(value).padStart(2, "0");
}

function nowStamp() {
  const now = new Date();
  return {
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    monthDay: `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  };
}

function fireKey(reminder, date) {
  return `${reminder.id}-${date}-${reminder.time}`;
}

function readFired() {
  try {
    return JSON.parse(localStorage.getItem(FIRED_KEY) || "[]");
  } catch {
    return [];
  }
}

function markFired(key) {
  const next = [...new Set([...readFired(), key])].slice(-200);
  localStorage.setItem(FIRED_KEY, JSON.stringify(next));
}

function isDue(reminder, stamp) {
  if (!reminder.enabled) return false;
  if (reminder.time !== stamp.time) return false;

  if (reminder.type === "medicine" || reminder.repeat === "daily") {
    return true;
  }

  if (reminder.type === "yearly" || reminder.repeat === "yearly") {
    const date = reminder.date || "";
    const monthDay = date.length >= 10 ? date.slice(5) : date;
    return monthDay === stamp.monthDay;
  }

  if (reminder.date) {
    return reminder.date === stamp.date;
  }

  return reminder.repeat === "once";
}

function playAlarm() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 1.2);
  } catch {
    // Browser may block audio until a click.
  }
}

function personName(family, personId) {
  return family?.people?.find((person) => person.id === personId)?.name || "Family member";
}

function ReminderAlarm() {
  const [alert, setAlert] = useState(null);
  const alarmTimer = useRef(null);

  useEffect(() => {
    if (!isLoggedIn()) return undefined;

    const user = getCurrentUser();
    if (!user.email) return undefined;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const check = async () => {
      try {
        const data = await fetchFamily(user.email);
        const family = data.family;
        if (!family?.reminders?.length) return;

        const stamp = nowStamp();
        const fired = readFired();
        const due = family.reminders.find((reminder) => {
          const key = fireKey(reminder, stamp.date);
          return isDue(reminder, stamp) && !fired.includes(key);
        });

        if (!due) return;

        markFired(fireKey(due, stamp.date));
        const nextAlert = {
          ...due,
          personName: personName(family, due.personId),
        };
        setAlert(nextAlert);
        playAlarm();

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Meddy reminder: ${due.title}`, {
            body: `${nextAlert.personName} • ${due.time}`,
          });
        }
      } catch {
        // Backend may be offline.
      }
    };

    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!alert) {
      if (alarmTimer.current) clearInterval(alarmTimer.current);
      return undefined;
    }

    playAlarm();
    alarmTimer.current = setInterval(playAlarm, 4000);
    return () => clearInterval(alarmTimer.current);
  }, [alert]);

  if (!alert) return null;

  const typeLabel =
    alert.type === "medicine"
      ? "Medicine"
      : alert.type === "yearly"
        ? "Yearly checkup"
        : "Health checkup";

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <p className="text-sm font-semibold text-indigo-600 uppercase">{typeLabel}</p>
        <h2 className="text-3xl font-bold mt-2">⏰ {alert.title}</h2>
        <p className="text-gray-600 mt-3">
          For <strong>{alert.personName}</strong> at {alert.time}
        </p>
        {alert.notes && <p className="text-gray-500 mt-2">{alert.notes}</p>}
        <button
          type="button"
          onClick={() => setAlert(null)}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default ReminderAlarm;

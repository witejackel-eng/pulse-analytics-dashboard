import { makeRng, pick } from "./rng";
import { getCuratedCustomers } from "./customers";

export type EventType = "SIGNUP" | "LOGIN" | "UPGRADE" | "DOWNGRADE" | "CHURN" | "PAYMENT" | "API_CALL" | "ERROR" | "FEATURE_USE";

export interface EventRecord {
  id: string;
  type: EventType;
  actor: string;
  message: string;
  timestamp: string;
}

const EVENT_TYPES: EventType[] = ["SIGNUP", "LOGIN", "UPGRADE", "DOWNGRADE", "CHURN", "PAYMENT", "API_CALL", "FEATURE_USE"];

function messageFor(type: EventType, name: string): string {
  const messages: Record<EventType, string> = {
    SIGNUP: `${name} signed up for a free trial`,
    LOGIN: `${name} logged in from a new device`,
    UPGRADE: `${name} upgraded to a higher plan`,
    DOWNGRADE: `${name} downgraded their plan`,
    CHURN: `${name} cancelled their subscription`,
    PAYMENT: `${name} completed a payment`,
    API_CALL: `${name}'s integration made a burst of API calls`,
    ERROR: `${name}'s integration hit a recurring API error`,
    FEATURE_USE: `${name} created a new saved dashboard`,
  };
  return messages[type];
}

function buildEvents(): EventRecord[] {
  const rng = makeRng(809);
  const now = new Date("2026-07-04T12:00:00Z");
  const customers = getCuratedCustomers();
  const rows: EventRecord[] = [];
  for (let i = 0; i < 250; i++) {
    const type = pick(EVENT_TYPES, rng);
    const customer = pick(customers, rng);
    rows.push({
      id: `evt_${i}`,
      type,
      actor: customer.name,
      message: messageFor(type, customer.name),
      timestamp: new Date(now.getTime() - rng() * 1000 * 60 * 60 * 48).toISOString(),
    });
  }
  return rows.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

let cache: EventRecord[] | null = null;
export function getCuratedEvents(): EventRecord[] {
  if (!cache) cache = buildEvents();
  return cache;
}

let liveCounter = 0;
export function generateLiveEvent(): EventRecord {
  const rng = makeRng(Date.now() % 100000 + liveCounter);
  liveCounter += 1;
  const customers = getCuratedCustomers();
  const type = pick(EVENT_TYPES, rng);
  const customer = pick(customers, rng);
  return {
    id: `live_${Date.now()}_${liveCounter}`,
    type,
    actor: customer.name,
    message: messageFor(type, customer.name),
    timestamp: new Date().toISOString(),
  };
}

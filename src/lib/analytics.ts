export type AnalyticsEvent =
  | "trip_planner_started"
  | "traveler_type_selected"
  | "traveler_count_updated"
  | "duration_selected"
  | "active_days_selected"
  | "pace_selected"
  | "budget_selected"
  | "interests_selected"
  | "build_route_clicked"
  | "transport_search_started"
  | "transport_selected"
  | "transfer_selected"
  | "hotel_selected"
  | "budget_exceeded"
  | "budget_alternative_clicked"
  | "itinerary_generated"
  | "booking_clicked"
  | "booking_form_submitted"
  | "booking_completed";

export function trackEvent(eventName: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const eventData = {
    event: eventName,
    payload: payload || {},
    timestamp: new Date().toISOString(),
  };

  // Log for development and debugging
  console.log(`[DiyorAI Analytics] 📊 ${eventName}`, payload || "");

  try {
    const existing = JSON.parse(sessionStorage.getItem("diyorai_analytics_events") || "[]");
    existing.push(eventData);
    sessionStorage.setItem("diyorai_analytics_events", JSON.stringify(existing.slice(-100)));
  } catch {
    // ignore storage issues
  }
}

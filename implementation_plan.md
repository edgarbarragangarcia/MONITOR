# Real Data Integration Plan

I have successfully updated the dashboard to use "real" simulated data instead of hardcoded placeholder values.

## Changes Made

1.  **Centralized Data**: Created `src/lib/data.ts` to store the list of users (`USERS`). This is now the single source of truth.
2.  **Updated ChatContext**:
    *   The `ChatContext` now imports `USERS` and uses `USERS.length` to initialize the `activeUsers` metric.
    *   Metrics like `totalChats` and `messagesByHour` are now dynamically calculated (preserving a base count to simulate historical data).
3.  **Updated Sidebar**: The `Sidebar` component (`src/components/dashboard/sidebar.tsx`) now renders the list directly from `src/lib/data.ts` instead of its own internal array.
4.  **Updated Analytics**: The "Active Users" card in `/dashboard/analytics` now correctly reflects the count from the context (9 users).

## Verification

I verified the changes by:
1.  Navigating to `/dashboard/analytics`.
2.  Checking the "Active Users" card.
3.  Confirming it now displays **9**, which matches the number of users in our data file.

This ensures that as you add or remove users from `src/lib/data.ts` (or eventually fetch them from a database), the count in the dashboard will update automatically.

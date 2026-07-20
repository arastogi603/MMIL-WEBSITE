# 17. Frontend State Management

## 17.1 Split of Responsibility
| State type | Owner | Examples |
|---|---|---|
| Server state (anything from the API) | **React Query** | events list, user profile, applications, notifications |
| Global client/UI state | **Zustand** | theme (light/dark), sidebar collapsed, active modal, wizard step |
| Local component state | `useState`/`useReducer` | form field focus, dropdown open |
| Form state | **React Hook Form + Zod** | all forms (login, event create, recruitment application) |

Redux Toolkit is listed as an approved alternative to Zustand if the team prefers its
devtools/middleware ecosystem for a larger admin surface — the pattern below is written
Zustand-first but the same slice boundaries apply 1:1 to an RTK `createSlice` setup.

## 17.2 React Query Conventions
- **Query keys:** hierarchical arrays, e.g. `["events", { page, filters }]`,
  `["events", eventId]`, `["events", eventId, "registrations"]` — enables targeted
  invalidation (`invalidateQueries(["events"])` busts all event queries;
  `invalidateQueries(["events", eventId])` busts just one).
- **staleTime** tuned per resource: highly dynamic (registrations count) 15s; moderately
  dynamic (events, blogs lists) 60s; near-static (FAQs, resources, sponsors) 10 minutes.
- **Optimistic updates** used for: marking a notification read, toggling event registration
  cancel — `onMutate` writes the optimistic cache value, `onError` rolls back via the snapshot,
  `onSettled` refetches for eventual consistency.
- **Mutations** always go through a typed wrapper in `lib/api/*.ts`; components never
  construct request bodies inline — they call `useCreateEvent()` etc., which wraps
  `useMutation` with the correct query-key invalidation baked in.

```ts
// lib/hooks/useEvents.ts (representative pattern)
export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.list(params),
    staleTime: 60_000,
  });
}

export function useRegisterForEvent(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => eventsApi.register(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events", eventId] });
      qc.invalidateQueries({ queryKey: ["portal", "my-events"] });
    },
  });
}
```

## 17.3 Zustand Store Shape
```ts
// lib/store/ui.store.ts
interface UIState {
  theme: "light" | "dark";
  isAdminSidebarCollapsed: boolean;
  activeModal: string | null;
  setTheme: (t: "light" | "dark") => void;
  toggleAdminSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}
```
Only UI-shaped state lives here — never server data (no caching a fetched `events` array in
Zustand; that is React Query's job exclusively, to avoid two sources of truth).

## 17.4 API Layer (single contract surface)
```ts
// lib/api/client.ts
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retried) {
      error.config._retried = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) return api(error.config);
      logout();
    }
    return Promise.reject(error);
  }
);
```
Every resource module (`lib/api/events.ts`) exports typed functions (`list`, `get`, `create`,
`update`, `remove`, plus resource-specific actions like `register`, `publish`) whose input/
output types are generated from (or hand-kept in sync with) the OpenAPI spec in
`08-api-design-and-openapi.md` and the JSON Schemas in `09-json-schemas.md`.

## 17.5 Hooks Convention
One hooks file per resource under `lib/hooks/`, re-exporting a consistent naming scheme:
`use<Resource>List`, `use<Resource>`, `useCreate<Resource>`, `useUpdate<Resource>`,
`useDelete<Resource>`, plus resource-specific action hooks (`useRegisterForEvent`,
`useSubmitApplication`, `useMarkAttendance`). Components only ever import from `lib/hooks`,
never from `lib/api` directly — keeping React Query as the sole data-fetching boundary in
component code.

## 17.6 Caching & Invalidation Map (selected)
| Mutation | Invalidates |
|---|---|
| Create/Publish event | `["events"]` list, `["events", id]` |
| Register for event | `["events", id]`, `["portal","my-events"]` |
| Submit application | `["applications","me"]`, admin `["recruitment-cycles", cycleId, "applications"]` |
| Update application status (admin) | `["recruitment-cycles", cycleId, "applications"]`, `["applications","me"]` for that user (via websocket/poll or next fetch) |
| Approve project | `["projects"]`, `["projects", id]` |

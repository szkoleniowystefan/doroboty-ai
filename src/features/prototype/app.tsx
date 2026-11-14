import { useEffect, useRef } from "react";
import { usePostHog } from "@posthog/react";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import { currentPerson } from "./model";
import { PrototypeProvider, usePrototype } from "./store";
import { Shell, NotFound } from "./shell";
import HomePage from "./home";
import MethodologyPage from "./methodology";
import { JobsPage, JobPage, CompanyPage } from "./marketplace";
import {
  PersonPicker,
  RequireRole,
  WorkspaceHome,
  ProfilePage,
  SavedPage,
  ApplyPage,
  ApplicationsPage,
  ApplicationDetail,
} from "./workspace";
import { EmployerJobs, EmployerJobEditor, CompanyEditor } from "./employer";
import { SettingsPage, PrivacyPage } from "./settings";
import { CasePage } from "./case";
import { WorkSamplePage } from "./work-sample";
function PostHogIdentity() {
  const posthog = usePostHog();
  const { state } = usePrototype();
  const person = currentPerson(state);
  const personId = person?.id;
  const personName = person?.name;
  const personRole = person?.role;
  const previousPersonId = useRef<string | null | undefined>(undefined);
  const isConfigured = Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  );

  useEffect(() => {
    if (!isConfigured) return;

    if (!personId || !personName || !personRole) {
      if (previousPersonId.current) posthog.reset();
      previousPersonId.current = null;
      return;
    }

    if (previousPersonId.current && previousPersonId.current !== personId) posthog.reset();

    posthog.identify(personId, {
      name: personName,
      role: personRole,
    });
    previousPersonId.current = personId;
  }, [isConfigured, personId, personName, personRole, posthog]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="oferty" element={<JobsPage />} />
        <Route path="oferty/:slug" element={<JobPage />} />
        <Route path="firmy/:slug" element={<CompanyPage />} />
        <Route path="metodologia" element={<MethodologyPage />} />
        <Route path="polityka-prywatnosci" element={<PrivacyPage />} />
        <Route path="auth/:mode" element={<PersonPicker />} />
        <Route path="aplikuj/:slug/przygotowanie" element={<WorkSamplePage />} />
        <Route path="aplikuj/:slug/zadanie" element={<WorkSamplePage view="task" />} />
        <Route path="aplikuj/:slug/podsumowanie" element={<WorkSamplePage view="summary" />} />
        <Route
          path="aplikuj/:slug"
          element={
            <RequireRole role="candidate">
              <ApplyPage />
            </RequireRole>
          }
        />
        <Route
          path="app"
          element={
            <RequireRole>
              <WorkspaceHome />
            </RequireRole>
          }
        />
        <Route path="app/onboarding" element={<Navigate to="/app/profil" replace />} />
        <Route
          path="app/profil"
          element={
            <RequireRole role="candidate">
              <ProfilePage />
            </RequireRole>
          }
        />
        <Route
          path="app/profil/podglad"
          element={
            <RequireRole role="candidate">
              <ProfilePage preview />
            </RequireRole>
          }
        />
        <Route
          path="app/zapisane"
          element={
            <RequireRole role="candidate">
              <SavedPage />
            </RequireRole>
          }
        />
        <Route
          path="app/aplikacje"
          element={
            <RequireRole role="candidate">
              <ApplicationsPage />
            </RequireRole>
          }
        />
        <Route
          path="app/aplikacje/:id"
          element={
            <RequireRole role="candidate">
              <ApplicationDetail />
            </RequireRole>
          }
        />
        <Route
          path="app/aplikacje/:id/wyslano"
          element={
            <RequireRole role="candidate">
              <ApplicationDetail />
            </RequireRole>
          }
        />
        <Route
          path="app/oferty"
          element={
            <RequireRole role="employer">
              <EmployerJobs />
            </RequireRole>
          }
        />
        <Route
          path="app/oferty/:id"
          element={
            <RequireRole role="employer">
              <EmployerJobEditor />
            </RequireRole>
          }
        />
        <Route
          path="app/organizacja"
          element={
            <RequireRole role="employer">
              <CompanyEditor />
            </RequireRole>
          }
        />
        <Route
          path="app/kandydaci"
          element={
            <RequireRole role="employer">
              <ApplicationsPage employer />
            </RequireRole>
          }
        />
        <Route
          path="app/kandydaci/:id"
          element={
            <RequireRole role="employer">
              <ApplicationDetail employer />
            </RequireRole>
          }
        />
        <Route
          path="app/case"
          element={
            <RequireRole role="operator">
              <CasePage />
            </RequireRole>
          }
        />
        <Route path="app/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export function App() {
  return (
    <PrototypeProvider>
      <PostHogIdentity />
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </PrototypeProvider>
  );
}

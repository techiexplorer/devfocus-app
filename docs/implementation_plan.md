# Implementation Plan - Fix Theme Toggle

The theme toggle is not working because the `ThemeProvider` context is not wrapping the application, causing `useTheme` to fail or return undefined context (though the error message suggests it should throw). Additionally, there is a duplicate/conflicting `useTheme` hook in `src/hooks/useTheme.ts`.

## User Review Required
- [ ] Confirm if removing "System" theme preference is acceptable. (Proceeding with removing it to simplify to a standard Light/Dark toggle for "changing the icon" part).

## Proposed Changes

### Core Logic
#### [MODIFY] [main.tsx](file:///c:/Users/techi/workp/devfocus.app/src/main.tsx)
- Import `ThemeProvider` from `./components/theme-provider`.
- Wrap `<App />` with `<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">`.

#### [DELETE] [useTheme.ts](file:///c:/Users/techi/workp/devfocus.app/src/hooks/useTheme.ts)
- Delete this file as it conflicts with `components/theme-provider.tsx` and is not used correctly.

### UI Components
#### [MODIFY] [Header.tsx](file:///c:/Users/techi/workp/devfocus.app/src/components/layout/Header.tsx)
- Update `toggleTheme` to switch between 'light' and 'dark'.
- Update `getThemeIcon` to show simpler icons (e.g. Moon for Dark, Sun for Light).
- Ensure imports are correct.

## Verification Plan
### Manual Verification
- Run `npm run dev` (already running).
- Open browser.
- Click theme toggle button in Header.
- Verify class `dark` is added/removed from `<html>`.
- Verify icon changes.
- Verify persistence on reload.

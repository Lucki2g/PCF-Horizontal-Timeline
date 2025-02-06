import { useState } from "react";

export interface SettingsState {
  showlines: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    showlines: false,
  });

  const updateShowlines = (showlines: boolean) =>
    setSettings((prev) => ({ ...prev, showlines }));

  return { settings: settings, updateShowlines };
};

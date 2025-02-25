import * as React from "react";
import { I18nextProvider } from "react-i18next";
import { FilterProvider } from "../contexts/filter-context";
import i18n from "../contexts/i18n";
import { DialogProvider } from "../contexts/dialog-context";
import Timeline from "./Timeline";
import { IInputs } from "../generated/ManifestTypes";
import { GlobalProvider } from "../contexts/global-context";

interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export default function App({ context }: IAppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <GlobalProvider>
        <Timeline context={context} />
      </GlobalProvider>
    </I18nextProvider>
  );
}

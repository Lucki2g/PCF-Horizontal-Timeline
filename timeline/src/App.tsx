import * as React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../contexts/i18n";
import Timeline from "./Timeline";
import { IInputs } from "../generated/ManifestTypes";
import { GlobalProvider } from "../contexts/global-context";
import { webLightTheme } from "@fluentui/react-theme";
import { FluentProvider } from "@fluentui/react-provider";

interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export default function App({ context }: IAppProps) {

  // Get all elements with the class
  const elements = document.querySelectorAll('.fui-FluentProvider');

  // Find the outermost one (closest to the root of the DOM)
  const outermost: HTMLElement | null = Array.from(elements).find(el => {
    // None of its ancestors also have the same class
    return !el.closest('.fui-FluentProvider') || el.closest('.fui-FluentProvider') === el;
  }) as HTMLElement ?? null;

  return (
    <FluentProvider theme={webLightTheme}>
      <I18nextProvider i18n={i18n}>
        <GlobalProvider>
          <Timeline context={context} fluentProviderMount={outermost} />
        </GlobalProvider>
      </I18nextProvider>
    </FluentProvider>
  );
}

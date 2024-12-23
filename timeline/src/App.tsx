import * as React from 'react'
import { I18nextProvider } from 'react-i18next'
import { FilterProvider } from '../contexts/filter-context'
import i18n from '../contexts/i18n'
import { ActivityTypeOptions } from './icons/Icon'
import { DialogProvider } from '../contexts/dialog-context'
import Timeline from './Timeline'
import { IInputs } from '../generated/ManifestTypes'

interface IAppProps {
    context: ComponentFramework.Context<IInputs>;
}

export default function App({ context }: IAppProps) {
    return (
        <I18nextProvider i18n={i18n}>
            <FilterProvider>
                <DialogProvider>
                    <Timeline context={context} />
                </DialogProvider>
            </FilterProvider>
        </I18nextProvider>
    )
}

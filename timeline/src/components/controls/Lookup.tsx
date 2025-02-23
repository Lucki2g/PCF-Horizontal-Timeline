import { IEntityReference } from "../TimelineItem";
import { getFluentIcon } from "../../util";
import React, { useEffect } from "react";
import { Combobox, Field, Text, Option, Avatar, Caption1Strong, TagPicker, TagPickerControl, TagPickerGroup, Tag, TagPickerList, TagPickerOption, TagPickerOptionGroup, useTagPickerFilter, TagPickerInput } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { FontIcon } from "@fluentui/react/lib/Icon";
// https://github.com/microsoft/fluentui/wiki/Using-icons/f60fc129945263782708736c8c518b3d30653c8e, https://uifabricicons.azurewebsites.net/, https://www.flicon.io/

interface ILookupProps {
  options: IEntityReference[];
  currentValue: IEntityReference | null;
  label: string;
  description?: string;
  handleChange: (newValue: IEntityReference | null) => void;
}

export default function Lookup({
  options,
  description,
  label,
  currentValue,
  handleChange,
}: ILookupProps) {

  const [query, setQuery] = React.useState<string>(currentValue?.name ?? "");
  const [selectedOption, setSelectedOption] = React.useState<IEntityReference | null>(currentValue);

  const { t } = useTranslation();

  React.useEffect(() => {
    setSelectedOption(currentValue);
  }, [currentValue])

  const onOptionSelect = (_, data) => {
    if (data.value === "no-options") return;

    if (data.selectedOptions.length === 0) return selectOption(null);
    const newest = data.selectedOptions[data.selectedOptions.length - 1];
    selectOption(newest)
  };

  const selectOption = (option: string | null) => {
    const entity = toEntityReference(option);
    setSelectedOption(entity);
    handleChange(entity);
    setQuery("");
  };

  const toEntityReference = (id: string | null) => options.find(o => o.id === id) ?? null;

  const mappedOptions = options
    .reduce((acc: IEntityReference[], option: IEntityReference) => {
      const exists = acc.some((o) => o.id === option.id);
      return exists ? acc : [...acc, option];
    }, []).map((o) => o.id);

  const teams = useTagPickerFilter({
    query,
    options: mappedOptions,
    noOptionsElement: (
      <TagPickerOption value="no-options">
        No matches found
      </TagPickerOption>
    ),
    renderOption: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return <></>;
      return (
        <TagPickerOption 
          secondaryContent={optionData.entitytype}
          media={
            <Avatar 
              shape="square"
              color="colorful"
              idForColor={optionData.name}
              icon={<FontIcon iconName="Group" />}
            />
          }
          key={option}
          value={option}>
            {optionData.name}
      </TagPickerOption>
      )
    },
    filter: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return false;

      return option !== (selectedOption?.id ?? "") && 
        optionData.name.toLowerCase().includes(query.toLowerCase()) &&
        optionData.entitytype === "team"
    }
  });

  const users = useTagPickerFilter({
    query,
    options: mappedOptions,
    noOptionsElement: (
      <TagPickerOption value="no-matches">
        No matches found
      </TagPickerOption>
    ),
    renderOption: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return <></>;
      return (
        <TagPickerOption 
          secondaryContent={optionData.entitytype}
          media={
            <Avatar 
              shape="square"
              color="colorful"
              idForColor={optionData.name}
              icon={<FontIcon iconName="Contact" />}
            />
          }
          key={option}
          value={option}>
            {optionData.name}
      </TagPickerOption>
      )
    },
    filter: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return false;

      return optionData.id !== (selectedOption?.id ?? "") && 
        optionData.name.toLowerCase().includes(query.toLowerCase()) &&
        optionData.entitytype === "systemuser"
    }
  });

  return (
    <Field label={label} orientation="horizontal" className="relative w-full my-1">
      <TagPicker
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOption ? [selectedOption.name] : []}
        appearance="filled-darker"
      >
        <TagPickerControl>
          <TagPickerGroup>
            {
              selectedOption ? <Tag value={selectedOption.name} shape="rounded" media={
                <Avatar 
                  shape="square"
                  color="colorful"
                  idForColor={selectedOption.name}
                  icon={<FontIcon iconName={selectedOption.entitytype === "team" ? "Group" : "Contact"} />}
                />
              }>
                {selectedOption.name}
              </Tag> : <></>
            }
          </TagPickerGroup>
          <TagPickerInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </TagPickerControl>
        <TagPickerList>
          <TagPickerOptionGroup label={t("teams")}>
            {teams}
          </TagPickerOptionGroup>
          <TagPickerOptionGroup label={t("users")}>
            {users}
          </TagPickerOptionGroup>
        </TagPickerList>
      </TagPicker>
    </Field>
  );
}

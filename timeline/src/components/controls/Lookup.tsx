import { IEntityReference } from "../TimelineItem";
import * as React from "react";
import { Field } from "@fluentui/react-field";
import { Avatar } from "@fluentui/react-avatar";
import { Tag } from "@fluentui/react-tags"
import { TagPicker, TagPickerControl, TagPickerGroup, TagPickerList, TagPickerOption, TagPickerOptionGroup, useTagPickerFilter, TagPickerInput } from '@fluentui/react-tag-picker';
import { useTranslation } from "react-i18next";
import { getIconClassName } from "@fluentui/style-utilities";
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
  const [selectedOption, setSelectedOption] =
    React.useState<IEntityReference | null>(currentValue);

  const { t } = useTranslation();

  React.useEffect(() => {
    setSelectedOption(currentValue);
  }, [currentValue]);

  const onOptionSelect = (_: any, data: any) => {
    if (data.value === "no-options") return;

    if (data.selectedOptions.length === 0) return selectOption(null);
    const newest = data.selectedOptions[data.selectedOptions.length - 1];
    selectOption(newest);
  };

  const selectOption = (option: string | null) => {
    const entity = toEntityReference(option);
    setSelectedOption(entity);
    handleChange(entity);
    setQuery("");
  };

  const toEntityReference = (id: string | null) =>
    options.find((o) => o.id === id) ?? null;

  const mappedOptions = options
    .reduce((acc: IEntityReference[], option: IEntityReference) => {
      const exists = acc.some((o) => o.id === option.id);
      return exists ? acc : [...acc, option];
    }, [])
    .map((o) => o.id);

  const teams = useTagPickerFilter({
    query,
    options: mappedOptions,
    noOptionsElement: (
      <TagPickerOption value="no-options">{t("lookup_nomatches")}</TagPickerOption>
    ),
    renderOption: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return <></>;
      return (
        <TagPickerOption
          secondaryContent={t(optionData.entitytype)}
          media={
            <Avatar
              shape="square"
              color="colorful"
              idForColor={optionData.name}
              icon={<i className={`${getIconClassName("Group")} h-[24px] w-[24px] text-[24px]`} />}
            />
          }
          key={option}
          value={option}
        >
          {optionData.name}
        </TagPickerOption>
      );
    },
    filter: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return false;

      return (
        option !== (selectedOption?.id ?? "") &&
        optionData.name.toLowerCase().includes(query.toLowerCase()) &&
        optionData.entitytype === "team"
      );
    },
  });

  const users = useTagPickerFilter({
    query,
    options: mappedOptions,
    noOptionsElement: (
      <TagPickerOption value="no-matches">{t("lookup_nomatches")}</TagPickerOption>
    ),
    renderOption: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return <></>;
      return (
        <TagPickerOption
          secondaryContent={t(optionData.entitytype)}
          media={
            <Avatar
              shape="square"
              color="colorful"
              idForColor={optionData.name}
              icon={<i className={`${getIconClassName("Contact")} h-[24px] w-[24px] text-[24px]`} />}
            />
          }
          key={option}
          value={option}
        >
          {optionData.name}
        </TagPickerOption>
      );
    },
    filter: (option) => {
      const optionData = toEntityReference(option);
      if (!optionData) return false;

      return (
        optionData.id !== (selectedOption?.id ?? "") &&
        optionData.name.toLowerCase().includes(query.toLowerCase()) &&
        optionData.entitytype === "systemuser"
      );
    },
  });

  return (
    <Field
      label={label}
      orientation="horizontal"
      className="relative my-1 w-full"
    >
      <TagPicker
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOption ? [selectedOption.name] : []}
        appearance="filled-darker"
      >
        <TagPickerControl expandIcon={<i className={`${getIconClassName("Search")} text-[11px]`} />}>
          <TagPickerGroup>
            {selectedOption ? (
              <Tag
                value={selectedOption.name}
                shape="rounded"
                dismissIcon={<i className={`${getIconClassName("ChromeClose")} text-[11px]`} />}
                media={
                  <Avatar
                    shape="square"
                    color="colorful"
                    idForColor={selectedOption.name}
                    icon={
                       <i className={`${getIconClassName(selectedOption.entitytype === "team" ? "Group" : "Contact")} h-[20px] w-[20px] text-[11px] flex justify-center items-center`} />
                    }
                  />
                }
              >
                {selectedOption.name}
              </Tag>
            ) : (
              <></>
            )}
          </TagPickerGroup>
          <TagPickerInput
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </TagPickerControl>
        <TagPickerList>
          <TagPickerOptionGroup label={t("lookup_teams")}>
            {teams}
          </TagPickerOptionGroup>
          <TagPickerOptionGroup label={t("lookup_users")}>
            {users}
          </TagPickerOptionGroup>
        </TagPickerList>
      </TagPicker>
    </Field>
  );
}

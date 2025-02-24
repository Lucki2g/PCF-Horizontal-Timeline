import * as React from "react";
import { Field, Input } from "@fluentui/react-components";

interface ISearchProps {
  label: string;
  value: string;
  description?: string;
  onChange: (value: string) => void;
}

export default function Search({
  label,
  value,
  description,
  onChange,
}: ISearchProps) {
  return (
    <Field label={label} className="my-1 w-full" orientation="horizontal">
      <Input
        value={value}
        type="text"
        appearance="filled-darker"
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </Field>
  );
}

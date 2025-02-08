import * as React from "react";
import { IEntityReference, TimelineItem } from "../TimelineItem";
import { getIcon } from "../../util";

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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>(currentValue?.name ?? "");
  const [focused, setFocused] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isOpen && query) setQuery("");
  }, [isOpen]);

  const selectOption = (option: IEntityReference) => {
    setQuery("");
    handleChange(option);
    setIsOpen((isOpen) => !isOpen);
  };

  const toggle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent> | MouseEvent,
  ) => {
    setIsOpen(e && e.target === inputRef.current);
  };

  const filter = (options: IEntityReference[]) => {
    return options
      .filter((option: IEntityReference) => {
        return option.name.toLowerCase().includes(query.toLowerCase());
      })
      .reduce((acc: IEntityReference[], option: IEntityReference) => {
        const exists = acc.some((o) => o.id === option.id);
        return exists ? acc : [...acc, option];
      }, []);
  };

  React.useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const getInput = (): string => {
    if (query) return query;
    if (currentValue) return currentValue.name;
    return "";
  };

  return (
    <div className="my-2 w-full flex-col">
      <div className="relative w-full">
        <input
          ref={inputRef}
          value={getInput()}
          onChange={(e) => {
            setQuery(e.target.value);
            handleChange(null);
          }}
          onClick={toggle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="text"
          tabIndex={1}
          className="peer box-border w-full rounded-[4px] bg-neutral-100 p-2 pt-5 focus:outline-none"
        ></input>

        <div
          className="absolute left-2 flex items-center transition-[top]"
          style={{ top: focused || getInput().length > 0 ? "2px" : "14px" }}
        >
          <span className="h-5 w-5 p-1">
            <span className="material-symbols-rounded">search</span>
          </span>
          <label
            className={`text-start font-semibold tracking-wide transition-all duration-150 ${focused ? "text-cyan-400" : "text-gray-500"} ${focused || getInput().length > 0 ? "text-xs" : "text-sm"}`}
          >
            {label}
          </label>
        </div>

        {description ? (
          <p className="text-[8px] text-gray-400">{description}</p>
        ) : (
          <></>
        )}
        {/* DROP DOWN */}
        <div
          className={`${isOpen ? "h-auto max-h-32 overflow-y-auto p-2 shadow-dynamics" : "h-0 p-0"} absolute top-14 z-50 flex w-full flex-col rounded-[4px] bg-white transition-all duration-150`}
        >
          {isOpen ? (
            filter(options).map((user) => {
              return (
                <button
                  key={`filter-${user.id}`}
                  className="flex w-full items-center rounded-[4px] p-1 transition-all duration-150 hover:bg-gray-50"
                  onClick={() => selectOption(user)}
                >
                  <span className="mr-2 h-4 w-4">
                    {getIcon(user.entitytype)}
                  </span>
                  <div className="flex flex-col text-start">
                    <p className="semibold truncate text-sm text-dynamics-text">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.entitytype}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <></>
          )}
        </div>
        <div
          className={`peer-focus:transform-origin-center absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform rounded-b-[4px] bg-gradient-to-r from-cyan-400 to-sky-600 transition-all duration-300 peer-focus:w-full`}
        ></div>
      </div>
    </div>
  );
}

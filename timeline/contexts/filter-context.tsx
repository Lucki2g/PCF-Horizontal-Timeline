import * as React from "react";
import { IEntityReference, TimelineItem } from "../src/components/TimelineItem";

export interface FilterState {
  search: string;
  itemTypes: Record<string, boolean>;
  startDate: Date;
  endDate: Date;
  owner: IEntityReference | null;
}

interface FilterContextProps {
  initialState: FilterState;
  filter: FilterState;
  initialize: (initialState: FilterState) => void;
  updateSearch: (search: string) => void;
  toggleItemType: (type: string) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  resetFilters: () => void;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  filterItems: (filter: FilterState, items: TimelineItem[]) => TimelineItem[];
}

// Create the context
const FilterContext = React.createContext<FilterContextProps | undefined>(
  undefined,
);

// Provider Component
export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialState, setInitialState] = React.useState<FilterState>(
    {} as FilterState,
  );
  const [filter, setFilter] = React.useState<FilterState>({} as FilterState);

  const updateSearch = (search: string) =>
    setFilter((prev) => ({ ...prev, search }));

  const toggleItemType = (type: string) => {
    setFilter((prev) => {
      const updatedFilter = {
        ...prev,
        itemTypes: {
          ...prev.itemTypes,
          [type]: !prev.itemTypes[type],
        },
      };
      return updatedFilter;
    });
  };

  const setStartDate = (date: Date) =>
    setFilter((prev) => ({ ...prev, startDate: date }));
  const setEndDate = (date: Date) =>
    setFilter((prev) => ({ ...prev, endDate: date }));

  const resetFilters = () => setFilter(initialState);

  const initialize = (state: FilterState) => {
    setInitialState(state);
    setFilter(state);
  };

  const filterItems = (filter: FilterState, items: TimelineItem[]) => {
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(filter.search) &&
        filter.itemTypes[i.type] &&
        i.date !== null &&
        filter.startDate <= i.date &&
        i.date <= filter.endDate &&
        (filter.owner ? i.owned?.id === filter.owner?.id : true),
    );
  };

  return (
    <FilterContext.Provider
      value={{
        filter,
        initialState,
        filterItems,
        initialize,
        setFilter,
        setStartDate,
        setEndDate,
        updateSearch,
        toggleItemType,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextProps => {
  const context = React.useContext(FilterContext);
  if (!context)
    throw new Error("useFilter must be used within a FilterProvider");
  return context;
};

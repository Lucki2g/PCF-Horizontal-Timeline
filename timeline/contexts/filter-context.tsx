import * as React from "react";

export interface FilterState {
    search: string;
    itemTypes: Record<string, boolean>;
    startDate: Date;
    endDate: Date;
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
}

// Create the context
const FilterContext = React.createContext<FilterContextProps | undefined>(undefined);

// Provider Component
export const FilterProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [initialState, setInitialState] = React.useState<FilterState>({ } as FilterState);
    const [filter, setFilter] = React.useState<FilterState>({ } as FilterState);

    const updateSearch = (search: string) => setFilter((prev) => ({ ...prev, search }));

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

    const setStartDate = (date: Date) => setFilter((prev) => ({ ...prev, startDate: date }));
    const setEndDate = (date: Date) => setFilter((prev) => ({ ...prev, endDate: date }));

    const resetFilters = () => setFilter(initialState);

    const initialize = (state: FilterState) => {
        setInitialState(state);
        setFilter(state);
    }

    return (<FilterContext.Provider value={{ filter, initialState, initialize, setStartDate, setEndDate, updateSearch, toggleItemType, resetFilters }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = (): FilterContextProps => {
    const context = React.useContext(FilterContext);
    if (!context) throw new Error("useFilter must be used within a FilterProvider");
    return context;
};

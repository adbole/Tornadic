import React from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { vars } from "ts/StyleMixins";

import Input from "./Input";
import InputGroup from "./InputGroup";


const SearchBar = styled(InputGroup)({ display: "flex" });
const SearchResults = styled.ul({
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    textAlign: "left",
    listStyle: "none",
    gap: "5px",
    borderRadius: vars.inputBorderRadius,
    backgroundColor: vars.backgroundLayer,
});

const shine = keyframes({ to: { backgroundPositionX: "-200%" } });

const TextLoader = styled.span({
    display: "block",
    height: "1.5rem",
    borderRadius: "5px",
    background: "linear-gradient(135deg, transparent 40%, #f5f5f51a 50%, transparent 60%)",
    backgroundSize: "200% 100%",
    animation: `${shine} 1.5s linear infinite`,
});

export type SearchResult<T> = {
    key: number;
    label: string;
    payload: T;
};

type Props<T> = {
    children: React.ReactNode;
    onGetResults: (query: string) => Promise<SearchResult<T>[]>;
    onSelect: (payload: T) => void;
};

function SearchInput<T>({ children, onGetResults, onSelect }: Props<T>) {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult<T>[]>();
    const [isLoading, setIsLoadingTrue, setIsLoadingFalse] = useBooleanState(false);

    React.useEffect(() => {
        if (!query) return;

        setIsLoadingTrue();
        onGetResults(query).then(results => {
            setResults(results);
            setIsLoadingFalse();
        });
    }, [onGetResults, query, setIsLoadingFalse, setIsLoadingTrue]);

    const delayId = React.useRef<NodeJS.Timeout>();

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (delayId.current) clearTimeout(delayId.current);

        const value = e.currentTarget.value;
        delayId.current = setTimeout(() => setQuery(value), 1000);
    }, []);

    return (
        <>
            <SearchBar>
                <Input
                    type="search"
                    placeholder="Enter a location"
                    onChange={onChange}
                    style={{ flex: 1 }}
                />
                {children}
            </SearchBar>
            {isLoading ? (
                <SearchResults>
                    {Array.from({ length: 5 }, (_, i) => (
                        <li key={i}>
                            <TextLoader />
                        </li>
                    ))}
                </SearchResults>
            ) : (
                results &&
                (results.length ? (
                    <SearchResults>
                        {results?.map(result => (
                            <li key={result.key} onClick={() => onSelect(result.payload)}>
                                {result.label}
                            </li>
                        ))}
                    </SearchResults>
                ) : (
                    <span className="search-results">No Results Found</span>
                ))
            )}
        </>
    );
}

export default SearchInput;

import testIds from "@test-consts/testIDs";

import React from "react";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { Base as SkeletonBase } from "Components/Skeleton/style";

import { vars } from "ts/StyleMixins";

import Input from "./Input";
import InputGroup from "./InputGroup";


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

const TextLoader = styled.span(SkeletonBase, {
    display: "block",
    height: "1.5rem",
    borderRadius: "5px",
});

export type SearchResult<T> = {
    key: number;
    label: string;
    payload: T;
};

type Props<T> = {
    children?: React.ReactNode;
    placeHolder?: string;
    onGetResults: (query: string) => Promise<SearchResult<T>[]>;
    onSelect: (payload: T) => void;
};

function SearchInput<T>({ children, placeHolder, onGetResults, onSelect }: Props<T>) {
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
        clearTimeout(delayId.current);

        const value = e.currentTarget.value;
        delayId.current = setTimeout(() => setQuery(value), 1000);
    }, []);

    return (
        <>
            <InputGroup style={{ display: "flex" }}>
                <Input
                    type="search"
                    placeholder={placeHolder}
                    onChange={onChange}
                    style={{ flex: 1 }}
                />
                {children}
            </InputGroup>
            {isLoading ? (
                <SearchResults>
                    {Array.from({ length: 5 }, (_, i) => (
                        <li key={i}>
                            <TextLoader data-testid={testIds.SearchInput.Skeleton} />
                        </li>
                    ))}
                </SearchResults>
            ) : (
                results &&
                (results.length ? (
                    <SearchResults>
                        {results.map(result => (
                            <li key={result.key} onClick={() => onSelect(result.payload)}>
                                {result.label}
                            </li>
                        ))}
                    </SearchResults>
                ) : (
                    <SearchResults>
                        <li>No Results</li>
                    </SearchResults>
                ))
            )}
        </>
    );
}

export default SearchInput;

import React from "react";

import { useBooleanState } from "Hooks";

import { Modal, ModalContent } from "Contexts/ModalContext";


type SearchResult<T> = {
    key: number,
    label: string,
    payload: T
}

type Props<T> = { 
    children: React.ReactNode 
    onGetResults: (query: string) => Promise<SearchResult<T>[]>
    onSelect: (payload: T) => void 
}

const SearchModal = <T, >({ children, onGetResults, onSelect }: Props<T>) => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult<T>[]>();
    const [isLoading, setIsLoadingTrue, setIsLoadingFalse] = useBooleanState(false);

    React.useEffect(() => {
        if(!query) return;

        setIsLoadingTrue();
        onGetResults(query).then(results => {
            setResults(results);
            setIsLoadingFalse();
        });
    }, [onGetResults, query, setIsLoadingFalse, setIsLoadingTrue]);

    const delayId = React.useRef<NodeJS.Timeout>();

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if(delayId.current) clearTimeout(delayId.current);

        const value = e.currentTarget.value;
        delayId.current = setTimeout(() => setQuery(value), 1000);
    }, []);

    return (
        <Modal>
            <ModalContent>
                <div className="search-bar">
                    <input className="search-input" type="search" placeholder="Enter a location" onChange={onChange}/>
                    {children}
                </div>
                {
                    isLoading ? (
                        <ul className="search-results">
                            <li><span className="text-loader"></span></li>
                            <li><span className="text-loader"></span></li>
                            <li><span className="text-loader"></span></li>
                        </ul>
                    ) : (
                        results && (
                            results.length ? (
                                <ul className="search-results">
                                    {
                                        results?.map(result => <li key={result.key} onClick={() => onSelect(result.payload)}>{result.label}</li>)
                                    }
                                </ul>
                            ) : (
                                <span className="search-results">No Results Found</span>
                            )
                        )
                    )
                }
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
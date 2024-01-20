import React from 'react';

// Use local storage as useState but to keep
// information inside local storage, you can 
// combine this with use between if you want
// it to trigger changes everywhere like in auth
export const useLocalStorage = <T,>(key: string, def: T) => {
    const [value, setValue] = React.useState(JSON.parse(localStorage.getItem(key) || JSON.stringify(def)) as T);

    React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [value]);

    return [value, setValue] as const;
};

// Just attach listener and then remove it
export const useListener = (target: any, event: string, callback: EventListenerOrEventListenerObject, deps: React.DependencyList, options?: any) => {
    React.useEffect(() => {
        target.addEventListener(event, callback, options);
        return () => target.removeEventListener(event, callback);
    }, [...deps, callback]);
};

// <Modal ref={useClickOutside(onHide)}>
export const useClickOutside = (predicate) => {
    const ref = React.useRef(null);

    useListener(window, 'click', (e) => {
        if (!ref.current?.contains(e.target)) {
            predicate();
        }
    }, [predicate]);

    return ref;
};

// Just 2 stupid hooks I use to hack through 
// the bugs of updated / not updated stuff
export const useForceUpdate = ([_, setState] = React.useState(true)) => 
    () => setState((v) => !v);

export const useTicker = ([state, setState] = React.useState(1)) => 
    React.useMemo(() => ({ state, update: () => setState($ => $ + 1) }), [state]);

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

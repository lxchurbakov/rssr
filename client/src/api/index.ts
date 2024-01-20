import qs from 'qs';
import React from 'react';

// import { useBetween } from 'use-between';

import { ArgumentsOf, Tag, Post } from '/src/libs/types';
import { useLocalStorage } from '/src/libs/hooks';

const API_URL = String(process.env.API_URL);

const call = <T>(...args: ArgumentsOf<typeof fetch>): Promise<T> => {
    return fetch(...args).then((r) => {
        if (r.status === 200) {
            return r.json();
        } else {
            return r.json().then((v) => Promise.reject(v));
        }
    });
};

export const useApi = () => {
    const [token, setToken] = useLocalStorage('session', null);

    const headers = React.useMemo(() => ({
        'Content-Type': 'application/json',
        // 'Authorization': token,
    }), [token]);

    return React.useMemo(() => {
        return {
            tags: {
                create: (name: string) => 
                    call(`${API_URL}/tags`, { method: 'POST', headers, body: JSON.stringify({ name }) }),
                search: (query: string) => 
                    call<Tag[]>(`${API_URL}/tags?query=${query}`, { method: 'GET', headers }),
            },
            posts: {
                search: (query: string, page: number, sort: [string, number], tags: string[]) => {
                    return call<{ count: number, time: number, data: Post[] }>(`${API_URL}/posts?${qs.stringify({
                        query, page, sort: sort[0], sortDir: sort[1], tags
                    })}`, { method: 'GET', headers });
                },
                tags: {
                    list: (postId: string) =>
                        call(`${API_URL}/posts/${postId}/tags`, { method: 'GEt', headers }),
                    attach: (postId: string, name: string) => 
                        call(`${API_URL}/posts/${postId}/tags/attach`, { method: 'POST', headers, body: JSON.stringify({ name }) }),
                    detach: (postId: string, name: string) => 
                        call(`${API_URL}/posts/${postId}/tags/detach`, { method: 'POST', headers, body: JSON.stringify({ name }) }),
                },
            },
            
            view: (postId: string) => {
                return call(`${API_URL}/posts/${postId}/view`, { method: 'POST', headers })
            },
        };
    }, [headers, setToken]);
};

// const _useAuth = () => {
//     const api = useApi();

//     const [user, loading] = useAsyncMemo<{ username: string }>(() => api.session.get(), [api]);

//     const login = React.useCallback((username: string, password: string) => {
//         return api.session.post(username, password).then((token) => {
//             api.session.setToken(token);
//         });
//     }, [api]);

//     const logout = React.useCallback(() => {
//         api.session.setToken(null);
//     }, [api]);  

//     return React.useMemo(() => ({ login, logout, user, loading }), [login, logout, user, loading]);
// };

// export const useAuth = () => useBetween(_useAuth);
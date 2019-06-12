import React, { useState, createContext } from 'react';

export const CONTEXT = createContext();

export const CONTEXT_PROVIDER = (props) => {
    const [post, setPost] = useState({
        allPost: []
    });

    return (
        <CONTEXT.Provider value={[post, setPost]}>
            {props.children}
        </CONTEXT.Provider>
    )
}
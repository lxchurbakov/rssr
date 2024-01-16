import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Search from './search';

const app = document.getElementById('app');
const root = createRoot(app);

root.render((
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Search />} />
        </Routes>    
    </BrowserRouter>
));

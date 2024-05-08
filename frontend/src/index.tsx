// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import client from './graphql/client'; // Import the configured Apollo Client instance
import './index.css';
import reportWebVitals from './reportWebVitals';

// Assuring TypeScript that the element exists by checking if it's null.
const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Root container missing in index.html');

// Now we create the root with the non-null HTML element.
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// reportWebVitals is an optional performance monitoring tool
reportWebVitals();
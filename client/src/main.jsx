import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import App from './App.jsx'
import './index.scss'

import { StoreProvider } from './store/index.jsx';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)

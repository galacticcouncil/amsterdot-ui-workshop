import React from 'react';
import { Trade } from './containers/Trade';
import { ConfiguredApolloProvider } from './hooks/useApolloClient';
import { DependencyProvider } from './hooks/useDependencies';

const App: React.FC<{}> = () => {
  return <>
    <DependencyProvider>
      <ConfiguredApolloProvider>
        <Trade />
      </ConfiguredApolloProvider>
    </DependencyProvider>
  </>
}

export default App;

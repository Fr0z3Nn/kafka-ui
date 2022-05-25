import React from 'react';
import { render } from 'lib/testHelpers';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { clusterBrokerPath, clusterBrokersPath } from 'lib/paths';
import Brokers from 'components/Brokers/Brokers';

const brokersList = 'brokersList';
const broker = 'brokers';

jest.mock('components/Brokers/List/BrokersList', () => () => (
  <div>{brokersList}</div>
));
jest.mock('components/Brokers/Broker/Broker', () => () => <div>{broker}</div>);

describe('Topics Component', () => {
  const clusterName = 'clusterName';
  const brokerId = '1';
  const setUpComponent = (path: string) => {
    const history = createMemoryHistory({
      initialEntries: [path],
    });
    return render(
      <Router history={history}>
        <Brokers />
      </Router>
    );
  };

  it('should check if the page is Brokers page', () => {
    setUpComponent(clusterBrokersPath(clusterName));
    expect(screen.getByText(brokersList)).toBeInTheDocument();
  });

  it('should check if the page is Broker page', () => {
    setUpComponent(clusterBrokerPath(clusterName, brokerId));
    expect(screen.getByText(broker)).toBeInTheDocument();
  });
});
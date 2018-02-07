import React from 'react';
import { storiesOf } from '@storybook/react';

import ToggleController from '../src/ToggleController';
import { geoData } from './data';
import { SingleSelection } from './utils';
import Table from './Table';
import UnorderedList from './UnorderedList';
import Selector from './Selector';

storiesOf('Treefold', module)
  .add('controlled', () => (
    <ToggleController>
      {({ isOn, onToggle }) => (
        <UnorderedList
          nodes={geoData}
          isNodeExpanded={isOn}
          onToggleExpand={onToggle}
        />
      )}
    </ToggleController>
  ))
  .add('uncontrolled', () => <UnorderedList nodes={geoData} />)
  .add('with multiple selection', () => (
    <ToggleController nodes={geoData}>{Selector}</ToggleController>
  ))
  .add('with single selection', () => (
    <SingleSelection nodes={geoData}>{Selector}</SingleSelection>
  ))
  .add('table', () => <Table nodes={geoData} />);

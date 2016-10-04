import React from 'react';
import {mount} from 'enzyme';
import File from '../src/client/components/File';

/**
 * Renders a File Component
 */
it('renders a File component', () => {
  const props = {
    comments: [
      {
        propTypes: [
          {
            name: 'name',
            paramType: 'paramType',
            description: 'A test description'
          }
        ]
      }],
    name: 'test'
  };

  const wrapper = mount(
    <File {...props} />
  );

  expect(wrapper.find('h1').text()).toEqual('test');
});

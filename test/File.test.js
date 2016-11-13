import React from 'react';
import {mount} from 'enzyme';
import File from '../src/client/components/File';

/**
 * Renders a File Component
 */
it('renders a File component and displays the name', () => {
  const props = {
    componentProps: [
      {
        name: 'name',
        type: 'type'
      }
    ],
    filename: 'filename',
    name: 'name'
  };

  const wrapper = mount(
    <File {...props} />
  );

  expect(wrapper.find('h3').text()).toEqual('name');
});

it('renders a File component and displays the filename', () => {
  const props = {
    componentProps: [
      {
        name: 'name',
        type: 'type'
      }
    ],
    filename: 'filename',
    name: 'name'
  };

  const wrapper = mount(
    <File {...props} />
  );

  expect(wrapper.find('h4').text()).toEqual('filename');
});

it('renders a File component and displays component props name and type', () => {
  const props = {
    componentProps: [
      {
        name: 'name',
        type: 'type'
      }
    ],
    filename: 'filename',
    name: 'name'
  };

  const wrapper = mount(
    <File {...props} />
  );

  expect(wrapper.find('li').text()).toEqual(`${props.componentProps[0].name} - ${props.componentProps[0].type}`);
});

it('renders a File component and does not display any component props as list-items', () => {
  const props = {
    componentProps: [],
    filename: 'filename',
    name: 'name'
  };

  const wrapper = mount(
    <File {...props} />
  );

  expect(wrapper.find('ul').text()).toEqual('');
});

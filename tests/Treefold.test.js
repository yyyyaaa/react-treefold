import React from 'react';
import { mount } from 'enzyme';
import Treefold from '../src/Treefold';

const buildNodes = ({ idKey = 'id', childrenKey = 'children' } = {}) => [
  {
    [idKey]: 'html',
    name: 'Html document',
    [childrenKey]: [
      {
        [idKey]: 'head',
        name: 'Html head',
        [childrenKey]: [
          { [idKey]: 'meta', name: 'meta' },
          { [idKey]: 'title', name: 'title' },
        ],
      },
      {
        [idKey]: 'body',
        name: 'Html body',
        [childrenKey]: [
          {
            [idKey]: 'h1.title',
            name: 'Page title',
            [childrenKey]: [
              { [idKey]: 'title.link', name: 'Title link', [childrenKey]: [] },
            ],
          },
          {
            [idKey]: 'h2.subtitle',
            name: 'Page subtitle',
            [childrenKey]: [],
          },
          {
            [idKey]: 'ul',
            name: 'List of items',
            [childrenKey]: [
              { [idKey]: 'list-item-1', name: 'Hello' },
              { [idKey]: 'list-item-2', name: 'World' },
            ],
          },
          {
            [idKey]: 'div.footer',
            name: 'Page footer',
          },
        ],
      },
    ],
  },
];

const defaultNodes = buildNodes();

const Node = ({
  node,
  isFolder,
  isExpanded,
  getToggleProps,
  hasChildNodes,
  renderChildNodes,
}) => (
  <li>
    {isFolder ? (
      <a
        id={node.id}
        href="#"
        {...getToggleProps()}
        className={
          isExpanded ? 'item folder expanded' : 'item folder collapsed'
        }
      >
        {node.name}
      </a>
    ) : (
      <span className="item leaf">{node.name}</span>
    )}
    {isExpanded && (
      <ul>
        {hasChildNodes ? (
          renderChildNodes()
        ) : (
          <li className="empty">Empty node</li>
        )}
      </ul>
    )}
  </li>
);

const Tree = props => <Treefold {...props} render={Node} />;

const setup = ({ expanded = [], nodes = defaultNodes, ...props } = {}) => {
  const isNodeExpanded = item =>
    expanded.includes(props.getNodeId ? props.getNodeId(item) : item.id);
  const onToggleExpand = jest.fn();
  const wrapper = mount(
    <Tree
      onToggleExpand={onToggleExpand}
      isNodeExpanded={isNodeExpanded}
      nodes={nodes}
      {...props}
    />
  );
  return { wrapper, onToggleExpand };
};

describe('Treefold', () => {
  describe('expanding and collapsing nodes', () => {
    const testExpandCollapse = testWithEvent => {
      it('allows to expand and collapse nodes using the mouse', () => {
        testWithEvent(item => item.simulate('click'));
      });

      it('allows to expand and collapse nodes using the keyboard', () => {
        testWithEvent(item => item.simulate('keydown', { keyCode: 13 }));
        testWithEvent(item => item.simulate('keydown', { keyCode: 32 }));
      });
    };

    describe('uncontrolled', () => {
      testExpandCollapse(toggleEvent => {
        const wrapper = mount(<Tree nodes={defaultNodes} />);
        expect(wrapper.find('.item')).toHaveLength(1);
        toggleEvent(wrapper.find('.item'));
        expect(wrapper.find('.item')).toHaveLength(3);
        toggleEvent(wrapper.find('.item').at(0));
        expect(wrapper.find('.item')).toHaveLength(1);
      });
    });

    describe('controlled', () => {
      testExpandCollapse(toggleEvent => {
        const { wrapper, onToggleExpand } = setup();
        expect(wrapper.find('.item')).toHaveLength(1);
        toggleEvent(wrapper.find('.item'));
        expect(onToggleExpand.mock.calls.length).toEqual(1);
        expect(onToggleExpand.mock.calls[0][0]).toMatchObject({ id: 'html' });
      });
    });

    it('renders the nodes collapsed or expanded accordingly', () => {
      const { wrapper } = setup({ expanded: ['html', 'body'] });
      expect(wrapper.find('.item')).toHaveLength(7);
      expect(wrapper.find('.item.folder')).toHaveLength(6);
      expect(wrapper.find('.item.folder.expanded')).toHaveLength(2);
      expect(wrapper.find('.item.folder.collapsed')).toHaveLength(4);
      expect(wrapper.find('.item.leaf')).toHaveLength(1);
    });

    it('renders empty folders if possible', () => {
      const { wrapper } = setup({ expanded: ['html', 'body', 'h2.subtitle'] });
      expect(wrapper.find('.empty')).toHaveLength(1);
    });
  });

  describe('working with custom data structures', () => {
    it('supports using a custom field as id', () => {
      const { wrapper } = setup({
        expanded: ['Html document', 'body'],
        getNodeId: item => item.name,
      });
      expect(wrapper.find('.item.expanded')).toHaveLength(1);
    });

    it('supports using a custom field as children', () => {
      const nodes = buildNodes({ childrenKey: 'items' });
      const { wrapper } = setup({
        expanded: ['html'],
        getNodeChildren: item => item.items,
        nodes,
      });
      expect(wrapper.find('.item')).toHaveLength(3);
    });
  });

  describe('render prop', () => {
    it('can be given via the children prop', () => {
      const wrapper = mount(
        <Treefold
          nodes={defaultNodes}
          onToggleExpand={() => {}}
          isNodeExpanded={() => true}
        >
          {Node}
        </Treefold>
      );
      expect(wrapper.find('.item')).toHaveLength(12);
    });
  });
});

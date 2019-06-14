import * as React from 'react';
import { shallow } from 'enzyme';
import { Cell } from './cell';

describe('GroupRowCell', () => {
  it('should assign onClick handler', () => {
    const onToggle = jest.fn();
    const tree = shallow(<Cell onToggle={onToggle} />);

    expect(tree.prop('onClick'))
      .toBe(onToggle);
  });

  it('should render children', () => {
    const tree = shallow((
      <Cell>
        <span className="test" />
      </Cell>
    ));

    expect(tree.find('.test').exists())
      .toBeTruthy();
  });

  it('should pass rest props tp the root element', () => {
    const tree = shallow((
      <Cell data={{ a: 1 }} />
    ));

    expect(tree.prop('data'))
      .toEqual({
        a: 1,
      });
  });
});

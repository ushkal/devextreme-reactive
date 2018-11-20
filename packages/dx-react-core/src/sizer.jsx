/* globals document:true */

import * as React from 'react';
import * as PropTypes from 'prop-types';

const styles = {
  triggersRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    zIndex: -1,
    visibility: 'hidden',
    opacity: 0,
  },
  expandTrigger: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
  contractTrigger: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'auto',
    minHeight: '1px',
    minWidth: '1px',
  },
  contractNotifier: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
  },
};

export class Sizer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.rootRef = React.createRef();
    this.setupListeners = this.setupListeners.bind(this);
  }

  componentDidMount() {
    this.createListeners();
    this.setupListeners();
  }

  setupListeners() {
    // eslint-disable-next-line react/no-find-dom-node
    const rootNode = this.rootRef.current;
    const size = { height: rootNode.clientHeight, width: rootNode.clientWidth };

    this.contractTrigger.scrollTop = size.height;
    this.contractTrigger.scrollLeft = size.width;

    this.expandNotifier.style.width = `${size.width + 1}px`;
    this.expandNotifier.style.height = `${size.height + 1}px`;
    this.expandTrigger.scrollTop = 1;
    this.expandTrigger.scrollLeft = 1;

    const { onSizeChange } = this.props;
    onSizeChange(size);
  }

  createListeners() {
    // eslint-disable-next-line react/no-find-dom-node
    const rootNode = this.rootRef.current;

    this.triggersRoot = document.createElement('div');
    Object.assign(this.triggersRoot.style, styles.triggersRoot);
    rootNode.appendChild(this.triggersRoot);

    this.expandTrigger = document.createElement('div');
    Object.assign(this.expandTrigger.style, styles.expandTrigger);
    this.expandTrigger.addEventListener('scroll', this.setupListeners);
    this.triggersRoot.appendChild(this.expandTrigger);

    this.expandNotifier = document.createElement('div');
    this.expandTrigger.appendChild(this.expandNotifier);

    this.contractTrigger = document.createElement('div');
    Object.assign(this.contractTrigger.style, styles.contractTrigger);
    this.contractTrigger.addEventListener('scroll', this.setupListeners);
    this.triggersRoot.appendChild(this.contractTrigger);

    this.contractNotifier = document.createElement('div');
    Object.assign(this.contractNotifier.style, styles.contractNotifier);
    this.contractTrigger.appendChild(this.contractNotifier);
  }

  render() {
    const {
      onSizeChange,
      containerComponent: Container,
      ...restProps
    } = this.props;

    return (
      <Container // NOTE: should have `position: relative`
        innerRef={this.rootRef}
        {...restProps}
      />
    );
  }
}

Sizer.propTypes = {
  onSizeChange: PropTypes.func.isRequired,
  containerComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

Sizer.defaultProps = {
  containerComponent: 'div',
};

/* globals document:true */

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { RefHolder } from './ref-holder';
import { SizerProps, Size } from './types';

const styles = {
  root: {
    position: 'relative',
  },
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

type Size = {
  width: number;
  height: number;
};

type SizerProps = {
  onSizeChange: (size: Size) => void;
  onScroll?: (e) => void;
  containerComponent?: any;
  style?: object;
  scrollTop?: number;
};

/** @internal */
export class Sizer extends React.PureComponent<SizerProps> {
  static defaultProps = {
    containerComponent: 'div',
  };

  rootRef: React.RefObject<RefHolder>;
  // Though there properties cannot be assigned in constructor
  // they will be assigned when component is mount.
  rootNode!: HTMLElement;
  triggersRoot!: HTMLDivElement;
  expandTrigger!: HTMLDivElement;
  expandNotifier!: HTMLDivElement;
  contractTrigger!: HTMLDivElement;
  contractNotifier!: HTMLDivElement;

  constructor(props) {
    super(props);

    this.setupListeners = this.setupListeners.bind(this);
    this.rootRef = React.createRef();
  }

  componentDidMount() {
    this.createListeners();
    this.setupListeners();
  }

  // There is no need to remove listeners as divs are removed from DOM when component is unmount.
  // But there is a little chance that component unmounting and 'scroll' event happen roughly
  // at the same time so that `setupListeners` is called after component is unmount.
  componentWillUnmount() {
    this.expandTrigger.removeEventListener('scroll', this.setupListeners);
    this.contractTrigger.removeEventListener('scroll', this.setupListeners);
  }

  componentDidUpdate() {
    // this.rootNode.scrollTop = this.props.scrollTop;
  }

  setupListeners() {
    const size: Size = { height: this.rootNode.clientHeight, width: this.rootNode.clientWidth };

    this.contractTrigger.scrollTop = size.height;
    this.contractTrigger.scrollLeft = size.width;

    const scrollOffset = 2;
    this.expandNotifier.style.width = `${size.width + scrollOffset}px`;
    this.expandNotifier.style.height = `${size.height + scrollOffset}px`;
    this.expandTrigger.scrollTop = scrollOffset;
    this.expandTrigger.scrollLeft = scrollOffset;

    const { onSizeChange } = this.props;
    onSizeChange(size);
  }

  createListeners() {
    this.rootNode = findDOMNode(this.rootRef.current!) as HTMLElement;

    this.triggersRoot = document.createElement('div');
    Object.assign(this.triggersRoot.style, styles.triggersRoot);
    this.rootNode.appendChild(this.triggersRoot);

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
      style,
      scrollTop,
      ...restProps
    } = this.props;

    return (
      <RefHolder
        ref={this.rootRef}
      >
        <Container // NOTE: should have `position: relative`
          style={style ? { ...styles.root, ...style } : styles.root}
          {...restProps}
        />
      </RefHolder>
    );
  }
}

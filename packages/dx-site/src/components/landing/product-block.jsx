import * as React from 'react';
import * as PropTypes from 'prop-types';

import styles from './product-block.module.scss';

const ProductLink = ({ type, iconLink, title }) => (
  <div className="col-md-4 col-lg-3">
    <div className={`d-flex flex-column justify-content-center ${styles.container} ${styles[type]}`}>
      <div className="d-flex flex-row justify-content-center align-items-center">
        <img
          className={styles.icon}
          alt="title"
          src={iconLink}
        />
        <div className={styles.title}>
          {title}
        </div>
      </div>
    </div>
  </div>
);

ProductLink.propTypes = {
  type: PropTypes.string.isRequired,
  iconLink: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProductLink;

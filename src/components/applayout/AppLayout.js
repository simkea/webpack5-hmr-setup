import React from 'react';
import PropTypes from 'prop-types';
import styles from './AppLayout.scss';

export default function AppLayout(props) {
    const { children } = props;
    return (
        <div
            className={styles.container}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
        >
            {children}
        </div>
    );
}

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

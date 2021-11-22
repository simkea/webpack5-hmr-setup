import React from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';
import AppLayout from './applayout/AppLayout';
import { IS_STAGE } from '../constants';

export default class App extends React.Component {
    static propTypes = {
        history: PropTypes.object,
    };

    render() {
        const { history } = this.props;
        return (
            <AppLayout>
                <div className={styles.innerContainer}>
                    <h1>{IS_STAGE ? 'STAGING' : 'PRODUCTION'}</h1>
                </div>
            </AppLayout>
        );
    }
}

/**
 * Internal dependencies
 */
import { App } from './containers';
import './export.scss';

/**
 * WordPress dependencies
 */
import { render } from '@wordpress/element';

const rootDiv = document.getElementById( 'asux-export-root' );
render( <App />, rootDiv );

import { __experimentalGetSettings, dateI18n } from '@wordpress/date';

export const prettifyField = ( field ) => {
	const words = field.split( /[-_]/ );

	for ( let i = 0; i < words.length; i++ ) {
		let word = words[ i ];
		words[ i ] = word.charAt( 0 ).toUpperCase() + word.slice( 1 );
	}

	return words.join( ' ' );
};

export const displayDate = ( date, convertToMilliseconds = false ) => {
	const settings = __experimentalGetSettings();

	if ( convertToMilliseconds ) {
		date *= 1000;
	}

	return dateI18n( settings.formats.datetime, date );
};

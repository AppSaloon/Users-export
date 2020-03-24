import React, { useEffect, useState } from '@wordpress/element';
import { PanelRow, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { RestrictedFormTokenField } from './';

export const prettifyField = ( field ) => {
	const words = field.split( /[-_]/ );

	for ( let i = 0; i < words.length; i++ ) {
		let word = words[ i ];
		words[ i ] = word.charAt( 0 ).toUpperCase() + word.slice( 1 );
	}

	return words.join( ' ' );
};

const FieldSelector = ( { value, onChange, ...props } ) => {
	const [ isLoading, setLoading ] = useState( true );
	const [ fieldSelectors, setFieldSelectors ] = useState( {
		userFields: [],
		metaFields: [],
	} );

	const processChanges = ( changes ) => {
		const newValue = { ...value, ...changes };

		if ( newValue !== value ) {
			onChange( newValue );
		}
	};

	useEffect( () => {
		let mounted = true;

		( async () => {
			const request = await apiFetch( {
				path: `/asux/v1/fields`,
			} );

			if ( request.success && mounted ) {
				const {
					user_fields: userFields,
					meta_fields: metaFields,
				} = request.data;

				setFieldSelectors( {
					userFields,
					metaFields,
				} );

				setLoading( false );
			}
		} )();

		return () => {
			mounted = false;
		};
	}, [] );

	return (
		<>
			<PanelRow>
				<RestrictedFormTokenField
					disabled={ isLoading }
					label={ __( 'User fields', 'asux' ) }
					placeholder={ __(
						'What user fields would you like to include?',
						'asux'
					) }
					suggestions={ fieldSelectors.userFields }
					onChange={ ( tokens ) =>
						processChanges( { userFields: tokens } )
					}
					value={ value.userFields }
					help={ __(
						'Select the core user fields to include in the export.',
						'asux'
					) }
					displayTransform={ ( token ) => prettifyField( token ) }
					{ ...props }
				/>
			</PanelRow>
			<PanelRow>
				<RestrictedFormTokenField
					disabled={ isLoading }
					label={ __( 'Meta fields', 'asux' ) }
					placeholder={ __(
						'What meta fields would you like to include?',
						'asux'
					) }
					help={ __(
						'Select the user-related fields to include in the export.',
						'asux'
					) }
					suggestions={ fieldSelectors.metaFields }
					onChange={ ( tokens ) =>
						processChanges( { metaFields: tokens } )
					}
					value={ value.metaFields }
					displayTransform={ ( token ) => prettifyField( token ) }
					{ ...props }
				/>
			</PanelRow>
		</>
	);
};

export default FieldSelector;

import React, { useEffect, useState } from '@wordpress/element';
import { PanelRow, Spinner, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { MultiSelectField, RestrictedFormTokenField } from './';

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
				{ isLoading ? (
					<Spinner />
				) : (
					<MultiSelectField
						label={ __( 'Standard user fields', 'asux' ) }
						controlLabel={ __(
							'Click or start typing to add fields',
							'asux'
						) }
						suggestions={ fieldSelectors.userFields }
						onChange={ ( tokens ) =>
							processChanges( { userFields: tokens } )
						}
						value={ value.userFields }
						help={ __(
							'Select the standard user fields to include as columns in the export file.',
							'asux'
						) }
						{ ...props }
					/>
				) }
			</PanelRow>
			<PanelRow>
				{ isLoading ? (
					<Spinner />
				) : (
					<MultiSelectField
						label={ __( 'Extra meta fields', 'asux' ) }
						controlLabel={ __(
							'Click or start typing to add fields',
							'asux'
						) }
						suggestions={ fieldSelectors.metaFields }
						onChange={ ( tokens ) =>
							processChanges( { metaFields: tokens } )
						}
						value={ value.metaFields }
						help={ __(
							'Select the extra user fields to include as columns in the export file.',
							'asux'
						) }
						{ ...props }
					/>
				) }
			</PanelRow>
		</>
	);
};

export default FieldSelector;

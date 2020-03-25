import React, { useEffect, useState } from '@wordpress/element';
import { PanelRow, FormTokenField, Spinner } from '@wordpress/components';
import { __, _n, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { RestrictedFormTokenField, MultiSelectField } from './';

const RoleSelector = ( { value, ...props } ) => {
	const [ isLoading, setLoading ] = useState( true );
	const [ roles, setRoles ] = useState( {} );

	useEffect( () => {
		let mounted = true;

		( async () => {
			const request = await apiFetch( {
				path: `/asux/v1/roles`,
			} );

			if ( request.success && mounted ) {
				setRoles( request.data );
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
						label={ __( 'Roles', 'asux' ) }
						controlLabel={ __(
							'What roles should be filtered on?',
							'asux'
						) }
						suggestions={ roles }
						value={ value }
						{ ...props }
					/>
				) }
			</PanelRow>
		</>
	);
};

export default RoleSelector;

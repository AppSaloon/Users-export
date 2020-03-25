import React, { useEffect, useState } from '@wordpress/element';
import { PanelRow, FormTokenField, Spinner } from '@wordpress/components';
import { __, _n, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { RestrictedFormTokenField, MultiSelectField } from './';

const RoleSelector = ({roles, value, ...props}) => (
	<>
		<PanelRow>
			{
				roles.loading ? (
				<Spinner/>
			) : (
				<MultiSelectField
					label={__('Roles', 'asux')}
					controlLabel={__(
						'What roles should be filtered on?',
						'asux',
						) }
						suggestions={ roles.roles }
						value={ value }
						{ ...props }
					/>
				) }
			</PanelRow>
		</>
	);

export default RoleSelector;

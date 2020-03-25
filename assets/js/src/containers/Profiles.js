import React, { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import '@wordpress/core-data';
import { IconButton, Spinner } from '@wordpress/components';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';
import apiFetch from '@wordpress/api-fetch';

const displayDate = ( date ) => {
	const settings = __experimentalGetSettings();
	return dateI18n( settings.formats.datetime, date );
};

const Profile = ( {
	onDelete,
	profile: {
		title: { rendered: profileName = 'Export profile' },
		id,
		date,
		modified,
		meta: {
			_asux_last_run: lastRun,
			_asux_filter_roles: roles,
			_asux_filter_date_before: registeredBefore,
			_asux_filter_date_after: registeredAfter,
			_asux_fields: userFields,
			_asux_meta_fields: metaFields,
		},
		_links: {
			'asux:export': [ { href: exportLink } ],
		},
	},
} ) => {
	return (
		<div className="asux__profile">
			<div className="asux__profile-details">
				<h2 className="asux__profile-title">{ profileName }</h2>
				<span className="asux__profile-time">
					{ __( 'Last run: ', 'asux' ) }
					<time>
						{ lastRun
							? displayDate( lastRun * 1000 )
							: __( 'Never', 'asux' ) }
					</time>
				</span>
			</div>
			<div className="asux__profile-actions">
				<IconButton
					onClick={ onDelete }
					icon="trash"
					className="asux__profile-actions-delete"
				/>
				<IconButton href={ exportLink } icon="download" />
			</div>
		</div>
	);
};

const Profiles = ({profiles}) => {
	const trashProfile = useCallback( async ( id ) => {
		await apiFetch( {
			path: `/wp/v2/asux_export-profile/${ id }`,
			method: 'DELETE',
		} );

		window.location.reload();
	} );

	return (
		<div className="asux__profile-container">
			<h2 className="asux__tab-title">
				{ __( 'Existing profiles', 'asux' ) }
			</h2>
			<div className="asux__profiles">
				{ ! profiles ? (
					<Spinner />
				) : (
					profiles.map( ( profile ) => (
						<Profile
							key={ profile.id }
							profile={ profile }
							onDelete={ () => trashProfile( profile.id ) }
						/>
					) )
				) }
				{ profiles && profiles.length === 0 && (
					<em>
						{ __(
							'You have yet to create an export profile.',
							'asux'
						) }
					</em>
				) }
			</div>
		</div>
	);
};

export default Profiles;

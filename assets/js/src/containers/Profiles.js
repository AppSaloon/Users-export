import React from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import '@wordpress/core-data';
import { Spinner } from '@wordpress/components';
import { Profile } from '../components';

const Profiles = ( { profiles, umFields, onProfileTrash } ) => {
	const trashProfile = ( id ) => {
		onProfileTrash( id );
	};

	return (
		<div className="asux__profile-container">
			<h2 className="asux__tab-title">
				{ __( 'Existing profiles', 'asux' ) }
			</h2>
			<div className="asux__profiles">
				{ profiles.loading ? (
					<Spinner />
				) : (
					profiles.profiles.map(
						( profile ) =>
							profile && (
								<Profile
									key={ profile.id }
									profile={ profile }
									umFields={ umFields }
									onDelete={ () =>
										( async ( id ) => {
											confirm(
												__(
													'Are you sure you want to delete this profile?',
													'asux'
												)
											) && trashProfile( id );
										} )( profile.id )
									}
								/>
							)
					)
				) }
				{ ! profiles.loading && profiles.profiles.length === 0 && (
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

import React, { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import '@wordpress/core-data';
import { IconButton } from '@wordpress/components';
import { displayDate } from '../util';
import isEmpty from 'lodash/isEmpty';

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
			_asux_um_fields: umFieldKeys,
		},
		_links: {
			'asux:export': [ { href: exportLink } ],
		},
	},
	umFields,
} ) => {
	const [ isOpen, setOpen ] = useState( false );

	const getUmFieldLabel = (umFieldKey) => {
		const umField = umFields.find(({key}) => key === umFieldKey)
		if (umField && umField.label) {
			return umField.label
		}
		return umFieldKey
	}

	return (
		<div className="asux__profile">
			<div className="asux__profile-information">
				<header
					className="asux__profile-details"
					onClick={ () => setOpen( ( open ) => ! open ) }
				>
					<h2 className="asux__profile-title">{ profileName }</h2>
					<div className="asux__profile-time">
						{ __( 'Last run: ', 'asux' ) }
						<time>
							{ lastRun
								? displayDate( lastRun, true )
								: __( 'Never', 'asux' ) }
						</time>
					</div>
				</header>
				{ isOpen && (
					<div className="asux__profile-settings">
						<h4>{ __( 'Fields', 'asux' ) }</h4>
						<p>
							{ __(
								'These fields are included as columns in this export profile.',
								'asux'
							) }
						</p>
						<div className="asux__profile-settings-columns">
							{ ! isEmpty( userFields ) && (
								<div>
									<strong className="asux__profile-setting-title">
										{ __( 'User fields', 'asux' ) }
									</strong>
									<div className="asux__profile-setting-value">
										{ userFields.map( ( userField ) => (
											<span key={ userField }>
												{ userField }
											</span>
										) ) }
									</div>
								</div>
							) }
							{ ! isEmpty( metaFields ) && (
								<div>
									<strong className="asux__profile-setting-title">
										{ __( 'Meta fields', 'asux' ) }
									</strong>
									<div className="asux__profile-setting-value">
										{ metaFields.map( ( metaField ) => (
											<span key={ metaField }>
												{ metaField }
											</span>
										) ) }
									</div>
								</div>
							) }
							{ ! isEmpty( umFieldKeys ) && (
								<div>
									<strong className="asux__profile-setting-title">
										{ __( 'Ultimate Member fields', 'asux' ) }
									</strong>
									<div className="asux__profile-setting-value">
										{ umFieldKeys.map( ( umFieldKey ) => (
											<span key={ umFieldKey }>
												{ getUmFieldLabel(umFieldKey) }
											</span>
										) ) }
									</div>
								</div>
							) }
						</div>

						<h4>{ __( 'Filters', 'asux' ) }</h4>
						<p>
							{ __(
								'The export will be filtered based on these settings.',
								'asux'
							) }
						</p>
						<div className="asux__profile-settings-columns">
							{ ! isEmpty( roles ) && (
								<div>
									<strong className="asux__profile-setting-title">
										{ __( 'Roles', 'asux' ) }
									</strong>
									<div className="asux__profile-setting-value">
										{ roles.map( ( role ) => (
											<span key={ role }>{ role }</span>
										) ) }
									</div>
								</div>
							) }
							{ ( !! registeredAfter || !! registeredBefore ) && (
								<div>
									<strong className="asux__profile-setting-title">
										{ __( 'Registration date', 'asux' ) }
									</strong>
									{ !! registeredBefore && (
										<div>
											<strong className="asux__profile-setting-title">
												{ __(
													'Registered before',
													'asux'
												) }
											</strong>
											<div className="asux__profile-setting-value">
												<time>
													{ displayDate(
														registeredBefore,
														true
													) }
												</time>
											</div>
										</div>
									) }
									{ !! registeredAfter && (
										<div>
											<strong className="asux__profile-setting-title">
												{ __(
													'Registered after',
													'asux'
												) }
											</strong>
											<div className="asux__profile-setting-value">
												<time>
													{ displayDate(
														registeredAfter,
														true
													) }
												</time>
											</div>
										</div>
									) }
								</div>
							) }
						</div>
					</div>
				) }
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

export default Profile;

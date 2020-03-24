<?php
/**
 * users-export: filters.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 */

use appsaloon\ux\Export\Profile_Manager;

add_filter( 'asux/field-value/wp_capabilities', static function ( $capabilities ) {
	static $roles;
	$roles = Profile_Manager::get_user_roles();

	$capabilities = maybe_unserialize( $capabilities );

	if ( ! is_array( $capabilities ) ) {
		return $capabilities;
	}

	$capabilities = array_keys( $capabilities );

	return implode( ', ', array_map( static function ( $capability ) use ( &$roles ) {
		return $roles[ $capability ] ?? $capability;
	}, $capabilities ) );
}, 10 );

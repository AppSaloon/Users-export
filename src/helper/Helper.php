<?php

namespace appsaloon\ux\helper;

use appsaloon\ux\Profile;

Class Helper {

	/**
	 * Runs array items one by one
	 *
	 * @param $array
	 *
	 * @return \Generator
	 *
	 * @since 1.0.0
	 */
	public static function generator( $array ) {
		foreach ( $array as $value ) {
			yield $value;
		}
	}

	/**
	 * Returns the URL path without the GET parameters
	 *
	 * @return mixed
	 *
	 * @since 1.0.0
	 */
	public static function reconstruct_url() {
		$url = explode( '?', $_SERVER['REQUEST_URI'] );

		return $url[0];
	}

	/**
	 * Returns profiles
	 *
	 * @return mixed|void
	 *
	 * @since 1.0.0
	 */
	public static function get_profiles() {
		return get_option( Profile::PROFILE_OPTION_KEY, true );
	}

	/**
	 * Returns profile data as an array or false
	 *
	 * @param $profile_id
	 *
	 * @return array|mixed
	 *
	 * @since 1.0.0
	 */
	public static function get_profile_by_id( $profile_id ) {
		$profiles = static::get_profiles();

		if ( is_array( $profiles ) ) {
			return ( new Profile() )->set( $profiles[ $profile_id ] );
		}

		return false;
	}
}

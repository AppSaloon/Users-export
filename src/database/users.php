<?php
namespace appsaloon\ux\database;

class Users {

	const FIELDS_FOR_EXPORT = array(
		'ID',
		'user_login',
		'user_nicename',
		'user_email',
		'user_url',
		'user_registered',
		'user_status',
		'display_name',
		'user_order'
	);

	public static function get_users_for_export() {
		global $wpdb;


		return $wpdb->get_results(
			'SELECT ' . implode( ',' , self::FIELDS_FOR_EXPORT ) . ' FROM ' . $wpdb->users, ARRAY_A
		);
	}

}
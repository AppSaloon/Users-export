<?php

namespace appsaloon\ux\database;

use appsaloon\ux\Profile;

class User_Meta {

	private $profile;

	public function __construct( Profile $profile ) {
		$this->profile = $profile;
	}

	public function get_user_meta( $user_id ) {
		global $wpdb;

		$wpdb->get_results(
			'SELECT meta_key, meta_value FROM ' .
			$wpdb->usermeta .
			' WHERE user_id = ' .
			$user_id .' AND meta_key IN (' . $this->profile->get_sql_in_string_of_selected_fields() . ')',
			ARRAY_A
		);
	}
}
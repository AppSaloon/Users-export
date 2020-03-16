<?php
namespace appsaloon\ux;

use appsaloon\ux\database\Users;

class Exporter {

	private $user_data;

	public function register_hooks() {
		add_action( 'init', array( $this, 'get_user_data' ) );
	}

	public function get_user_data() {
		$time_for_display = current_time( 'Y-m-d H:i:s');

		global $wpdb;

		$fields_from_users_table =
			'ID,' .
			'user_login,' .
			'user_nicename,' .
			'user_email,' .
			'user_url,' .
			'user_registered,' .
			'user_status,' .
			'display_name,' .
			'user_order'
		;

		$fields_form_user_meta_table = array(
			"'nickname'",
			"'first_name'",
			"'last_name'",
			"'account_status'",
		);


		var_dump( Users::get_users_for_export() );
		die;

		$users = $wpdb->get_results( 'SELECT ' . $fields_from_users_table . ' FROM ' . $wpdb->users, ARRAY_A );
		foreach( $users as $user_array ) {
			$user_id = $user_array['ID'];
			$this->user_data[$user_id] = $user_array;

			$user_meta = $wpdb->get_results(
				'SELECT meta_key, meta_value FROM ' . $wpdb->usermeta . ' WHERE user_id = ' .$user_id .' AND meta_key IN (' . implode( ',', $fields_form_user_meta_table ) . ')',
				ARRAY_A
			);

			foreach( $user_meta as $meta_data ) {
				$this->user_data[$user_id][$meta_data['meta_key']] = $meta_data['meta_value'];
			}

			foreach( $fields_form_user_meta_table as $field ) {
				$must_exist = substr( $field, 1, strlen( $field ) -2 );
				if( ! isset( $this->user_data[$user_id][$must_exist] ) ) {
					$this->user_data[$user_id][$must_exist] = '';
				}
			}
			ksort( $this->user_data[$user_id] );
		}

		$fields_for_header = array();
		foreach( $fields_form_user_meta_table as $field ) {
			$fields_for_header[] = substr( $field, 1, strlen( $field ) -2 );
		}

		$fields_for_header = array_merge( explode( ',', $fields_from_users_table ), $fields_for_header );

		sort( $fields_for_header );


		$fake_file = fopen( 'php://memory', 'w' );
		fputcsv( $fake_file, $fields_for_header );

		foreach( $this->user_data as $line ) {
			fputcsv( $fake_file, $line );
		}

		fseek( $fake_file, 0 );

		$filename = 'export.csv';

		header('Content-Type: application/csv');
		header('Content-Disposition: attachment; filename="'.$filename.'";');
		fpassthru( $fake_file );
		die;

		//var_dump( implode( ',', $fields_form_user_meta_table ), $time_for_display, current_time( 'Y-m-d H:i:s'), $this->user_data ); die;
	}
}
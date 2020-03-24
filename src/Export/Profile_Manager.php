<?php
/**
 * users-export: Profile_Manager.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 */


namespace appsaloon\ux\Export;

use stdClass;
use function get_editable_roles;
use function wp_get_current_user;

class Profile_Manager {
	public const TYPE = 'asux_export-profile';

	public function __construct( array $config ) {
		add_action( 'init', function () use ( $config ) {
			[ $post_type, $meta_fields ] = $config;

			$this->register_type( $post_type );
			$this->register_fields( $meta_fields );
		} );

		add_action( 'rest_api_init', function () {
			register_rest_route( 'asux/v1', '/fields', array(
				'methods'  => 'GET',
				'callback' => [ static::class, 'fields_rest_endpoint' ],
			) );

			register_rest_route( 'asux/v1', '/roles', array(
				'methods'  => 'GET',
				'callback' => [ static::class, 'roles_rest_endpoint' ],
			) );
		} );
	}

	private function register_type( array $type ): void {
		[ $name, $args ] = $type;

		register_post_type( $name, $args );
	}

	private function register_fields( array $meta_fields ): void {
		foreach ( $meta_fields as $meta_key => $meta_args ) {
			register_post_meta( static::TYPE, $meta_key, $meta_args );
		}
	}

	public static function fields_rest_endpoint(): void {
		$fields = apply_filters( 'asux/fields_action', static::get_available_fields() );

		wp_send_json_success( $fields );
	}

	public static function get_available_fields(): stdClass {
		global $wpdb;

		$user_fields_to_skip = apply_filters( 'asux/user_fields_to_skip', [
			'user_pass',
			'user_activation_key',
		] );
		$meta_fields_to_skip = apply_filters( 'asux/meta_fields_to_skip', [] );

		$meta_fields = $wpdb->get_col(
			"SELECT
					`meta_key`,
					COUNT(`meta_key`) AS `popularity`
				   FROM `{$wpdb->usermeta}`
				   GROUP BY `meta_key`
				   ORDER BY `popularity` DESC;"
		);

		return (object) [
			'user_fields' => array_values(
				array_filter(
					array_keys( (array) wp_get_current_user()->data ),
					static function ( string $user_field ) use ( $user_fields_to_skip ) {
						return ! in_array( $user_field, $user_fields_to_skip, true );
					}
				)
			),
			'meta_fields' => array_values(
				array_filter(
					$meta_fields,
					static function ( string $meta_field ) use ( $meta_fields_to_skip ) {
						return ! in_array( $meta_field, $meta_fields_to_skip, true );
					}
				)
			),
		];
	}

	public static function roles_rest_endpoint(): void {
		$user_roles = apply_filters( 'asux/roles_action', static::get_user_roles() );

		wp_send_json_success( $user_roles );
	}

	public static function get_user_roles(): array {
		require_once( ABSPATH . 'wp-admin/includes/user.php' );

		return array_map(
			static function ( $role ) {
				return $role['name'];
			},
			get_editable_roles()
		);
	}
}

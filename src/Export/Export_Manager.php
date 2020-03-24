<?php
/**
 * users-export: Export_Manager.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 */


namespace appsaloon\ux\Export;

use Exception;
use WP_Error;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;

class Export_Manager {
	public function __construct() {
		$post_type = Profile_Manager::TYPE;

		add_action( 'rest_api_init', static function () {
			register_rest_route( 'asux/v1', '/export/(?P<id>\d+)', [
				'methods'  => 'GET',
				'callback' => [ static::class, 'export_endpoint' ],
			] );
		} );

		add_filter( "rest_prepare_{$post_type}", static function ( WP_REST_Response $response, WP_Post $post, WP_REST_Request $request ) {
			$response->add_link( 'asux:export', rest_url( "/asux/v1/export/{$post->ID}" ) );

			return $response;
		}, 10, 3 );

	}

	public static function export_endpoint( WP_REST_Request $request ) {
		$profile_id = $request->get_param( 'id' );

		try {
			static::export( $profile_id );
		} catch ( Exception $exception ) {
			return new WP_Error(
				'export_exception',
				$exception->getMessage(),
				[
					'status' => $exception->getCode() ?? 500,
				]
			);
		}

		return rest_ensure_response( [ 'status' => 200 ] );
	}

	/**
	 * @param int $profile_id
	 *
	 * @throws Exception
	 */
	private static function export( int $profile_id ): void {
		global $wpdb;

		$profile = get_post( $profile_id );

		if ( ! $profile instanceof WP_Post ) {
			throw new Exception( __( 'Export profile not found.', 'asux' ) );
		}

		$filter_roles  = maybe_unserialize( get_post_meta( $profile_id, '_asux_filter_roles', true ) );
		$filter_before = get_post_meta( $profile_id, '_asux_filter_date_before', true );
		$filter_after  = get_post_meta( $profile_id, '_asux_filter_date_after', true );
		$user_fields   = array_unique( (array) maybe_unserialize( get_post_meta( $profile_id, '_asux_fields', true ) ) );
		$meta_fields   = array_unique( (array) maybe_unserialize( get_post_meta( $profile_id, '_asux_meta_fields', true ) ) );

		$field_names = array_merge( $user_fields, $meta_fields );

		/* "Querybuilder" from den Aldi */
		$query = '';

		/* Select part */
		$select = 'SELECT ';

		$select .= implode( ', ',
			array_map( function ( $field ) {
				$field_name = esc_sql( $field );

				return "u.{$field_name}";
			}, $user_fields )
		);

		if ( ! empty( $meta_fields ) ) {
			$select .= array_reduce( $meta_fields, function ( $meta_select, $meta_field ) {
				$field_name  = esc_sql( $meta_field );
				$meta_select .= ",\n\tMAX(CASE WHEN um1.meta_key = '{$field_name}' THEN um1.meta_value ELSE NULL END) as {$field_name}";

				return $meta_select;
			}, "" );
		}

		$query .= apply_filters( 'asux/export-query/select', $select, $profile_id );

		$from  = "\nFROM {$wpdb->users} u
	LEFT JOIN {$wpdb->usermeta} um0 ON (um0.user_id = u.ID AND um0.meta_key = 'wp_capabilities')
	LEFT JOIN {$wpdb->usermeta} um1 ON (um1.user_id = u.ID)";
		$query .= apply_filters( 'asux/export-query/from', $from, $profile_id );
		/* Filter part */
		$where = 'WHERE 1=1';

		if ( ! empty( $filter_roles ) ) {
			$role_where = array_reduce( $filter_roles, function ( $role_where, $role ) {
				$role = esc_sql( $role );

				if ( ! empty( $role_where ) ) {
					$role_where .= "\n OR ";
				}

				$role_where .= "(um0.meta_value LIKE '%\"{$role}\"%')";

				return $role_where;
			}, '' );

			$where .= " AND \n(\n{$role_where}\n)";
		}

		$format = static function ( $date ) {
			return date( 'Y-m-d', (int) $date );
		};

		if ( ! empty( $filter_before ) && ! empty( $filter_after ) ) {
			$date_conditional = "BETWEEN CAST('{$format($filter_before)}' as DATE) AND CAST('{$format($filter_after)}' as DATE)";
		} elseif ( ! empty( $filter_before ) ) {
			$date_conditional = "< CAST('{$format($filter_before)}' as DATE)";
		} elseif ( ! empty( $filter_after ) ) {
			$date_conditional = "> CAST('{$format($filter_after)}' as DATE)";
		}

		if ( ! empty( $date_conditional ) ) {
			$date_conditional = apply_filters( 'asux/export-query/date-conditional', $date_conditional, $profile_id );
			$where            .= "AND u.user_registered {$date_conditional}";
		}

		$query .= "\n" . apply_filters( 'asux/export-query/where', $where, $profile_id );

		$query .= "\nGROUP BY u.ID, um0.meta_value";

		$results = $wpdb->get_results( $query, ARRAY_A );

		$output_stream = fopen( 'php://output', 'wb' );

		fputcsv( $output_stream, $field_names );

		foreach ( $results as $result ) {
			fputcsv( $output_stream, $result );
		}

		$filename = "{$profile->post_name}.csv";

		update_post_meta( $profile_id, '_asux_last_run', time() );

		// Output CSV-specific headers
		header( 'Pragma: public' );
		header( 'Expires: 0' );
		header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
		header( 'Cache-Control: private', false );
		header( 'Content-Type: application/octet-stream' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '";' );
		header( 'Content-Transfer-Encoding: binary' );

		fpassthru( $output_stream );

		die();
	}
}

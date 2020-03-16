<?php

namespace appsaloon\ux;

class Profile {

	CONST PROFILE_OPTION_KEY = 'asux_profiles';

	public $data;

	public function __construct() {

	}

	public function set( $data ) {
		$this->data = $data;
	}

	public function save() {

	}
}

<div class="wrap">
    <h1><?php _e( 'User Export', 'asux' ); ?></h1>

    <p><?php _e( 'Select or create a profile to export users.',
			'asux' ); ?></p>

    <div class="profiles_form_container">
        <ul>
			<?php
			if ( ! empty( $profiles ) ):
                foreach( $profiles as $profileId => $profile ):
				?>
                <li>
                    <a href="<?php echo $url; ?>?page=as-export-users&asux_profile=<?php echo $profileId; ?>">
                        <?php echo $profile['name']; ?>
                    </a>
                </li>
			  <?php
			    endforeach;
			endif;
			?>
            <li>
                <a href="<?php echo $url; ?>?page=as-export-users&asux_profile=-1">
					<?php _e( 'Nope, let\'s start fresh...', 'asux' ); ?>
                </a>
            </li>
        </ul>
    </div>
</div>

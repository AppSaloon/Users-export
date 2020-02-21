<div class="wrap">
    <h1><?php _e( 'User Export', 'asux' ); ?></h1>

    <p>This is the place to select the fields you would like to see in the CSV export file.</p>

    <div class="ux_form_container">
        <form method="post">
            <table class="form-table">
                <tr>
                    <th><?php _e( 'Name', 'asux' ); ?></th>
                    <td>Activate</td>
                </tr>
				<?php foreach ( $user_fields as $field ): ?>
                    <tr>
                        <th scope="row"><label for="blogname"><?php echo $field; ?></label></th>
                        <td><input type="checkbox" id="field_<?php echo $field; ?>" name="<?php echo $field; ?>"
                                   value="1"></td>
                    </tr>
				<?php endforeach; ?>
            </table>
            <input type="submit" name="btnSave" value="Save" class="button-primary button"/>
        </form>
    </div>
</div>

<div class="wrap">
    <h1><?php _e( 'User Export', 'asux' ); ?></h1>

    <p><?php _e( 'This is the place to select the fields you would like to see in the CSV export file.',
			'asux' ); ?></p>

    <p><?php _e( 'Select the fields you would like to export and then define optional filters for field values and the date range. When you click the download button below, AS User Export will create a CSV file for you to save to your computer.',
			'asux' ); ?></p>

    <div class="ux_form_container">
        <form method="post">
            <table class="form-table">

                <tr>
                    <th scope="row"><label for="blogname"><?php _e( 'Select fields' ); ?></label></th>
                    <td>
                        <ul>
                            <li id="selectAll">
                                <input onclick="asuxSelectAllClicked()" type="checkbox" id="select_all" value="1">
                                <label for="select_all"><?php _e( 'Select all', 'asux' ); ?></label>
                            </li>
							<?php foreach ( $user_fields as $field ): ?>
                                <li>
                                    <input type="checkbox" id="field_<?php echo $field; ?>" class="field" name="fields[<?php echo $field; ?>]"
                                           value="1">
                                    <label for="field_<?php echo $field; ?>"><?php echo $field; ?></label>
                                </li>
							<?php endforeach; ?>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <th>
                        Select Date Range
                        <div class="extra_information">Blocks embedded videos from Youtube, Twitter, Vimeo and Facebook.</div>
                    </th>
                    <td>
                        <input type="date" onchange="asuxStartDateClicked()" name="date_start" id="date_start" max="<?php echo date( 'Y-m-d' ); ?>">
                        <label for="date_start">Start</label>

                        <input type="date" name="date_end" id="date_end" max="<?php echo date( 'Y-m-d' ); ?>">
                        <label for="date_end">End</label>
                    </td>
                </tr>

                <tr>
                    <th>Save profile</th>
                    <td>
                        <ul>
                            <li><input type="checkbox" id="save_profile" name="save_profile" value="1"></li>
                            <li><input type="text" id="profile_name" name="profile_name" placeholder="profile name"></li>
                        </ul>
                    </td>
                </tr>

            </table>
            <input type="submit" name="btnSave" value="Save" class="button-primary button"/>
            <input type="hidden" name="profile_id" value="<?php echo $profile_id; ?>">
        </form>
    </div>
</div>

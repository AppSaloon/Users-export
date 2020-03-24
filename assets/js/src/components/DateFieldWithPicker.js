import React, { useState } from '@wordpress/element';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';
import {
	BaseControl,
	Button,
	DatePicker,
	Icon,
	Popover,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const DateFieldWithPicker = ( {
	value,
	onChange,
	className = '',
	...props
} ) => {
	const [ isPickerOpen, setPickerOpen ] = useState( false );
	const settings = __experimentalGetSettings();

	className += ' asux__date-field';

	return (
		<BaseControl className={ className } { ...props }>
			<div className="asux__date-field-wrap">
				<Button
					onClick={ () =>
						setPickerOpen( ( isPickerOpen ) => ! isPickerOpen )
					}
					isTertiary
				>
					<Icon icon="edit" />
					<span style={ { marginLeft: '5px' } }>
						{ value
							? dateI18n( settings.formats.date, value )
							: __( 'No date', 'asux' ) }
					</span>
				</Button>
				{ value && (
					<Button isSmall isLink onClick={ () => onChange( null ) }>
						<Icon icon="no-alt" size={ 16 } />
					</Button>
				) }
				{ isPickerOpen && (
					<Popover onClose={ setPickerOpen.bind( null, false ) }>
						<DatePicker
							className="asux__form-control"
							currentDate={ value }
							onChange={ onChange }
							is12Hour={ false }
						/>
					</Popover>
				) }
			</div>
		</BaseControl>
	);
};

export default DateFieldWithPicker;

import { Button, Modal } from '@wordpress/components';
import React, { useState } from '@wordpress/element';
import noop from 'lodash/noop';

const MyModal = ( {
	title = __( 'Are you sure?', 'asux' ),
	isOpen = false,
	onClose = noop,
	onConfirm = noop,
	onCancel = noop,
	...props
} ) => {
	return (
		<>
			{ isOpen && (
				<Modal title={ title } onRequestClose={ onClose }>
					<main>{ props.children }</main>
					<footer>
						<Button isPrimary onClick={ onConfirm }>
							{ __( 'OK', 'asux' ) }
						</Button>
						<Button isSecondary onClick={ onCancel }>
							{ __( 'Cancel', 'asux' ) }
						</Button>
					</footer>
				</Modal>
			) }
		</>
	);
};

export default MyModal;

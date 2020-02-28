function asuxStartDateClicked() {
    let startDate = document.getElementById( 'date_start' )
    let endDate = document.getElementById( 'date_end' )

    endDate.setAttribute( 'min', startDate.value )
}

function asuxSelectAllClicked() {
    let selectAllField = document.getElementById( 'select_all' )
    let show = selectAllField.checked

    updateFieldsStatus( show )
}

function updateFieldsStatus( status ) {
    let fields = document.getElementsByClassName('field')

    for( field in fields ) {
        fields[field].checked = status
    }
}
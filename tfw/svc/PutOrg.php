<?php
$ROLE = "ADMIN";

/**
 * Input: { "id": "vaccins", "text": "..." }
 *
 * Output:
 * 0: OK
 * 1: Missing `id`.
 * 2: Missing `text`.
 * 3: Invalid `id`. 
 */
function execService($args) {
    //error_log(json_encode($args));

    if( !array_key_exists( 'id', $args ) ) return 1;
    if( !array_key_exists( 'text', $args ) ) return 2;
    foreach( Array('exams', 'vaccins', 'patient', 'forms', 'types') as $id ) {
        if( $id == $args['id'] ) {
            file_put_contents("./pri/$id.org", $args['text']);
            return 0;
        }
    }
    return 3;
}
?>

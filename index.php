<?php
$qs = $_SERVER['QUERY_STRING'];

if( $qs == 'akonolinga' ) {
    readFiles( '.', $qs );
} else {
    echo '[{"id":"akonolinga","name":"Akonolinga"}]';
}


function readFiles( $id ) {
    $manifest = getManifest( $id );
    $version = $manifest['version'];
    if( $version == '' ) return "[]";
    $files = Array();
    addFiles( $files, "./$id" );
    $folder = $_SERVER["PHP_SELF"];
    $pos = strrpos( $folder, '/' );
    if( $folder !== false ) {
        $folder = substr( $folder, 0, $pos ) . '/';
    }
    echo json_encode( Array(
        "url" => $_SERVER['REQUEST_SCHEME'] . "://"
             . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT']
             . $folder,
        "name" => $manifest['name'],
        "version" => $version,
        "icons" => $manifest['icons'],
        "files" => $files,
        "root" => $id), JSON_PRETTY_PRINT );
}

function addFiles( &$arr, $folder ) {
    $files = scandir( $folder );
    foreach( $files as $f ) {
        if( substr($f, 0, 1) != '.' && $f != 'tfw' && substr($f, -4) != '.php' ) {
            $filename = $folder . '/' . $f;
            if( is_dir( $filename ) ) addFiles( $arr, $filename );
            else {
                $arr[] = $filename;
                error_log($filename);
            }
        }
    }
}

function getManifest($id) {
    $manifest = @file_get_contents( $id . '/manifest.webapp' );
    if( $manifest == '' ) return Array();
    $data = json_decode( $manifest, true );
    return $data;
}
?>

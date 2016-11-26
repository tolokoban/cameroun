<?php
$ROLE = "";

function execService() {
    return Array(
        "patient" => @file_get_contents("./pri/patient.org"),
        "forms" => @file_get_contents("./pri/forms.org"),
        "types" => @file_get_contents("./pri/types.org")
    );
}
?>

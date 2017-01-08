<?php
$ROLE = "";

function execService() {
    return Array(
        "exams" => @file_get_contents("./pri/exams.org"),
        "vaccins" => @file_get_contents("./pri/vaccins.org"),
        "patient" => @file_get_contents("./pri/patient.org"),
        "forms" => @file_get_contents("./pri/forms.org"),
        "types" => @file_get_contents("./pri/types.org")
    );
}
?>

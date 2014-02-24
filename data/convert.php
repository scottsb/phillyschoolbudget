<?php

$summary_s = <<<s
1,Budget Reductions - Instructional & Instructional Support
2,Budget Reductions - Pupil & Family Support
3,Budget Reductions - Operating Support
4,Budget Reductions - Non District Operated Schools
5,Budget Reductions - Administration
s;

$data = explode("\n", $summary_s);
//$summary = array_map("str_getcsv", $data);
foreach ($data as $lineitem) {
    $lis = explode(",", $lineitem);
    $summary[$lis[0]] = $lis[1];
}

$details_s = <<<s
1,Operating,9000 - Other Uses Of Funds,0,0,0,-146433843,-146433843
2,Operating,9000 - Other Uses Of Funds,0,0,0,-47118505,-47118505
3,Operating,9000 - Other Uses Of Funds,0,0,0,-28429475,-28429475
4,Operating,9000 - Other Uses Of Funds,0,0,0,-9349474,-9349474
5,Operating,9000 - Other Uses Of Funds,0,0,0,-23088562,-23088562
s;

$data = explode("\n", $details_s);
$det = array();

foreach ($data as $lineitem) {
    $li = explode(",", $lineitem);
    $cost_id = substr($li[2], 0, 4);
    $cost_desc = substr($li[2], 7);
    $det[$li[0]][$cost_id]['desc'] = $cost_desc;
    $det[$li[0]][$cost_id]['details'][$li[1]] = $li[6];
}

$assembled = "<budgetNode name='District-Wide Gap Closing Measures'>\n";

foreach ($summary as $fa_id => $fa) {
    $fa_special = htmlspecialchars($fa, ENT_QUOTES);
    $assembled .= "\t<budgetNode name='{$fa_special}'>\n";
    foreach ($det[$fa_id] as $cost_center_id => $arrCostCenterDetails) {
        $cost_center_desc = htmlspecialchars($arrCostCenterDetails['desc'], ENT_QUOTES);
        $assembled .= "\t\t<budgetNode name='{$cost_center_desc}' leaf='true'>\n";
        foreach ($arrCostCenterDetails['details'] as $ccSource => $ccAmount) {
            $assembled .= "\t\t\t<funding source='{$ccSource}' amount='{$ccAmount}' />\n";
        }
        $assembled .= "\t\t</budgetNode>\n";
    }
    $assembled .= "\t</budgetNode>\n";
}

$assembled .= "</budgetNode>\n";

echo $assembled;
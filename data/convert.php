<?php
    header('Content-type: text/xml');
    
    $import_array = array(
        array(
            "group" => "School Budgets including Non-District Operated Schools",
            "files" => array(
                array(
                    "summary" => "./csv_source/01/01summary.csv",
                    "detail" => "./csv_source/01/01combined.csv",
                ),
                array(
                    "summary" => "./csv_source/01/02summary.csv",
                    "detail" => "./csv_source/01/02combined.csv",
                ),
                array(
                    "summary" => "./csv_source/01/03summary.csv",
                    "detail" => "./csv_source/01/03combined.csv",
                ),
                array(
                    "summary" => "./csv_source/01/04summary.csv",
                    "detail" => "./csv_source/01/04combined.csv",
                ),
                array(
                    "summary" => "./csv_source/01/05summary.csv",
                    "detail" => "./csv_source/01/05combined.csv",
                ),
            ),
        ),
        array(
            "group" => "Administrative Support Operations",
            "files" => array(
                array(
                    "summary" => "./csv_source/02/01summary.csv",
                    "detail" => "./csv_source/02/01combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/02summary.csv",
                    "detail" => "./csv_source/02/02combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/03summary.csv",
                    "detail" => "./csv_source/02/03combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/04summary.csv",
                    "detail" => "./csv_source/02/04combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/05summary.csv",
                    "detail" => "./csv_source/02/05combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/06summary.csv",
                    "detail" => "./csv_source/02/06combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/07summary.csv",
                    "detail" => "./csv_source/02/07combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/08summary.csv",
                    "detail" => "./csv_source/02/08combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/09summary.csv",
                    "detail" => "./csv_source/02/09combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/10summary.csv",
                    "detail" => "./csv_source/02/10combined.csv",
                ),
                array(
                    "summary" => "./csv_source/02/11summary.csv",
                    "detail" => "./csv_source/02/11combined.csv",
                ),
            ),
        ),
    );
    
    $xmldoc = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xmldoc .= "<budgetNode name='Philadelphia School Budget'>\n";
    
    foreach ($import_array as $group) {
        $groupname = htmlentities($group['group'], ENT_QUOTES);
        $xmldoc .= "\t<budgetNode name='{$groupname}'>\n";
        
        $group_files = $group['files'];
        foreach ($group_files as $paths) {
            $summary_filename = $paths['summary'];
            $detail_filename = $paths['detail'];
            
            $summary_s = "";
            $summary_s = file_get_contents($summary_filename);
            $data = explode("\n", $summary_s);
            $summary = array();
            foreach ($data as $lineitem) {
                $lineitem_contents = explode(",", $lineitem);
                $summary[$lineitem_contents[0]] = $lineitem_contents[1];
            }
            
            $detail_s = "";
            $detail_s = file_get_contents($detail_filename);
            $data = explode("\n", $detail_s);
            $details = array();
            foreach ($data as $lineitem) {
                $lineitem_contents = explode(",", $lineitem);
                $cost_center_id = substr($lineitem_contents[2], 0, 4);
                $cost_center_desc = htmlentities(substr($lineitem_contents[2], 7), ENT_QUOTES);
                $details[$lineitem_contents[0]][$cost_center_id]['desc'] = $cost_center_desc;
                $details[$lineitem_contents[0]][$cost_center_id]['details'][$lineitem_contents[1]] = $lineitem_contents[6];    //this is the FY14 budget number. Adjust the last "$lineitem_contents[1]" for other years.
            }
            
            $budget_line_name = htmlentities($summary[0], ENT_QUOTES);
            $xmldoc .= "\t\t<budgetNode name='{$budget_line_name}'>\n";
            unset($summary[0]);
            
            foreach ($summary as $fa_id => $fa) {
                $functional_area = htmlentities($fa, ENT_QUOTES);
                $xmldoc .= "\t\t\t<budgetNode name='{$functional_area}'>\n";
                foreach ($details[$fa_id] as $this_cost_center_id => $arrCostCenterDetails) {
                    $this_cost_center_desc = htmlentities($arrCostCenterDetails['desc'], ENT_QUOTES);
                    $xmldoc .= "\t\t\t\t<budgetNode name='{$this_cost_center_desc}'>\n";
                    foreach ($arrCostCenterDetails['details'] as $source => $amount) {
                        $this_funding_source = htmlentities($source, ENT_QUOTES);
                        $xmldoc .= "\t\t\t\t\t<funding source='{$this_funding_source}' amount='{$amount}' />\n";
                    }
                    $xmldoc .= "\t\t\t\t</budgetNode>\n";
                }
                $xmldoc .= "\t\t\t</budgetNode>\n";
            }
            $xmldoc .= "\t\t</budgetNode>\n";
        }
        $xmldoc .= "\t</budgetNode>\n";
    }
    $xmldoc .= "</budgetNode>";
    
    echo $xmldoc;
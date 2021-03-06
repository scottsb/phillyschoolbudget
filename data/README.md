# Data Set Creation

The data for this app was taken from the Philadelphia School District [budget PDF](http://webgui.phila.k12.pa.us/uploads/lA/ad/lAadBw8mA0yvC4FYRwrovg/FY2013-14-Consolidated-Budget.pdf). I used [pdfsam](http://www.pdfsam.org/) to remove everything but the actual budget pages, then again to cut each individual budget line item into its own separate file. From there, I used a regular expression on the first page of summary data to group the Functional Area separately from the budget colums: `([A-Za-z])( )(\(?\d)`, replaced with `\1|\3`. This was then pasted into Excel, where I used the text import wizard to specify a pipe-delimited import, which left two colums: the Functional Area, and a space-delimited listing of the budget numbers. I use the "Text to Columns" feature to expand the five numbers into five columns. I gave each Functional Area its own ID number and copied that number and the Functional Area into a separate summary CSV file. I added a "row 0" at the top of each to specify the budget line name.

To generate the CSV files, the data had to be "flattened." Rather than being grouped by Operational, Categorical, Capital and "Other" fund sources, I needed one big list combining them all. I copied each individual section out into a separate page and added the corresponding Functional Area id number and fund source for each copied row. Once each Functional Area for the budget line file had been copied, I saved that single sheet as a CSV file to serve as the "detail" file. This process was repeated for all of the budget line item files.

My team and I decided upon a hierarchical XML structure for the data, so after creating each of the summary and detail CSV files, I moved them into a directory with the `converter.php` file and told the converter where to find all the files (documented below). The converter outputs an XML file (after the structure of expenseTemplate.xml) by recursing through each detail file and arranging the data according to our template XML schema. Once the XML string had been generated, the converter returned the information as a well-formed XML document.

This XML document was then copied into `parseUpload.html` where inline JavaScript parses the XML and uploads it to Parse Data (the BaaS product that powers the visualization).

## CSV to XML Script

This script converts CSV files scraped from the budget PDFs into structured XML.

###Input Formats

The import takes two files:

* a summary file containing a list of Functional Areas and their reference IDs (as well as an initial line item specifying the budget line name)
* a combined detail file containing a flat listing of all the cost centers, fund types, and amounts for each Functional Area, including an ID that matches that in the summary file

The summary file should match this template:

```
0,[Budget Line Name]
1,[Functional Area 1]
2,[Functional Area 2]
...
6,[Functional Area 6]
etc.
```

The detail file should match this template:

```
1,[funding category],[xxxx - cost center description],[amount[,amount[,amount etc]]]
1,[funding category],[yyyy - cost center description],[amount[,amount[,amount etc]]]
1,[funding category],[zzzz - cost center description],[amount[,amount[,amount etc]]]
...
6,[funding category],[aaaa - cost center description],[amount[,amount[,amount etc]]]
6,[funding category],[xxxx - cost center description],[amount[,amount[,amount etc]]]
```

To specify the files, modify the `convert.php` file's `$import_array` array to list all the summary and detail files to be imported.

### Output Formats

The converter outputs an XML file containing the results of all the internally-linked files.

CSV Converter
=============

This script converts CSV files scraped from the budget PDFs.

Input Formats
-------------

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

Output Formats
--------------

The converter outputs an XML file containing the results of all the internally-linked files.
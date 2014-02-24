CSV Converter
=============

This script converts CSV files scraped from the budget PDFs.

Input Formats
-------------

The import takes two files:

* a summary file containing a list of Functional Areas and their reference IDs (as well as an initial line item specifying the budget line name)
* a combined detail file containing a flat listing of all the cost centers, fund types, and amounts for each Functional Area, including an ID that matches that in the summary file

Output Formats
--------------

The converter outputs a `<budgetNode>` XML tree for the entire budget line item.
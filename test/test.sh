#!/bin/bash

if [ ! -f test/angular-rome2rio.spec.js ]; then
	echo "Please run from outside the test folder: ./test/test.sh"
else
	npm install
	bower install
	karma start
fi
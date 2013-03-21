#!/bin/sh

rm -rf temp
mkdir temp
cd ..
make debug
cd tests
jscoverage ../build/ temp
cp -R ../tools/jsunit temp

export TEST_PATH=`pwd`

echo "<html><head><title>Test</title><meta http-equiv=\"refresh\" content=\"0;url=file://$TEST_PATH/temp/jsunit/testRunner.html?testPage=$TEST_PATH/unit/index.html&autoRun=true\" /></head><body></body></html>" > temp/index.html
open -a Safari temp/index.html

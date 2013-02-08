##############################################################
##                    COPYRIGHT NOTICE
##
## Copyright (C) 2009-2013. ViniSketch  (c) All rights reserved
##
##############################################################

###                     Declaration
##############################################################

SHELL = /bin/sh
CHMOD = chmod
CP = cp
XTEMP = ../lib/manage_template.sh
MV = mv
NOOP = $(SHELL) -c true
RM_F = rm -f
RM_RF = rm -rf
TEST_F = test -f
TOUCH = touch
UMASK_NULL = umask 0
DEV_NULL = > /dev/null 2>&1
MKPATH = mkdir -p
CAT = cat
MAKE = make
OPEN = open
ECHO = echo
ECHO_N = echo -n
JAVA = java
COMPILE = $(JAVA) -jar tools/closurecompiler/compiler.jar --language_in=ECMASCRIPT5
COMPILE_ADV = $(JAVA) -jar tools/closurecompiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS
COMPILE_YUI = $(JAVA) -cp tools/yuicompressor/jargs-1.0.jar:tools/yuicompressor/rhino-1.6R7.jar -jar tools/yuicompressor/yuicompressor-2.4.2.jar
GENDOC = $(JAVA) -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js
COMPILE_LESS = /usr/local/bin/lessc

###                         EXPORT HEADERS / FOOTERS
##############################################################


EXPORT_HEADER = "(function () {\n"

EXPORT_FOOTER = "}).call(this);"

VS_EXPORT_HEADER = "(function(){ \n\
var vs = this.vs = this.vs || {}, util = vs.util = {};\n"

VS_EXPORT_FOOTER = "}).call(this);"

ifdef REQUIRE_JS
  UTIL_HEADER = "define ('vs_util', ['vs'], function (vs) {"
  UTIL_FOOTER = "return util;\n});"
  CSS_MATRIX_HEADER = "define ('css_matrix', function () {"
  CSS_MATRIX_FOOTER = "\nreturn FirminCSSMatrix;\n});"
else
  UTIL_HEADER = $(VS_EXPORT_HEADER)
  UTIL_FOOTER = $(EXPORT_FOOTER)
  CSS_MATRIX_HEADER = $(EXPORT_HEADER)
  CSS_MATRIX_FOOTER = "\nthis.FirminCSSMatrix = FirminCSSMatrix;\n"$(EXPORT_FOOTER)
endif

###                         RELEASE
##############################################################

all :: release

Debug :: debug
Release :: release

release :: clean makedirs libs_release util_js_release

debug :: clean makedirs libs_debug util_js_debug

clean :: clean_libs

clean_libs:
	-$(RM_RF) build

makedirs:
	-$(MKPATH) build/

###                    Util_js
##############################################################

util_js_release: build/vs_util.js
	-$(COMPILE) --js=build/vs_util.js --js_output_file=build/vs_util_min.js

util_js_debug: build/vs_util.js

build/vs_util.js: src/Util.js
	$(ECHO) $(UTIL_HEADER) >> $@
	$(CAT) src/Point.js >> $@
	$(CAT) src/Util.js >> $@
	$(ECHO) $(UTIL_FOOTER) >> $@

###                    libs
##############################################################

libs_release: build/firminCSSMatrix.js
	-$(COMPILE) --js=build/firminCSSMatrix.js --js_output_file=build/firminCSSMatrix_min.js

libs_debug: build/firminCSSMatrix.js

build/firminCSSMatrix.js: src/libs/FirminCSSMatrix.js
	$(ECHO) $(CSS_MATRIX_HEADER) >> $@
	$(CAT) src/libs/FirminCSSMatrix.js >> $@
	$(ECHO) $(CSS_MATRIX_FOOTER) >> $@

#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/# .
#}

default: help
	@echo "log: $@: $^"

-include config.mk

runtime?=iotjs
example_file=index.js
run_args?=
port?=8888
target_url?=http://localhost:${port}
export target_url

lib_srcs?=$(wildcard *.js lib/*.js | sort | uniq)
srcs?=${lib_srcs}

iotjs_modules_dir?=${CURDIR}/iotjs_modules
export iotjs_modules_dir

webthing-iotjs_url?=https://github.com/rzr/webthing-iotjs
webthing-iotjs_revision ?= webthing-iotjs-0.12.1-1
webthing-iotjs_dir?=${iotjs_modules_dir}/webthing-iotjs
iotjs_modules_dirs+=${webthing-iotjs_dir}

deploy_modules_dir?=${CURDIR}/tmp/deploy/iotjs_modules
deploy_module_dir?= ${deploy_modules_dir}/${project}
deploy_dirs+= ${deploy_module_dir}
deploy_dirs+= ${deploy_modules_dir}/webthing-iotjs
deploy_srcs+= $(addprefix ${deploy_module_dir}/, ${srcs})

property?=on
property_value?=true

run_args+="${port}"


help:
	@echo "Usage:"
	@echo "# make start"

LICENSE: /usr/share/common-licenses/MPL-2.0
	cp -a $< $@

iotjs/modules: ${iotjs_modules_dirs}
	ls $^

${webthing-iotjs_dir}: Makefile
	@echo "log: $@: $^"
	rm -rf "$@"
	git clone --recursive --depth=1 \
 --branch "${webthing-iotjs_revision}" \
 "${webthing-iotjs_url}" \
 "$@"
	${MAKE} -C $@ ${runtime}/modules

deploy: ${deploy_srcs} ${deploy_dirs}
	ls $<

${deploy_module_dir}/%: %
	@echo "# TODO: minify: $< to $@"
	install -d ${@D}
	install $< $@

${deploy_modules_dir}/webthing-iotjs: ${iotjs_modules_dir}/webthing-iotjs
	make -C $< deploy deploy_modules_dir="${deploy_modules_dir}" project="${@F}"

iotjs/start: ${example_file} ${iotjs_modules_dirs}
	iotjs $< ${run_args}

iotjs/debug:
#	rm -rf node_modules
	NODE_PATH=iotjs_modules:../.. node index.js

client/test:
	curl ${target_url}
	@echo
	curl ${target_url}/properties
	@echo
	curl ${target_url}/properties/${property}
	@echo
	curl -H "Content-Type: application/json" -X PUT \
 --data '{"${property}": ${property_value}}' \
 "http://localhost:8888/properties/${property}"
	curl ${target_url}/properties/${property}
	@echo

node_modules: package.json
	npm install

node/run: node_modules
	npm start

run: ${runtime}/start
	@echo "# $@: $^"

start: ${runtime}/start
	sync

cleanall:
	rm -rf iotjs_modules node_modules

client:
	curl -i ${target_url}/properties

check:
	@echo "# $@: $^"

test:
	@echo "# $@: $^"

setup:
	which iotjs
	which make

modules: ${runtime}/modules

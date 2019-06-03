#!/bin/bash
#!NOW=$(date +"%Y-%m-%d")
# shellcheck shell=bash
cp -R /var/app/jarfis/public/data /var/backups/jarfis-data/backup-"$NOW"

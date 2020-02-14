#!/bin/bash

datestr=$(date +%Y-%m-%d)

echo Processing $1 to $datestr as $OWNER

#mkdir /masters/$datestr
#mv $1/* /masters/$datestr

photomoa process $1 /masters

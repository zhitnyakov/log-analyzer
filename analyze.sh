#!/bin/bash

# elb-log-analyzer --col1=count --col2=method --col3=elb_status_code --col4=requested_resource.pathname --limit=100 aws-logs/backend/594533286965_elasticloadbalancing_eu-central-1_app.awseb-AWSEB-R1VIZXOIH8JE.6cbda0dbb04408c1_20240401T2345Z_3.75.79.12_1qjsqg71.log
elb-log-analyzer --col1=count --col2=method --col3=elb_status_code --col4=requested_resource.pathname --limit=100000 aws-logs/backend/594533286965_elasticloadbalancing_eu-central-1_app.awseb-AWSEB-R1VIZXOIH8JE.6cbda0dbb04408c1_20240401T2340Z_52.59.25.60_4vvogosn.log

# End of script
# -*- coding: utf-8 -*-
import fitbit
from ast import literal_eval

CLIENT_ID     = '******'
CLIENT_SECRET = '********************************'
TOKEN_FILE    = 'token.txt'

tokens = open(TOKEN_FILE).read()
token_dict = literal_eval(tokens)
access_token = token_dict['access_token']
refresh_token = token_dict['refresh_token']

def updateToken(token):
  f = open(TOKEN_FILE, 'w')
  f.write(str(token))
  f.close()
  return

client = fitbit.Fitbit(CLIENT_ID, CLIENT_SECRET, access_token = access_token, refresh_token = refresh_token, refresh_cb = updateToken)

# 心拍
heart_alldata = client.intraday_time_series('activities/heart', base_date='2018-01-01', detail_level='1sec')
heart = heart_alldata['activities-heart-intraday']['dataset']
print(heart)

# 歩数
steps_alldata = client.intraday_time_series('activities/steps', base_date='2018-01-01', detail_level='1min')
steps = steps_alldata['activities-steps-intraday']['dataset']
print(steps)

# 睡眠
sleep = client.sleep(date='2018-01-01')
print(sleep)

# -*- coding: utf-8 -*-
import fitbit
import datetime
from ast import literal_eval
import os
import sys

PURCHASE_DATE = datetime.date(2017, 11, 11)
CSV_PATH      = '../csv_data'
IF_OVERWRITE  = False

def args_to_initialize(args):
  global CSV_PATH
  global PURCHASE_DATE
  global IF_OVERWRITE

  if len(args) != 6:
    print('Invalid args:[client_file token_file csv_path latest_day oldest_day if_overwrite_kpi_file]')
    print(args)
    sys.exit()

  client_file  = args[0]
  token_file   = args[1]
  CSV_PATH     = args[2]
  latest_day   = int(args[3])
  oldest_day   = int(args[4])

  if (args[5] == 'overwrite'):
    IF_OVERWRITE = True
  else:
    IF_OVERWRITE = False

  client_str    = open(client_file).read()
  client_dict   = literal_eval(client_str)
  client_id     = client_dict['client_id']
  client_secret = client_dict['client_secret']
  p_dt          = datetime.datetime.strptime(client_dict['purchase_date'], '%Y-%m-%d')
  PURCHASE_DATE = datetime.date(p_dt.year, p_dt.month, p_dt.day)

  token_str     = open(token_file).read()
  token_dict    = literal_eval(token_str)
  access_token  = token_dict['access_token']
  refresh_token = token_dict['refresh_token']

  def updateToken(token):
    f = open(token_file, 'w')
    f.write(str(token))
    f.close()
    return

  client = fitbit.Fitbit(client_id, client_secret, access_token = access_token, refresh_token = refresh_token, refresh_cb = updateToken)

  new_token_str     = open(token_file).read()
  new_token_dict    = literal_eval(new_token_str)
  new_access_token  = new_token_dict['access_token']
  new_refresh_token = new_token_dict['refresh_token']

  ret = {"client_file"   : client_file
    ,    "token_file"    : token_file
    ,    "CSV_PATH"      : CSV_PATH
    ,    "latest_day"    : latest_day
    ,    "oldest_day"    : oldest_day
    ,    "IF_OVERWRITE"  : IF_OVERWRITE
    ,    "client_id"     : client_id
    ,    "client_secret" : client_secret
    ,    "PURCHASE_DATE" : PURCHASE_DATE
    ,    "access_token"  : new_access_token
    ,    "refresh_token" : new_refresh_token
    ,    "client"        : client
  }

  return ret

def make_month_file(client, get_day, path, detail_level, column_name, dir_name):

  if get_day < PURCHASE_DATE :
    return

  get_day_str = get_day.strftime('%Y-%m-%d')
  filename    = '{0}/{1}/{2}_{3}.csv'.format(CSV_PATH, dir_name, get_day_str, dir_name)
  if (not IF_OVERWRITE) and os.path.exists(filename) :
    return

  terms_alldata = client.intraday_time_series(path, base_date=get_day_str, detail_level=detail_level)
  many_terms = terms_alldata[column_name]['dataset']

  f = open(filename, 'w')

  for term in many_terms:
    f.write("{0},{1}\n".format(term['time'], str(term['value'])))

  f.close()


def make_month_sleep_file(client, get_day):

  if get_day < PURCHASE_DATE :
    return

  get_day_str = get_day.strftime('%Y-%m-%d')
  filename    = '{0}/sleep/{1}_sleep.csv'.format(CSV_PATH, get_day_str)
  if (not IF_OVERWRITE) and os.path.exists(filename) :
    return

  sleep_all = client.sleep(date=get_day_str)
  many_sleep = sleep_all['sleep']

  f = open(filename, 'w')

  sleep_count = 0
  for sleep in many_sleep:
    for key, value in sleep.items():
      if key == 'minuteData':
        continue
      f.write('{0},{1},{2}\n'.format(sleep_count, key, value))

    minuteData = sleep['minuteData']
    for pair in minuteData:
      f.write('{0},{1},{2}\n'.format(sleep_count, pair['dateTime'], str(pair['value'])))

    sleep_count += 1

  f.close()

def main(args):
  initialize = args_to_initialize(args)
  client     = initialize["client"]
  latest_day = initialize["latest_day"]
  oldest_day = initialize["oldest_day"]

  for day_back in range(latest_day, oldest_day):
    get_day = datetime.date.today() - datetime.timedelta(day_back)

    make_month_file(client, get_day, 'activities/heart'                ,'1sec' ,'activities-heart-intraday'                ,'heart')
    make_month_file(client, get_day, 'activities/distance'             ,'1min' ,'activities-distance-intraday'             ,'distance')
    make_month_file(client, get_day, 'activities/steps'                ,'1min' ,'activities-steps-intraday'                ,'steps')
    make_month_file(client, get_day, 'activities/floors'               ,'1min' ,'activities-floors-intraday'               ,'floors')
    make_month_file(client, get_day, 'activities/minutesSedentary'     ,'1min' ,'activities-minutesSedentary-intraday'     ,'minutesSedentary')
    make_month_file(client, get_day, 'activities/minutesLightlyActive' ,'1min' ,'activities-minutesLightlyActive-intraday' ,'minutesLightlyActive')
    make_month_file(client, get_day, 'activities/minutesFairlyActive'  ,'1min' ,'activities-minutesFairlyActive-intraday'  ,'minutesFairlyActive')
    make_month_file(client, get_day, 'activities/minutesVeryActive'    ,'1min' ,'activities-minutesVeryActive-intraday'    ,'minutesVeryActive')

    make_month_sleep_file(client, get_day)

if __name__ == '__main__':
  main(sys.argv[1:])

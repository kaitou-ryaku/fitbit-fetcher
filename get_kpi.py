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

  ret = {'client_file'   : client_file
    ,    'token_file'    : token_file
    ,    'CSV_PATH'      : CSV_PATH
    ,    'latest_day'    : latest_day
    ,    'oldest_day'    : oldest_day
    ,    'IF_OVERWRITE'  : IF_OVERWRITE
    ,    'client_id'     : client_id
    ,    'client_secret' : client_secret
    ,    'PURCHASE_DATE' : PURCHASE_DATE
    ,    'access_token'  : new_access_token
    ,    'refresh_token' : new_refresh_token
    ,    'client'        : client
  }

  return ret

def save_json_csv(client, get_day, path, detail_level, column_name, dir_name):

  if get_day < PURCHASE_DATE :
    return

  get_day_str = get_day.strftime('%Y-%m-%d')
  csvname     = '{0}/{1}/{2}_{3}.csv'.format(CSV_PATH, dir_name, get_day_str, dir_name)
  if (not IF_OVERWRITE) and os.path.exists(csvname) :
    return

  terms_alldata = client.intraday_time_series(path, base_date=get_day_str, detail_level=detail_level)

  jsonname = '{0}/{1}/{2}_{3}.json'.format(CSV_PATH, dir_name, get_day_str, dir_name)
  f = open(jsonname, 'w')
  f.write(str(terms_alldata))
  f.close()

  many_terms = terms_alldata[column_name]['dataset']

  f = open(csvname, 'w')
  for term in many_terms:
    f.write('{0},{1}\n'.format(term['time'], str(term['value'])))
  f.close()

def save_lack_second_csv(get_day):

  if get_day < PURCHASE_DATE :
    return

  get_day_str = get_day.strftime('%Y-%m-%d')
  csvname     = '{0}/{1}/{2}_{3}.csv'.format(CSV_PATH, 'lack', get_day_str, 'lack')
  if (not IF_OVERWRITE) and os.path.exists(csvname) :
    return
  f = open(csvname, 'w')

  jsonname = '{0}/{1}/{2}_{3}.json'.format(CSV_PATH, 'heart', get_day_str, 'heart')
  if not os.path.exists(jsonname):
    return

  json_data = literal_eval(open(jsonname, 'r').read())

  before = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
  json_data['activities-heart-intraday']['dataset'].append({'time':'23:59:59'})
  for term in json_data['activities-heart-intraday']['dataset']:
    current = datetime.datetime.strptime(term['time'], '%H:%M:%S')
    if before + datetime.timedelta(minutes=1) < current:
      f.write(before.strftime('%H:%M:%S'))
      f.write(',')
      f.write(current.strftime('%H:%M:%S'))
      f.write(',')
      f.write(str(int((current-before).total_seconds())))
      f.write('\n')
    before  = current

  f.close()

def main(args):
  initialize = args_to_initialize(args)
  client     = initialize['client']
  latest_day = initialize['latest_day']
  oldest_day = initialize['oldest_day']

  for day_back in range(latest_day, oldest_day):
    get_day = datetime.date.today() - datetime.timedelta(day_back)

    save_json_csv(client, get_day, 'activities/heart'                ,'1sec' ,'activities-heart-intraday'                ,'heart')
    save_json_csv(client, get_day, 'activities/distance'             ,'1min' ,'activities-distance-intraday'             ,'distance')
    save_json_csv(client, get_day, 'activities/steps'                ,'1min' ,'activities-steps-intraday'                ,'steps')
    save_json_csv(client, get_day, 'activities/floors'               ,'1min' ,'activities-floors-intraday'               ,'floors')
    save_json_csv(client, get_day, 'activities/minutesSedentary'     ,'1min' ,'activities-minutesSedentary-intraday'     ,'minutesSedentary')
    save_json_csv(client, get_day, 'activities/minutesLightlyActive' ,'1min' ,'activities-minutesLightlyActive-intraday' ,'minutesLightlyActive')
    save_json_csv(client, get_day, 'activities/minutesFairlyActive'  ,'1min' ,'activities-minutesFairlyActive-intraday'  ,'minutesFairlyActive')
    save_json_csv(client, get_day, 'activities/minutesVeryActive'    ,'1min' ,'activities-minutesVeryActive-intraday'    ,'minutesVeryActive')
    save_lack_second_csv(get_day)

if __name__ == '__main__':
  main(sys.argv[1:])

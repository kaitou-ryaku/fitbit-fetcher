# -*- coding: utf-8 -*-
import fitbit
import datetime
from ast import literal_eval
import os
import sys
import requests

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

def get_sleep_json(get_day, access_token):

  if get_day < PURCHASE_DATE :
    return

  get_day_str = get_day.strftime("%Y-%m-%d")
  filename = '{0}/{1}/{2}_{3}.json'.format(CSV_PATH, "sleep_json", get_day_str, "sleep_json")
  if (not IF_OVERWRITE) and os.path.exists(filename) :
    return

  headers = {
    "Authorization": "Bearer " + access_token
  }

  url = "https://api.fitbit.com/1.2/user/-/sleep/date/" + get_day_str + "/" + get_day_str + ".json"

  response = requests.get(url, headers=headers)

  if "Too" in str(response.json()):
    return

  f = open(filename, 'w')
  f.write(str(response.json()))
  f.close()

def get_sleep_analysis(get_day):

  if get_day < PURCHASE_DATE :
    return

  get_day_str = get_day.strftime("%Y-%m-%d")
  filename = '{0}/{1}/{2}_{3}.csv'.format(CSV_PATH, "sleep_analysis", get_day_str, "sleep_analysis")
  if (not IF_OVERWRITE) and os.path.exists(filename) :
    return

  sleep_list = []

  for delta in [-1,0,1]:
    day = get_day + datetime.timedelta(delta)
    day_str = day.strftime("%Y-%m-%d")

    json_filename = '{0}/{1}/{2}_{3}.json'.format(CSV_PATH, "sleep_json", day_str, "sleep_json")
    if not os.path.exists(json_filename):
      continue

    json_data = literal_eval(open(json_filename, 'r').read())

    for connected_sleep in json_data["sleep"]:
      for connected_30secs in connected_sleep["levels"]["data"]:

        current = datetime.datetime.strptime(connected_30secs["dateTime"], "%Y-%m-%dT%H:%M:%S.000")
        level   = connected_30secs["level"]
        seconds = connected_30secs["seconds"]

        for i in range(int(seconds/30)):
          sleep = (current, level)
          sleep_list.append(sleep)
          current += datetime.timedelta(seconds=30)

  sleep_list.sort

  f = open(filename, 'w')
  for sleep in sleep_list:
    if sleep[0].date() == get_day:
      f.write(sleep[0].strftime("%H:%M:%S") + "," + sleep[1] + "\n")
  f.close()

def main(args):
  initialize   = args_to_initialize(args)
  access_token = initialize["access_token"]
  latest_day   = initialize["latest_day"]
  oldest_day   = initialize["oldest_day"]

  # 1週間+1日分のjsonデータを取得
  for day_back in range(latest_day, oldest_day + 1):
    get_day = datetime.date.today() - datetime.timedelta(day_back)
    get_sleep_json(get_day, access_token)

  # 1週間分の睡眠データを計算
  for day_back in range(latest_day, oldest_day):
    get_day = datetime.date.today() - datetime.timedelta(day_back)
    get_sleep_analysis(get_day)

if __name__ == "__main__":
  main(sys.argv[1:])

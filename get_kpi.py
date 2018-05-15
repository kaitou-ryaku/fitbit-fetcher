# -*- coding: utf-8 -*-
import fitbit
import datetime
from ast import literal_eval
import os

CLIENT_ID     = '******'
CLIENT_SECRET = '********************************'
TOKEN_FILE    = 'token.txt'
CSV_PATH      = '***********'
START_DATE    = datetime.date(****, **, **)
DAY_TERM      = 7 # one week

def make_month_file(client, get_day, path, detail_level, column_name, dir_name):

  if get_day < START_DATE:
    return

  get_day_str = get_day.strftime('%Y-%m-%d')

  terms_alldata = client.intraday_time_series(path, base_date=get_day_str, detail_level=detail_level)
  many_terms = terms_alldata[column_name]['dataset']

  f = open('{0}/{1}/{2}_{3}.csv'.format(CSV_PATH, dir_name, get_day_str, dir_name), 'w')

  for term in many_terms:
    f.write("{0},{1}\n".format(term['time'], str(term['value'])))

  f.close()


def make_month_sleep_file(client, get_day):

  if get_day < START_DATE:
    return

  get_day_str = get_day.strftime('%Y-%m-%d')

  sleep_all = client.sleep(date=get_day_str)
  many_sleep = sleep_all['sleep']

  f = open('{0}/sleep/{1}_sleep.csv'.format(CSV_PATH, get_day_str), 'w')

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


def main():
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


  for day_back in range(DAY_TERM):
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
  main()
